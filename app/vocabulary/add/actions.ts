"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createVocabulary(formData: FormData) {
    // FormData에서 값 추출
    const word = formData.get("word") as string;
    const meaning = formData.get("meaning") as string;
    const partOfSpeech = formData.get("partOfSpeech") as string;

    // 데이터 검증 (필요 시 추가)
    if (!word || !meaning || !partOfSpeech) {
        throw new Error("모든 필드를 입력해주세요.");
    }

    // Supabase에 데이터 삽입
    const { data, error } = await supabase.from("vocabularies").insert([
        {
            word,
            meaning,
            partOfSpeech,
            book: null, // 필요 시 수정
            chapter: null, // 필요 시 수정
        },
    ]);

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);

    // 성공 시 리다이렉트
    redirect("/");
}
