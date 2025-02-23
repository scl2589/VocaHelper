export type Definition = {
    definition: string;
    partOfSpeech?: string;
}

export type Vocabulary = {
    id: string;
    createdAt?: Date;
    word: string;
    book: string;
    chapterId?: string;
    memorized?: boolean;
    definitions: Definition[],
    count: number;
}



