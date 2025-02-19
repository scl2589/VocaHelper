import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <svg
                width="150"
                height="50"
                viewBox="0 0 200 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <text x="10" y="35" fontSize="30" fill="#333">Voca Helper</text>
            </svg>
        </Link>
    );
}