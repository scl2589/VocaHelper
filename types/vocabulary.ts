import {Book} from "@/types/book";

export type Definition = {
    definition: string;
    partOfSpeech: string;
}

export type Vocabulary = {
    id: number;
    createdAt: Date;
    word: string;
    book: Book;
    chapter: string;
    memorized: boolean;
    definitions: Definition[],
}



