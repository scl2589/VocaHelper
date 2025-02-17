'use client'

import { createVocabularyFromFile } from "@/app/actions/vocabulary";
import { useFormStatus } from "react-dom";

export default function AddExcelPage() {
    const { pending } = useFormStatus();

    return (
        <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-dark">엑셀로 단어 추가하기</h3>
            <form action={(formData) => createVocabularyFromFile(formData)} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-lg mb-2">단어장 이름</label>
                    <input type="text" name="book" className="bg-gray-10 p-2 border rounded-md" required />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg mb-2">장/챕터 제목</label>
                    <input type="text" name="chapter" className="bg-gray-10 p-2 border rounded-md" placeholder="1장 채용"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg mb-2">파일 입력</label>
                    <input
                        type="file"
                        accept=".csv,.json,.xlsx"
                        name="file"
                        className="w-full rounded-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-medium w-fit disabled:bg-gray-400"
                    disabled={pending}
                >
                    {pending ? "추가 중..." : "추가하기"}
                </button>
            </form>
        </div>
    );
}