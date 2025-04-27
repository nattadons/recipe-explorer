import React from 'react';
import { Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            <Utensils className="text-blue-600 h-8 w-8" />
            <span className="self-center text-xl font-semibold text-gray-800">
              Recipe Explorer
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <Link to="/" className="hover:underline hover:text-blue-600 me-4 md:me-6">
                หน้าหลัก
              </Link>
            </li>
            <li>
              <Link to="/recipes" className="hover:underline hover:text-blue-600 me-4 md:me-6">
                สูตรอาหาร
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto" />
        <span className="block text-sm text-gray-500 sm:text-center">
          © {new Date().getFullYear()}{' '}
          <Link to="/" className="hover:underline hover:text-blue-600">
            Recipe Explorer
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;