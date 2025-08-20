'use client'

import { FormEvent, useState } from "react";
import { createVocabularyBook } from "@/actions/vocabularyBook";
import Form from 'next/form';
import { useRouter } from "next/navigation";
import PageHeader from "@/components/forms/PageHeader";
import FormCard from "@/components/forms/FormCard";
import SubmitButton from "@/components/forms/SubmitButton";

export default function VocabularyBookAddPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const result = await createVocabularyBook(formData);
            if (result.success) {
                router.push('/vocabulary/books');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
            <div className="max-w-4xl mx-auto">
                <PageHeader 
                    title="단어책 추가"
                    actionText="단어책 목록"
                    actionHref="/vocabulary/books"
                />

                <FormCard
                    title="새로운 단어책 만들기"
                    description="새로운 단어책을 생성하여 단어들을 체계적으로 관리하세요"
                >
                    <Form onSubmit={handleSubmit} className="space-y-6" action={""}>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                단어책 이름
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400" 
                                placeholder="예: 토익 단어장, 회화 필수 단어"
                                required 
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                단어책의 목적이나 주제를 반영한 이름을 지어주세요
                            </p>
                        </div>

                        <SubmitButton loading={loading}>
                            단어책 만들기
                        </SubmitButton>
                    </Form>
                </FormCard>
            </div>
        </div>
    );
}