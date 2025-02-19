'use client'

import { useState, FormEvent, useEffect } from "react";
import { createVocabulary } from "@/actions/vocabulary";
import { getVocabularyBook } from "@/actions/vocabularyBook";
import Form from 'next/form';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Book} from '@/types/book'

export default function AddPage() {
    const [definitions, setDefinitions] = useState([{ id: 0, partOfSpeech: "", definition: "" }]);
    const [books, setBooks] = useState<Book[]>([]);
    const router = useRouter();

    useEffect(() => {
        (async() => {
            const data = await getVocabularyBook();
            setBooks(data);
        })();
    }, [])

    // 입력 필드 추가
    const addDefinitionField = () => {
        setDefinitions([...definitions, { id: definitions.length, partOfSpeech: "", definition: "" }]);
    };

    // 입력 필드 삭제
    const removeDefinitionField = () => {
        if (definitions.length > 1) {
            setDefinitions(definitions.slice(0, -1));
        }
    };

    // 입력값 변경 핸들러
    const handleChange = (index: number, field: "partOfSpeech" | "definition", value: string) => {
        setDefinitions((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const result = await createVocabulary(formData);
            if (result.success) {
                router.push('/vocabulary');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div>
            <h3 className="text-2xl font-bold mb-6 text-blue-dark">단어 추가</h3>
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4" action={""}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg">단어장</label>
                    <div className="flex flex-row items-center justify-between">
                        <select className="bg-gray-10 p-2 border rounded-md">
                            {books.map((book) => <option key={book.name} value={book.name}>{book.name}</option>)}
                        </select>
                        <Link href="/vocabulary/books/add" className="text-sm hover:text-pink-medium hover:scale-125">단어책 추가</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-lg">단어</label>
                    <input type="text" name="word" className="bg-gray-10 p-2 border rounded-md" required/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-lg">뜻</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={addDefinitionField}
                                className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                            >
                                +
                            </button>
                            <button
                                type="button"
                                onClick={removeDefinitionField}
                                className="px-3 py-1 bg-red-300 text-white rounded-md hover:bg-red-400"
                                disabled={definitions.length <= 1}
                            >
                                -
                            </button>
                        </div>
                    </div>
                    <div>
                        {definitions.map((item, index) => (
                            <div key={item.id} className="flex flex-row gap-2 mb-2 items-center">
                                <select
                                    name="partOfSpeech"
                                    className="bg-gray-10 p-2 border rounded-md w-1/4"
                                    value={item.partOfSpeech}
                                    onChange={(e) => handleChange(index, "partOfSpeech", e.target.value)}
                                >
                                    <option value="">없음</option>
                                    <option value="명">명사</option>
                                    <option value="동">동사</option>
                                    <option value="형">형용사</option>
                                    <option value="부">부사</option>
                                    <option value="전치사">전치사</option>
                                    <option value="접속사">접속사</option>
                                </select>
                                <input
                                    type="text"
                                    name="definition"
                                    className="bg-gray-10 p-2 border rounded-md w-3/4"
                                    value={item.definition}
                                    onChange={(e) => handleChange(index, "definition", e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-medium w-fit"
                >
                    단어 추가하기
                </button>
            </Form>
        </div>
    );
}