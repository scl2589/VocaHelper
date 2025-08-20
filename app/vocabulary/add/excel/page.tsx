'use client'

import { createVocabularyFromFile, createVocabularyFromMultipleFileSheets } from "@/actions/vocabulary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVocabularyBooks } from "@/actions/vocabularyBook";
import { Book } from '@/types/book';
import PageHeader from "@/components/forms/PageHeader";
import FormCard from "@/components/forms/FormCard";
import BookSelector from "@/components/forms/BookSelector";
import ExcelFileUpload from "@/components/forms/ExcelFileUpload";
import ExcelFormatGuide from "@/components/forms/ExcelFormatGuide";
import SubmitButton from "@/components/forms/SubmitButton";

export default function AddExcelPage() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [isMultipleSheets, setIsMultipleSheets] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const data = await getVocabularyBooks();
            setBooks(data);
        })();
    }, []);

    const handleFileSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            if (isMultipleSheets) {
                await createVocabularyFromMultipleFileSheets(formData);
            } else {
                await createVocabularyFromFile(formData);
            }
            router.push("/"); // ✅ 추가 완료 후 홈으로 이동
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
            <div className="max-w-4xl mx-auto">
                <PageHeader 
                    title="엑셀로 단어 추가하기"
                    actionText="단어 직접 추가"
                    actionHref="/vocabulary/add"
                />

                <FormCard
                    title="엑셀 파일로 단어 추가"
                    description="엑셀 파일을 업로드하여 대량으로 단어를 추가하세요"
                >
                    <form action={handleFileSubmit} className="space-y-6">
                        <BookSelector books={books} required />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                엑셀 파일 타입
                            </label>
                            <select 
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400" 
                                name="type"
                                onChange={(e) => setIsMultipleSheets(e.target.value === 'multiple')}
                            >
                                <option value="single">단일 시트로 이루어진 엑셀 파일</option>
                                <option value="multiple">복수의 시트로 이루어진 엑셀 파일</option>
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isMultipleSheets 
                                    ? "각 시트명이 챕터명으로 사용됩니다." 
                                    : "단일 시트의 경우 챕터명을 직접 입력하세요."
                                }
                            </p>
                        </div>

                        {!isMultipleSheets && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    챕터명
                                </label>
                                <input 
                                    type="text" 
                                    name="chapter" 
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                                    placeholder="예: 1장 채용, Chapter 1"
                                />
                            </div>
                        )}

                        <ExcelFileUpload />

                        <ExcelFormatGuide />

                        <SubmitButton loading={loading}>
                            단어 추가하기
                        </SubmitButton>
                    </form>
                </FormCard>
            </div>
        </div>
    );
}
