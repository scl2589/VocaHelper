import {getVocabularyBooks} from "@/actions/vocabularyBook";
import AddButton from "@/components/addButton";
import React from "react";
import Title from "@/components/Title";

export default async function Page() {
    const books = await getVocabularyBooks();

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <Title title="단어책 목록"/>
                <AddButton path="/vocabulary/books/add"/>
            </div>
            {books?.map((book) => (
                <div key={book.name} className="w-full bg-white mb-3 p-3 rounded-md drop-shadow-lg dark:text-darkWhiteBgText">
                    <div className="flex flex-row items-center">
                        {book.name}
                    </div>
                </div>
            ))}
        </div>
    )
}