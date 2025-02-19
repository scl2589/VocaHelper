import {getVocabularyBook} from "@/actions/vocabularyBook";
import AddButton from "@/components/addButton";

export default async function Page() {
    const books = await getVocabularyBook();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between w-full">
                <h3
                    className="text-2xl font-bold mb-6 text-blue-dark">단어책 목록</h3>
                <AddButton path="/vocabulary/books/add"/>
            </div>
            {books?.map((book) => (
                <div key={book.name} className="w-full bg-white mb-3 p-3 rounded-md drop-shadow-lg ">
                    <div className="flex flex-row items-center">
                            {book.name}
                    </div>
                </div>
            ))}
        </div>
    )
}