import Link from "next/link";
import AddButton from "@/app/components/addButton";

export default function Home() {
  return (
      <div
          className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <AddButton/>
          <button className="text-2xl">
              <Link href="/vocabulary/add/excel">엑셀 파일로 단어 추가하기</Link>
          </button>
          <button className="text-2xl">
              <Link href="/vocabulary">단어 리스트 보러가기</Link>
          </button>
      </div>
  );
}
