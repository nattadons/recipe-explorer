import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Trash2, ChevronLeft } from 'lucide-react';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดรายการโปรดจาก localStorage
  useEffect(() => {
    const loadFavorites = () => {
      setLoading(true);
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      setLoading(false);
    };

    loadFavorites();
  }, []);

  // ลบรายการโปรด
  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <div className="w-full flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft size={20} />
            <span className="ml-1">กลับไปหน้าหลัก</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">รายการโปรดของฉัน</h1>
          <p className="text-gray-600 mt-2">สูตรอาหารที่คุณได้บันทึกไว้ทั้งหมด {favorites.length} รายการ</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">ยังไม่มีรายการโปรด</h2>
            <p className="text-gray-500 mb-4">คุณยังไม่มีสูตรอาหารที่บันทึกไว้ในรายการโปรด</p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              สำรวจสูตรอาหาร
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-lg shadow overflow-hidden">
                <Link to={`/recipe/${recipe.id}`} className="block">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <Link to={`/recipe/${recipe.id}`} className="block">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2 hover:text-blue-600">{recipe.title}</h3>
                    </Link>
                    <button 
                      onClick={() => removeFromFavorites(recipe.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="ลบออกจากรายการโปรด"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description || 'ไม่มีคำอธิบาย'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {recipe.duration && (
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{recipe.duration}</span>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>{recipe.servings}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;