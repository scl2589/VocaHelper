"use server";

import { supabase } from "@/lib/supabase";
import {revalidatePath} from "next/cache";
import * as XLSX from 'xlsx';
import {Book} from "@/types/book";

export async function getVocabularyBook(): Promise<Book[]> {
    const { data } = await supabase.from("books").select();
    return data || []; // null 방지
}

export async function createVocabularyBook(formData: FormData) {
    const name = formData.get("name") as string;

    try {
        const { error } = await supabase.from("books").insert([{name}]);

        if (error) throw new Error(error.message);

        return { success: true };
    } catch (err) {
        console.error("Error inserting vocabulary book:", err);
        throw new Error("단어장 추가 중 오류가 발생했습니다.");
    }
}

export async function getVocabularies() {
    const {data} = await supabase.from("vocabularies").select();
    return data;
}

export async function deleteVocabulary(formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) {
        throw new Error("삭제할 단어의 ID가 필요합니다.");
    }

    const { error } = await supabase.from("vocabularies").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    // 삭제 후 페이지 새로고침 없이 데이터 갱신
    revalidatePath("/vocabulary");
}

// 📌 단어 정의 타입
interface Definition {
    partOfSpeech: string;
    definition: string;
}

// 📌 엑셀 데이터 타입 (의미/품사 필드는 동적으로 처리)
interface VocabularyRow {
    단어: string;
    [key: string]: string; // "의미1", "품사1", "의미2", "품사2" 등의 동적 필드를 허용
}


export async function createVocabularyFromFile(formData: FormData): Promise<void> {
    const book = formData.get("book") as string;
    const chapter = formData.get("chapter") as string;
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("파일이 필요합니다.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const firstRowData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })[0];

    if (!firstRowData || !firstRowData.includes("단어")) {
        throw new Error("올바른 엑셀 파일이 아닙니다. '단어' 열이 있어야 합니다.");
    }

    // "의미N", "품사N" 컬럼 동적 감지
    const meaningKeys = firstRowData.filter((key) => key.startsWith("의미"));
    const partOfSpeechKeys = firstRowData.filter((key) => key.startsWith("품사"));

    // 엑셀 데이터를 JSON으로 변환
    const json: VocabularyRow[] = XLSX.utils.sheet_to_json(sheet);

    // 단어 데이터 파싱
    const words = json.map((item) => {
        const definitions: Definition[] = [];

        for (let i = 0; i < meaningKeys.length; i++) {
            const meaningKey = meaningKeys[i];
            const partOfSpeechKey = partOfSpeechKeys[i];

            if (item[meaningKey] && item[partOfSpeechKey]) {
                definitions.push({
                    partOfSpeech: item[partOfSpeechKey],
                    definition: item[meaningKey],
                });
            }
        }

        return {
            word: item["단어"],
            definitions,
            book,
            chapter
        };
    });

    // 데이터 저장
    const { error } = await supabase.from("vocabularies").insert(words);

    if (error) {
        throw new Error(`단어 추가 중 오류 발생: ${error.message}`);
    }

    revalidatePath("/");
}