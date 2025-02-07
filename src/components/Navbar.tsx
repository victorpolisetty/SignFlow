"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex justify-center space-x-8 p-4 bg-gray-200">
            <Link href="/login">
                <span className={`px-4 py-2 rounded-md cursor-pointer ${pathname === "/login" ? "bg-blue-500 text-white" : "bg-white"}`}>
                    Login
                </span>
            </Link>
            <Link href="/">
                <span className={`px-4 py-2 rounded-md cursor-pointer ${pathname === "/" ? "bg-blue-500 text-white" : "bg-white"}`}>
                    PDF Highlighter
                </span>
            </Link>
            <Link href="/contract-generator">
                <span className={`px-4 py-2 rounded-md cursor-pointer ${pathname === "/contract-generator" ? "bg-blue-500 text-white" : "bg-white"}`}>
                    Contracts
                </span>
            </Link>
        </nav>
    );
}
