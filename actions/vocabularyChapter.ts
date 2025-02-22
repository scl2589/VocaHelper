import {Chapter} from "@/types/chapter";
import {supabase} from "@/lib/supabase";

export async function getVocabularyChapters(book: string): Promise<Chapter[]> {
    const { data } = await supabase
        .from("chapters")
        .select()
        .eq("book_name", book)
        .order("name", { ascending: true, foreignTable: undefined });

    return data?.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, ""), 10); // 숫자만 추출
        const numB = parseInt(b.name.replace(/\D/g, ""), 10);
        return numA - numB; // 숫자 기준 정렬
    }) || [];
}
