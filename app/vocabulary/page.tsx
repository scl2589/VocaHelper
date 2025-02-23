import {getVocabularies, deleteVocabulary} from "@/actions/vocabulary";
import AddButton from "@/components/addButton";
import Title from "@/components/Title";

import {Definition} from "@/types/vocabulary";

export default async function vocabularyPage() {
    const vocabularies = await getVocabularies();

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <Title title="단어 목록"/>
                <AddButton path="/vocabulary/add" />
            </div>
            <ul className="flex flex-col items-center bg-gray-100 dark:bg-black md:p-3 h-auto">
            {vocabularies?.map((vocab) => (
                    <li key={vocab.id} className="w-full md:w-5/6 p-1 bg-white dark:bg-gray-700 mb-3 md:p-3 rounded-md shadow-md ">
                        <div className="flex flex-row items-center">
                            <div className="w-40 border-r-2">
                                {vocab.word}
                            </div>
                            <div className="w-64 pl-2">
                                {vocab.definitions.map(({definition, partOfSpeech}:Definition) =>(
                                    <div key={definition}>{partOfSpeech &&
                                        <span className="text-gray-400">({partOfSpeech})</span>} {definition}<br/>
                                    </div>
                                ))}
                            </div>
                            <div className="md:w-96 flex flex-row gap-2">
                                <div>{vocab.memorized ? '외웠어요': '어려워요'}</div>
                                <form action={deleteVocabulary}>
                                    <input type="hidden" name="id" value={vocab.id}/>
                                    <button type="submit" className="text-red-500">
                                        X
                                    </button>
                                </form>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
)
}