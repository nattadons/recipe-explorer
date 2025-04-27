import React from 'react';
import { ArrowRight, Search, ChefHat, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const goToRecipePage = () => {
    navigate('/recipes');
  };
  return (
    <div className="w-full flex-grow bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Welcome Text */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              ยินดีต้อนรับสู่<br />
              <span className="text-blue-600">Recipe Explorer</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-prose">
              ค้นพบสูตรอาหารหลากหลาย ทำง่าย อร่อย จากทั่วทุกมุมโลก
              เริ่มต้นการเดินทางในโลกแห่งอาหารกับเราวันนี้
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <button className="bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm" 
              onClick={goToRecipePage}>
                เริ่มต้นใช้งาน <ArrowRight size={16} className="ml-2" />
              </button>

            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/2">
            <div className="relative max-w-lg mx-auto md:ml-auto md:mr-0">
              <div className="absolute -inset-1 bg-blue-600 rounded-lg opacity-10 blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Recipe Explorer"
                className="relative rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-16 sm:mt-20 md:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10 text-center">
            ค้นพบคุณสมบัติเด่น
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Search size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">ค้นหาสูตรอาหาร</h3>
              <p className="text-gray-600 text-sm sm:text-base">ค้นพบสูตรอาหารจากทั่วทุกมุมโลกด้วยระบบค้นหาอัจฉริยะของเรา</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">สูตรอาหารมากมาย</h3>
              <p className="text-gray-600 text-sm sm:text-base">เข้าถึงสูตรอาหารนับพันรายการ ครอบคลุมทุกประเภทและทุกระดับความยาก</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <ChefHat size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">เรียนรู้จากผู้เชี่ยวชาญ</h3>
              <p className="text-gray-600 text-sm sm:text-base">สูตรอาหารจากเชฟมืออาชีพ พร้อมเคล็ดลับและเทคนิคพิเศษที่ช่วยให้การทำอาหารง่ายขึ้น</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 sm:mt-16 bg-blue-600 text-white rounded-xl p-6 sm:p-8 text-center shadow-lg">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">พร้อมที่จะเริ่มต้นการเดินทางในโลกแห่งอาหารแล้วหรือยัง?</h3>
            <p className="text-blue-100 mb-5 sm:mb-6 max-w-2xl mx-auto">ค้นพบสูตรอาหารนับพันจากทั่วทุกมุมโลกและเริ่มต้นการเดินทางสู่โลกแห่งรสชาติอันน่าตื่นตาตื่นใจ</p>
            <button className="bg-white text-blue-600 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm inline-flex items-center justify-center"  
            onClick={goToRecipePage}>
              เริ่มต้นค้นหาสูตรอาหาร
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;