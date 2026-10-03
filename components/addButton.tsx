import Link from "next/link";
export default function AddButton({path}: {path: string}) {
 return <Link href={path} className="study-secondary whitespace-nowrap">＋ 단어 추가</Link>;
}
