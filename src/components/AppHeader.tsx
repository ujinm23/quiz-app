"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function AppHeader() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border">
      <p className="ml-6 text-2xl font-semibold text-black bg-clip-text bg-[length:200%_200%]">
        Quiz App
      </p>
      <div className="flex items-center gap-4 mr-6">
        <SignedOut>
          <SignInButton mode="modal">
            <span className="cursor-pointer font-medium text-sm text-black hover:text-[#6c47ff] hover:underline">
              Sign In
            </span>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-black hover:bg-[#5b3ce6] text-white rounded-full font-medium h-8 px-4 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
