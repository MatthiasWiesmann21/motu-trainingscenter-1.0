"use client"
import { getServerSession } from 'next-auth';

export default async function EmailVerified(){
  
  return (
    <div className="max-w-[600px] mx-auto my-12 bg-white p-5 rounded-lg shadow-md font-sans">
      <div className="text-center py-5 bg-[#0a0118] rounded-t-lg">
        <h1 className="text-white my-2 text-2xl">Clubyte</h1>
      </div>
      <div className="p-5 text-center text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Email Verified Successfully!</h2>
        <p className="mb-2">Dear User,</p>
        <p className="mb-6">Thank you for verifying your email address</p>
        <a 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-[#eb238a] text-white rounded-md hover:bg-[#FF1493] transition-colors duration-200"
        >
          Go to Dashboard
        </a>
      </div>
      <div className="text-center text-sm text-gray-600 mt-6">
        <p className="mb-2">Clubyte &copy; 2024. All rights reserved.</p>
      </div>
    </div>
  );
}