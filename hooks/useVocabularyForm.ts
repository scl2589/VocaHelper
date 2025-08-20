import { useState, useEffect } from 'react';
import { getVocabularyBooks } from '@/actions/vocabularyBook';
import { Book } from '@/types/book';

interface Definition {
    id: number;
    partOfSpeech: string;
    definition: string;
}

export function useVocabularyForm() {
    const [definitions, setDefinitions] = useState<Definition[]>([{ id: 0, partOfSpeech: "", definition: "" }]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await getVocabularyBooks();
            setBooks(data);
        };
        loadBooks();
    }, []);

    const addDefinitionField = () => {
        setDefinitions([...definitions, { id: definitions.length, partOfSpeech: "", definition: "" }]);
    };

    const removeDefinitionField = () => {
        if (definitions.length > 1) {
            setDefinitions(definitions.slice(0, -1));
        }
    };

    const handleDefinitionChange = (index: number, field: "partOfSpeech" | "definition", value: string) => {
        setDefinitions((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    return {
        definitions,
        books,
        loading,
        setLoading,
        addDefinitionField,
        removeDefinitionField,
        handleDefinitionChange,
    };
}
