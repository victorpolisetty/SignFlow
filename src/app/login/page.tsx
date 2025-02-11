"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const router = useRouter();

    function handleLogin() {
        if (email === "walker@brighterway.ai" && password === "password") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userType", userType);  // Store user type in local storage
            
            // Redirect based on user type
            if (userType === "creator") {
                router.push("/creator-dashboard");
            } else if (userType === "client") {
                router.push("/client-dashboard");
            } else if (userType === "profile") {
                router.push("/profile");
            } else {
                alert("Please select a user type!");
            }
        } else {
            alert("Invalid credentials!");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-2 w-80"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-2 w-80"
            />
            <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="border p-2 mb-4 w-80"
            >
                <option value="">Select User Type</option>
                <option value="creator">Creator</option>
                <option value="client">Client</option>
                <option value="profile">Profile</option> {/* New Profile option */}
            </select>
            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">
                Login
            </button>
        </div>
    );
}
