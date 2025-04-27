import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Users, Globe, Bookmark, Share2, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          const mealData = data.meals[0];
          
          // รวบรวมส่วนผสมและปริมาณที่ไม่ว่างเปล่า
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim() !== '') {
              ingredients.push({
                name: ingredient,
                measure: measure || ''
              });
            }
          }
          
          // แยกขั้นตอนจากข้อความเป็นอาร์เรย์
          const instructionSteps = mealData.strInstructions
            .split(/\r\n|\n|\r/)
            .filter(step => step.trim() !== '')
            .map(step => step.trim());
          
          const formattedRecipe = {
            id: mealData.idMeal,
            title: mealData.strMeal,
            category: mealData.strCategory,
            area: mealData.strArea || 'ทั่วโลก',
            instructions: instructionSteps,
            ingredients: ingredients,
            image: mealData.strMealThumb,
            tags: mealData.strTags ? mealData.strTags.split(',') : [],
            youtube: mealData.strYoutube,
            source: mealData.strSource,
            dateModified: mealData.dateModified,
            // ข้อมูลจำลอง (TheMealDB ไม่มีข้อมูลเหล่านี้)
            prepTime: '15 นาที',
            cookTime: '30 นาที',
            totalTime: '45 นาที',
            servings: `${Math.floor(Math.random() * 4) + 1} คน`,
            calories: `${Math.floor(Math.random() * 500) + 200} แคลอรี่`,
            rating: (Math.random() * 2 + 3).toFixed(1), // สุ่มคะแนน 3-5 ดาว
            reviews: Math.floor(Math.random() * 100) + 5, // สุ่มจำนวนรีวิว
            description: instructionSteps.length > 0 ? instructionSteps[0].slice(0, 120) + '...' : '' // สร้างคำอธิบายสั้นๆ
          };
          
          setRecipe(formattedRecipe);
          
          // ตรวจสอบว่าสูตรนี้อยู่ในรายการโปรดหรือไม่
          checkIfFavorite(mealData.idMeal);
        } else {
          setError('ไม่พบข้อมูลสูตรอาหาร');
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // ตรวจสอบว่าสูตรนี้อยู่ในรายการโปรดหรือไม่
  const checkIfFavorite = (recipeId) => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.some(fav => fav.id === recipeId));
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแท็บ
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // แปลงลิงก์ YouTube เป็นรูปแบบที่ฝังได้
  const getEmbedYoutubeUrl = (url) => {
    if (!url) return null;
    
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  // เพิ่ม/ลบ สูตรอาหารจากรายการโปรด
  const toggleFavorite = () => {
    if (!recipe) return;
    
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (isFavorite) {
      // ลบออกจากรายการโปรด
      favorites = favorites.filter(fav => fav.id !== recipe.id);
      setIsFavorite(false);
    } else {
      // เพิ่มเข้าไปในรายการโปรด
      const favoriteRecipe = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        duration: recipe.totalTime,
        servings: recipe.servings,
        description: recipe.description,
        category: recipe.category,
        area: recipe.area
      };
      favorites.push(favoriteRecipe);
      setIsFavorite(true);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  // เรนเดอร์เนื้อหาตามแท็บที่เลือก
  const renderTabContent = () => {
    if (!recipe) return null;
    
    switch (activeTab) {
      case 'ingredients':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">ส่วนผสมทั้งหมด ({recipe.ingredients.length})</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-medium">{ingredient.name}</span>
                    {ingredient.measure && (
                      <span className="text-gray-500 ml-2">({ingredient.measure})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'instructions':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">ขั้นตอนการทำ</h3>
            <ol className="space-y-6">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex">
                  <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="text-gray-700">{step}</div>
                </li>
              ))}
            </ol>
            
            {/* แสดงวิดีโอสาธิตถ้ามี */}
            {recipe.youtube && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">วิดีโอสาธิต</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe 
                    className="w-full h-72 rounded-lg"
                    src={getEmbedYoutubeUrl(recipe.youtube)} 
                    title={`วิดีโอสาธิตการทำ ${recipe.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'nutrition':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">ข้อมูลโภชนาการ (ต่อ 1 หน่วยบริโภค)</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">แคลอรี่</div>
                  <div className="text-lg font-semibold">{recipe.calories}</div>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">คาร์โบไฮเดรต</div>
                  <div className="text-lg font-semibold">{Math.floor(Math.random() * 60) + 20} ก.</div>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">โปรตีน</div>
                  <div className="text-lg font-semibold">{Math.floor(Math.random() * 30) + 10} ก.</div>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">ไขมัน</div>
                  <div className="text-lg font-semibold">{Math.floor(Math.random() * 20) + 5} ก.</div>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">น้ำตาล</div>
                  <div className="text-lg font-semibold">{Math.floor(Math.random() * 10) + 1} ก.</div>
                </div>
                <div className="p-3 bg-white rounded-md">
                  <div className="text-sm text-gray-500">โซเดียม</div>
                  <div className="text-lg font-semibold">{Math.floor(Math.random() * 500) + 100} มก.</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                * ข้อมูลโภชนาการเป็นค่าประมาณ และอาจแตกต่างกันตามวัตถุดิบที่ใช้
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium">
              กลับไปหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-gray-50">
      {recipe && (
        <>
          {/* รูปภาพหลักและข้อมูลพื้นฐาน */}
          <div className="w-full bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700">
                  <ChevronLeft size={20} />
                  <span className="ml-1">กลับไปหน้ารายการอาหาร</span>
                </Link>
                <Link to="/favorites" className="text-blue-600 hover:text-blue-700">
                  รายการโปรดของฉัน
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
                  
                  <div className="flex items-center text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < Math.floor(recipe.rating) ? "currentColor" : "none"} 
                        className={i < Math.floor(recipe.rating) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{recipe.rating} ({recipe.reviews} รีวิว)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <Globe size={18} className="mr-1" />
                    <span>{recipe.area}</span>
                    {recipe.category && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{recipe.category}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-1 text-sm">
                        <Clock size={16} className="mr-1" />
                        <span>เวลาเตรียม</span>
                      </div>
                      <div className="font-medium">{recipe.prepTime}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-1 text-sm">
                        <Clock size={16} className="mr-1" />
                        <span>เวลาทำ</span>
                      </div>
                      <div className="font-medium">{recipe.cookTime}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-1 text-sm">
                        <Users size={16} className="mr-1" />
                        <span>สำหรับ</span>
                      </div>
                      <div className="font-medium">{recipe.servings}</div>
                    </div>
                  </div>
                  
                  {recipe.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-2">แท็ก:</div>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={toggleFavorite}
                      className={`flex items-center ${
                        isFavorite 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } px-4 py-2 rounded-lg transition-colors`}
                    >
                      <Bookmark size={18} className="mr-2" fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? 'บันทึกแล้ว' : 'บันทึก'}
                    </button>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* แท็บควบคุมและเนื้อหา */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'ingredients'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('ingredients')}
              >
                ส่วนผสม
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'instructions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('instructions')}
              >
                วิธีทำ
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'nutrition'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('nutrition')}
              >
                โภชนาการ
              </button>
            </div>
            
            {renderTabContent()}
          </div>
          
          {/* แหล่งที่มา */}
          {recipe.source && (
            <div className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500">
                แหล่งที่มา: <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{recipe.source}</a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecipeDetailPage;