'use client'

import { FormEvent } from "react";
import { createVocabulary } from "@/actions/vocabulary";
import Form from 'next/form';
import { useRouter } from "next/navigation";
import { useVocabularyForm } from "@/hooks/useVocabularyForm";
import PageHeader from "@/components/forms/PageHeader";
import FormCard from "@/components/forms/FormCard";
import BookSelector from "@/components/forms/BookSelector";
import DefinitionFields from "@/components/forms/DefinitionFields";
import SubmitButton from "@/components/forms/SubmitButton";

export default function AddPage() {
    const router = useRouter();
    const {
        definitions,
        books,
        loading,
        setLoading,
        addDefinitionField,
        removeDefinitionField,
        handleDefinitionChange,
    } = useVocabularyForm();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const result = await createVocabulary(formData);
            if (result.success) {
                router.push('/vocabulary');
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
                    title="단어 추가"
                    actionText="엑셀로 추가"
                    actionHref="/vocabulary/add/excel"
                />

                <FormCard
                    title="새로운 단어 추가"
                    description="단어와 뜻을 입력하여 새로운 단어를 추가하세요"
                >
                    <Form onSubmit={handleSubmit} className="space-y-6" action={""}>
                        <BookSelector books={books} />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                단어
                            </label>
                            <input 
                                type="text" 
                                name="word" 
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400" 
                                placeholder="단어를 입력하세요"
                                required
                            />
                        </div>

                        <DefinitionFields
                            definitions={definitions}
                            onAdd={addDefinitionField}
                            onRemove={removeDefinitionField}
                            onChange={handleDefinitionChange}
                        />

                        <SubmitButton loading={loading}>
                            단어 추가하기
                        </SubmitButton>
                    </Form>
                </FormCard>
            </div>
        </div>
    );
}