// components/Header.js
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">
                Jewelry<span className="text-amber-500">AI</span>
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Pricing
            </a>
            <a
              href="#demo"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Demo
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <button className="text-slate-600 hover:text-slate-900 font-medium">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Start Free
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </header>
  );
}
