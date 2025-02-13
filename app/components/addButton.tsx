import Link from "next/link";

export default function AddButton() {
    return (
        <button className="text-4xl hover:text-pink-medium hover:scale-150">
            <Link href="/vocabulary/add">+</Link>
        </button>
    )
}