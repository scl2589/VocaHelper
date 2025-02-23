import Link from "next/link";

export default function AddButton({path}: {path: string}) {
    return (
        <button className="text-2xl md:text-4xl hover:text-pink-medium hover:scale-150">
            <Link href={path}>+</Link>
        </button>
    )
}