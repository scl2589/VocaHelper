import {Definition, Vocabulary} from "@/types/vocabulary";

interface WordCardProps {
    word?: Vocabulary;
    showDefinition: boolean;
}

export default function WordCard({ word, showDefinition }: WordCardProps) {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-3 h-72 rounded-2xl text-2xl mb-5 shadow-xl">
            <span className="mb-3">{word?.word}</span>
            {showDefinition && word?.definitions.map((def: Definition) => (
                <div key={def.definition} className="text-lg">
                    {def?.partOfSpeech && <>({def.partOfSpeech})</>} {def.definition}
                </div>
            ))}
        </div>
    );
}
