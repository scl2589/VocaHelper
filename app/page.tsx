import Link from "next/link";
import AddButton from "@/components/addButton";

export default function Home() {
  return (
      <div
          className="flex flex-col items-center justify-between gap-4">
          <AddButton path="/vocabulary/add" />
          <button className="text-2xl">
              <Link href="/vocabulary/add/excel">엑셀 파일로 단어 추가하기</Link>
          </button>
          <button className="text-2xl">
              <Link href="/vocabulary">단어 리스트 보러가기</Link>
          </button>
          <button className="text-2xl">
              <Link href="/vocabulary/books">단어책 보러가기</Link>
          </button>
          <button className="text-2xl">
              <Link href="/vocabulary/memorize">단어 외우러 가기</Link>
          </button>
      </div>
  );
}
