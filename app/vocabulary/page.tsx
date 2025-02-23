'use client';

import {useState, useEffect} from "react";
import { getVocabularies, deleteVocabulary } from "@/actions/vocabulary";
import AddButton from "@/components/addButton";
import Title from "@/components/Title";
import { Vocabulary, Definition } from "@/types/vocabulary";

export default function VocabularyPage() {
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getVocabularies();
            setVocabularies(data);
        })();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (confirmed) {
            const formData = new FormData();
            formData.append("id", id);
            await deleteVocabulary(formData);
            setVocabularies(vocabularies.filter((vocab) => vocab.id !== id));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <Title title="단어 목록"/>
                <AddButton path="/vocabulary/add" />
            </div>
            <ul className="flex flex-col items-center bg-gray-100 dark:bg-black md:p-3 h-auto">
                {vocabularies?.map((vocab) => (
                    <li key={vocab.id} className="w-full md:w-5/6 p-1 bg-white dark:bg-gray-700 mb-3 md:p-3 rounded-md shadow-md">
                        <div className="flex flex-row items-center">
                            <div className="w-40 border-r-2">
                                {vocab.word}
                            </div>
                            <div className="w-64 pl-2">
                                {vocab.definitions.map(({ definition, partOfSpeech }: Definition) => (
                                    <div key={definition}>
                                        {partOfSpeech && <span className="text-gray-400">({partOfSpeech})</span>} {definition}<br />
                                    </div>
                                ))}
                            </div>
                            <div className="md:w-96 flex flex-row gap-2">
                                <div>{vocab.memorized ? '외웠어요' : '어려워요'}</div>
                                <button
                                    onClick={() => handleDelete(vocab.id)}
                                    className="text-red-500"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
