import { createVocabulary } from "@/app/actions/vocabulary";
import Form from 'next/form'

export default function AddPage() {
    return (
        <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-dark">단어 추가</h3>
            <Form action={createVocabulary} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-lg mb-2">단어</label>
                    <input type="text" name="word" className="bg-gray-10 p-2 border rounded-md" required />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg mb-2">뜻</label>
                    <input type="text" name="definition" className="bg-gray-10 p-2 border rounded-md" required />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg mb-2">품사</label>
                    <select name="partOfSpeech" className="bg-gray-10 p-2 border rounded-md">
                        <option value=''>없음</option>
                        <option value="명">명사</option>
                        <option value="동">동사</option>
                        <option value="형">형용사</option>
                        <option value="부">부사</option>
                        <option value="전치사">전치사</option>
                        <option value="접속사">접속사</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-medium w-fit"
                >
                    추가하기
                </button>
            </Form>
        </div>
    );
}