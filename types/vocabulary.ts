export type Definition = {
    definition: string;
    partOfSpeech?: string;
}

export type CreateVocabulary = {
    word: string;
    book: string;
    chapter_id?: string;
    definitions: Definition[],
    count: number;
}

export type Vocabulary = {
    id: string;
    createdAt: Date;
    word: string;
    book: string;
    chapter_id?: string;
    memorized?: boolean;
    definitions: Definition[],
    count: number;
}



