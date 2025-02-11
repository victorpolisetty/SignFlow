"use client";
import { useState } from "react";

export default function ProfilePage() {
    const [companyName, setCompanyName] = useState("Brighterway AI");
    const [companyLogo, setCompanyLogo] = useState("/brighterway-logo.png");
    const [address, setAddress] = useState("655 Gough St, San Francisco, CA 94102");
    const [businessDescription, setBusinessDescription] = useState(
        "Brighterway AI uses advanced artificial intelligence to speed up the medical record review process for physicians in medlegal exams. Our technology highlights the most relevant information for a doctor's specialty, helping them streamline their review process and save valuable time."
    );
    const [website, setWebsite] = useState("https://www.brighterway.ai");
    const [contactEmail, setContactEmail] = useState("walker@brighterway.ai");
    const [phone, setPhone] = useState("+1 904-651-3819");
    const [companyMission, setCompanyMission] = useState(
        "Our mission is to empower physicians by simplifying the medical record review process. Brighterway AI structures and deduplicates disorganized medical records, extracting medically relevant content related to a doctor's specialty so they can focus on what matters most."
    );    

    return (
        <div className="container mx-auto p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Company Profile</h1>

            {/* Company Logo */}
            <div className="mb-6 flex items-center">
                <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="w-32 h-32 object-cover border border-gray-200 rounded"
                />
                <div className="ml-6">
                    <h2 className="text-2xl font-semibold">{companyName}</h2>
                    <p className="text-gray-600">{address}</p>
                </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2">Business Description</h3>
                    <p className="text-gray-700">{businessDescription}</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Company Mission</h3>
                    <p className="text-gray-700">{companyMission}</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Website</h3>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {website}
                    </a>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                    <p className="text-gray-700">Email: <a href={`mailto:${contactEmail}`} className="text-blue-500">{contactEmail}</a></p>
                    <p className="text-gray-700">Phone: {phone}</p>
                </div>
            </div>

            {/* Public Data Section */}
            <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">SignFlow AI Linked Public Data</h2>
                <p className="text-gray-700 mb-4">
                    Sources retrieved using SignFlow AI to improve your contract workflow experience.
                </p>
                <ul className="list-disc pl-6">
                    <li>
                        <a href="https://www.linkedin.com/company/brighterwayai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="https://www.crunchbase.com/organization/brighterway-8814" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            Crunchbase
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
