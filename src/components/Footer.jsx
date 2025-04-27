import React from 'react';
import { Utensils } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 w-full">
      <div className="container mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Utensils className="text-blue-600 mr-2" size={18} />
            <span className="text-gray-800 font-semibold">Recipe Explorer</span>
          </div>
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Recipe Explorer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;