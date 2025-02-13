"use server";

import { supabase } from "@/lib/supabase";

export async function addWord(word: string, meaning: string, partOfSpeech: string) {
    const { data, error } = await supabase
        .from("vocabularies")
        .insert([{ word, meaning, partOfSpeech, book: "", chapter: "" }]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}