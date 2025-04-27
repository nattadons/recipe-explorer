import React from 'react';
import { ArrowRight, Search, Book, User } from 'lucide-react';

function HomePage() {
  return (
    <div className="w-full flex-grow bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Welcome Text */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              ยินดีต้อนรับสู่<br />
              <span className="text-blue-600">Recipe Explorer</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              ค้นพบสูตรอาหารหลากหลาย ทำง่าย อร่อย จากทั่วทุกมุมโลก
              เริ่มต้นการเดินทางในโลกแห่งอาหารกับเราวันนี้
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                เริ่มต้นใช้งาน <ArrowRight size={18} className="ml-2" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                ดูวิดีโอแนะนำ
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600 rounded-lg opacity-10 blur-xl"></div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Recipe Explorer" 
                className="relative rounded-lg shadow-lg object-cover w-full"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-center text-2xl font-semibold text-gray-800 mb-12">ค้นพบคุณสมบัติเด่น</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Search size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">ค้นหาสูตรอาหาร</h4>
              <p className="text-gray-600">ค้นหาสูตรอาหารจากทั่วทุกมุมโลกด้วยระบบค้นหาอันชาญฉลาด</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Book size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">คอลเลคชั่นสูตรอาหาร</h4>
              <p className="text-gray-600">สร้างและจัดเก็บคอลเลคชั่นสูตรอาหารโปรดของคุณ</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <User size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">แบ่งปันสูตรอาหาร</h4>
              <p className="text-gray-600">แบ่งปันสูตรอาหารของคุณและเชื่อมต่อกับชุมชนคนรักการทำอาหาร</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">พร้อมที่จะเริ่มต้นการเดินทางในโลกแห่งอาหารแล้วหรือยัง?</h3>
          <p className="text-blue-100 mb-6">สมัครสมาชิกฟรีวันนี้ และค้นพบสูตรอาหารนับพันจากทั่วทุกมุมโลก</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            สมัครสมาชิกฟรี
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomePage;