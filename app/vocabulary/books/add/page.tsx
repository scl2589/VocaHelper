'use client'

import { FormEvent } from "react";
import { createVocabularyBook } from "@/actions/vocabularyBook";
import Form from 'next/form';
import {useRouter} from "next/navigation";

export default function VocabularyBookAddPage() {
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const result = await createVocabularyBook(formData);
            if (result.success) {
                router.push('/vocabulary/books');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div >
            <h3 className="text-2xl font-bold mb-6 text-blue-dark">단어장 추가</h3>
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4" action={""}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg">단어장 이름</label>
                    <input type="text" name="name" className="bg-gray-10 p-2 border rounded-md" required />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-medium w-fit"
                >
                    단어장 추가하기
                </button>
            </Form>
        </div>
    );
}