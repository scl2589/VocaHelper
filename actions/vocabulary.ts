"use server";

import { supabase } from "@/lib/supabase";
import {revalidatePath} from "next/cache";
import * as XLSX from 'xlsx';
import {Vocabulary, CreateVocabulary} from "@/types/vocabulary";


export async function createVocabulary(formData: FormData) {
    // FormData에서 값 추출
    const word = formData.get("word") as string;
    const definitions = formData.getAll("definition") as string[];
    const partsOfSpeech = formData.getAll("partOfSpeech") as string[];

    // 데이터 검증
    if (!word) {
        throw new Error("단어를 입력해주세요.");
    }
    if (definitions.length === 0 || definitions.some((def) => !def.trim())) {
        throw new Error("적어도 하나의 뜻을 입력해주세요.");
    }

    // 뜻과 품사를 객체 배열로 변환
    const definitionObjects = definitions.map((definition, index) => ({
        definition,
        partOfSpeech: partsOfSpeech[index] || "", // 품사가 비어 있을 수 있음
    }));

    try {
        // Supabase에 데이터 삽입
        const { error } = await supabase.from("vocabularies").insert([
            {
                word,
                definitions: definitionObjects,
                book: null,
                chapter: null,
            },
        ]);

        if (error) throw new Error(error.message);

        // 성공 시 리다이렉트
        return { success: true };
    } catch (err) {
        console.error("Error inserting vocabulary:", err);
        throw new Error("단어 추가 중 오류가 발생했습니다.");
    }
}

export async function getVocabularies(): Promise<Vocabulary[]> {
    const { data, error } = await supabase.from("vocabularies").select();

    if (error) {
        console.error("Error fetching vocabularies:", error);
        return [];
    }

    return data || [];
}

export async function getVocabulariesByChapters(selectedChapters: string[]): Promise<Vocabulary[]> {
    if (selectedChapters.length === 0) return [];

    const { data, error } = await supabase
        .from("vocabularies")
        .select("*, chapters(id, name)")
        .in("chapter_id", selectedChapters);

    if (error) {
        console.error("Error fetching vocabularies:", error);
        return [];
    }

    return data || [];
}

export const updateVocabulary = async (data: Vocabulary): Promise<void> => {
    const { error } = await supabase
        .from('vocabularies')
        .update({ count: data.count + 1 })
        .eq('word', data.word)
        .eq('book', data.book)
        .select()

    if (error) throw new Error(error.message);
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

    // ✅ 해당 챕터가 존재하는지 확인
    let selectedChapter;
    const { data: existingChapter, error: chapterError } = await supabase
        .from("chapters")
        .select("id")
        .eq("book_name", book)
        .eq("name", chapter)
        .single();

    if (chapterError && chapterError.code === "PGRST116") {
        // ✅ 존재하지 않는다면 새로운 챕터 생성
        const { data: newChapter, error: newChapterError } = await supabase
            .from("chapters")
            .insert([{ book_name: book, name: chapter }])
            .select("id")
            .single();

        if (newChapterError) {
            throw new Error(`챕터 추가 중 오류 발생: ${newChapterError.message}`);
        }

        selectedChapter = newChapter;
    } else if (chapterError) {
        throw new Error(`챕터 조회 중 오류 발생: ${chapterError.message}`);
    } else {
        selectedChapter = existingChapter;
    }

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
            chapter_id: selectedChapter?.id,
            count: 0,
        };
    });

    // 데이터 저장
    const { error } = await supabase.from("vocabularies").insert(words);

    if (error) {
        throw new Error(`단어 추가 중 오류 발생: ${error.message}`);
    }

    revalidatePath("/");
}

export async function createVocabularyFromMultipleFileSheets(formData: FormData): Promise<void> {
    const book = formData.get("book") as string;
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("파일이 필요합니다.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });

    const allWords: CreateVocabulary[] = [];

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const json: VocabularyRow[] = XLSX.utils.sheet_to_json(sheet);

        // ✅ 해당 챕터가 존재하는지 확인
        let chapter; // chapter는 변경될 가능성이 있으므로 let 유지
        const { data: existingChapter, error: chapterError } = await supabase
            .from("chapters")
            .select("id")
            .eq("book_name", book)
            .eq("name", sheetName)
            .single();

        if (chapterError && chapterError.code === "PGRST116") {
            // ✅ 존재하지 않는다면 새로운 챕터 생성
            const { data: newChapter, error: newChapterError } = await supabase
                .from("chapters")
                .insert([{ book_name: book, name: sheetName }])
                .select("id")
                .single();

            if (newChapterError) {
                throw new Error(`챕터 추가 중 오류 발생: ${newChapterError.message}`);
            }

            chapter = newChapter;
        } else if (chapterError) {
            throw new Error(`챕터 조회 중 오류 발생: ${chapterError.message}`);
        } else {
            chapter = existingChapter;
        }

        const words = json.map((item: VocabularyRow) => ({
            word: item["단어"],
            definitions: [{ definition: item["의미"] }],
            book,
            chapter_id: chapter?.id,
            count: 0,
        }));

        allWords.push(...words);
    }

    // ✅ 단어 데이터 삽입
    const { error } = await supabase.from("vocabularies").insert(allWords);

    if (error) {
        throw new Error(`단어 추가 중 오류 발생: ${error.message}`);
    }

    revalidatePath("/");
}