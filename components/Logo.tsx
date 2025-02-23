import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 w-36 h-14 md:w-48 md:h-20">
            <svg
                viewBox="0 0 200 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <text x="0" y="35" fontSize="30" fill="#333">Voca Helper</text>
            </svg>
        </Link>
    );
}