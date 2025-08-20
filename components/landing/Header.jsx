// components/Header.js
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Jewelry<span className="text-amber-500">AI</span>
            </h1>
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
            <SignedOut>
              <SignInButton>
                <button className="text-slate-600 hover:text-slate-900 font-medium">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Start Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
