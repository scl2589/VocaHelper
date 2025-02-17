import {getVocabularies, deleteVocabulary} from "@/app/actions/vocabulary";
import AddButton from "@/app/components/addButton";

type Definition = {
    definition: string;
    partOfSpeech: string;
}

export default async function vocabularyPage() {
    const vocabularies = await getVocabularies();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between w-full">
                <h3
                className="text-2xl font-bold mb-6 text-blue-dark">단어 목록</h3>
                <AddButton/>
            </div>
            <ul className="flex flex-col items-center bg-gray-100 p-3 h-auto">
            {vocabularies?.map((vocab) => (
                    <li key={vocab.id} className="w-5/6 bg-white mb-3 p-3 rounded-md shadow-md ">
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
                            <div className="w-96 flex flex-row gap-2">
                                <div>{vocab.memorized ? '외웠어요': '어려워요'}</div>
                                <form action={deleteVocabulary}>
                                    <input type="hidden" name="id" value={vocab.id}/>
                                    <button type="submit" className="text-red-500">
                                        삭제하기
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