"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Home, Settings } from "lucide-react";

const Nav = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative bg-white shadow-lg border-b border-gray-100">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
            <Link
              href="/"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center flex-1 justify-center sm:justify-start sm:ml-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative transform transition-transform duration-200 ease-in-out group-hover:scale-105">
                <Image
                  alt="Video course starter kit"
                  height={32}
                  src="/images/mux-logo.png"
                  width={100}
                  className="rounded"
                />
              </div>
              <span className="font-medium text-slate-700 hidden sm:inline group-hover:text-blue-600 transition-colors duration-200">
                Video Course Starter Kit
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            {session && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
            {session ? (
              <div className="text-sm text-slate-700">
                <span className="mr-3 px-3 py-1 bg-gray-100 rounded-full">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`absolute top-[65px] left-0 right-0 bg-white border-b border-t sm:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0 z-50"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          {session && (
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span>Admin</span>
            </Link>
          )}
          {session ? (
            <div className="px-3 py-2">
              <div className="text-sm">
                <div className="px-3 py-1 bg-gray-100 rounded-full inline-block mb-2 text-slate-700">
                  {session.user?.email}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                signIn();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 mx-2"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
