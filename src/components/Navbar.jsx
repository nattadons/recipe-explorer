import React from 'react';
import { Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-white shadow w-full">
      <div className="container mx-auto px-6 py-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="text-blue-600 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Recipe Explorer</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">หน้าหลัก</Link>
            <Link to="/recipes" className="text-gray-600 hover:text-blue-600 transition-colors">สูตรอาหาร</Link>
            <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">หมวดหมู่</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">เกี่ยวกับเรา</Link>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors hidden md:block">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;