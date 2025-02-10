"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const linkStyle = (path) =>
        `px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            pathname === path ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"
        } rounded-md`;

    return (
        <nav className="relative flex items-center justify-between p-4 border-b border-gray-300 bg-white">
            {/* Left-aligned links */}
            <div className="flex space-x-6">
                <Link href="/">
                    <span className={linkStyle("/")}>View Contract</span>
                </Link>
                <Link href="/contract-generator">
                    <span className={linkStyle("/contract-generator")}>Create Contract</span>
                </Link>
            </div>

            {/* Centered Brand Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-800">
                SignFlow
            </div>

            {/* Right-aligned Login button */}
            <div>
                <Link href="/login">
                    <span className={linkStyle("/login")}>Login</span>
                </Link>
            </div>
        </nav>
    );
}
