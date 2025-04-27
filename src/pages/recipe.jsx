import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function RecipePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allMeals, setAllMeals] = useState([]);
  const observer = useRef();
  
  // Initial data fetching
  useEffect(() => {
    // ฟังก์ชันเพื่อดึงข้อมูลสูตรอาหารทั้งหมด
    const fetchAllRecipes = async () => {
      try {
        setLoading(true);
        
        // ดึงข้อมูลอาหารประเภทซีฟู้ด (สามารถเปลี่ยนเป็นประเภทอื่นได้)
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
        const data = await response.json();
        
        if (data.meals) {
          // กำจัดรายการที่ซ้ำกันก่อนตั้งแต่เริ่มต้น
          const uniqueIds = new Set();
          const uniqueMeals = data.meals.filter(meal => {
            // ถ้า ID นี้ยังไม่เคยมี เพิ่มเข้าไปและเก็บรายการนี้
            if (!uniqueIds.has(meal.idMeal)) {
              uniqueIds.add(meal.idMeal);
              return true;
            }
            // ถ้า ID นี้มีแล้ว ไม่เก็บรายการนี้
            return false;
          });
          
          console.log(`กรองรายการอาหารแล้ว: เดิม ${data.meals.length} รายการ, ไม่ซ้ำ ${uniqueMeals.length} รายการ`);
          
          setAllMeals(uniqueMeals);
          // เรียกฟังก์ชัน loadMoreRecipes เพื่อโหลดข้อมูลชุดแรก
          await loadMoreRecipes(uniqueMeals, 1);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  // ฟังก์ชันสำหรับโหลดข้อมูลเพิ่มเติมแบบแบ่งหน้า
  const loadMoreRecipes = async (meals, currentPage) => {
    try {
      setLoading(true);
      
      // หาจำนวนรายการที่มีอยู่แล้ว
      const currentRecipeCount = recipes.length;
      
      // ถ้ามีอาหารครบ 24 รายการแล้ว ไม่ต้องโหลดเพิ่ม
      if (currentRecipeCount >= 24) {
        console.log("ถึงขีดจำกัด 24 รายการแล้ว ไม่โหลดเพิ่มเติม");
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      // คำนวณ index เริ่มต้นและสิ้นสุด
      const startIndex = (currentPage - 1) * 6;
      // ถ้าไม่มีข้อมูลเพิ่มเติม
      if (startIndex >= meals.length) {
        console.log("ไม่มีข้อมูลเพิ่มเติม");
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      // คำนวณจำนวนรายการที่ต้องการโหลดเพิ่ม (ไม่เกิน 6 รายการ หรือ ไม่เกินที่จะทำให้ครบ 24 รายการ)
      const itemsToLoad = Math.min(6, 24 - currentRecipeCount);
      const endIndex = startIndex + itemsToLoad;
      
      console.log(`กำลังโหลดรายการ ${startIndex + 1} ถึง ${endIndex} (จากทั้งหมด ${meals.length} รายการ)`);
      
      // เลือกเฉพาะข้อมูลสำหรับหน้าปัจจุบัน
      const currentPageMeals = meals.slice(startIndex, endIndex);
      
      // ตรวจสอบ ID ที่มีอยู่แล้วเพื่อป้องกันการซ้ำ
      const existingIds = recipes.map(recipe => recipe.id);
      console.log("รายการ ID ที่มีอยู่แล้ว:", existingIds);
      
      // กรองเฉพาะรายการที่ยังไม่มี ID ซ้ำ
      const uniquePageMeals = currentPageMeals.filter(
        meal => !existingIds.includes(meal.idMeal)
      );
      
      console.log(`กำลังโหลดข้อมูลเพิ่มเติม: ${uniquePageMeals.length} รายการที่ไม่ซ้ำ (จาก ${currentPageMeals.length} รายการ)`);
      
      if (uniquePageMeals.length === 0) {
        // ถ้าไม่มีรายการใหม่ที่ไม่ซ้ำ ให้ลองโหลดหน้าถัดไป
        console.log("ไม่มีรายการใหม่ที่ไม่ซ้ำในหน้านี้ ลองโหลดหน้าถัดไป");
        if (endIndex < meals.length && currentRecipeCount < 24) {
          setPage(prevPage => prevPage + 1);
          return;
        } else {
          console.log("ไม่มีข้อมูลเพิ่มเติมที่ไม่ซ้ำ");
          setHasMore(false);
          setLoading(false);
          return;
        }
      }
      
      // ดึงข้อมูลเพิ่มเติมสำหรับแต่ละสูตร
      const detailedRecipes = await Promise.all(
        uniquePageMeals.map(async (meal, index) => {
          try {
            const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const detailData = await detailResponse.json();
            const detailedMeal = detailData.meals[0];
            
            // ถ้าไม่มีข้อมูลสำหรับ ID นี้
            if (!detailedMeal) {
              console.log(`ไม่พบข้อมูลสำหรับ ID: ${meal.idMeal}`);
              return null;
            }
            
            return {
              id: detailedMeal.idMeal,
              uniqueKey: `${detailedMeal.idMeal}-${currentPage}-${index}-${Date.now()}`, // สร้าง key ที่ไม่ซ้ำแน่นอน
              title: detailedMeal.strMeal,
              image: detailedMeal.strMealThumb,
              duration: '30 นาที', // TheMealDB ไม่มีข้อมูลนี้ ใช้ค่าเริ่มต้น
              servings: `${Math.floor(Math.random() * 4) + 1} คน`, // สร้างข้อมูลจำลอง
              description: detailedMeal.strInstructions.slice(0, 100) + '...' // ตัดให้สั้น
            };
          } catch (error) {
            console.error('Error fetching meal details:', error);
            return null;
          }
        })
      );
      
      const validRecipes = detailedRecipes.filter(recipe => recipe !== null);
      console.log(`ได้ข้อมูลสมบูรณ์: ${validRecipes.length} รายการ`);
      
      // เพิ่มสูตรอาหารใหม่เข้าไปในรายการที่มีอยู่แล้ว
      setRecipes(prevRecipes => {
        // ตรวจสอบซ้ำอีกครั้งก่อนเพิ่มลงในรายการ
        const existingIds = prevRecipes.map(r => r.id);
        const trulyUniqueRecipes = validRecipes.filter(newRecipe => !existingIds.includes(newRecipe.id));
        
        console.log(`เพิ่มเข้าไปในรายการ: ${trulyUniqueRecipes.length} รายการ`);
        
        const newRecipes = [...prevRecipes, ...trulyUniqueRecipes];
        
        // ตรวจสอบว่ายังมีข้อมูลเพิ่มเติมหรือไม่
        if (newRecipes.length >= 24) {
          console.log("ถึงขีดจำกัด 24 รายการแล้ว");
          setHasMore(false);
        }
        
        return newRecipes;
      });
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการ infinite scroll
  const lastRecipeElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          loadMoreRecipes(allMeals, nextPage);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, allMeals]);

  // กรองรายการอาหารตามคำค้นหา
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ฟังก์ชันสำหรับค้นหาด้วย API
  const searchRecipes = async (query) => {
    if (!query) return;
    
    try {
      setLoading(true);
      setHasMore(false); // ปิดการโหลดเพิ่มเติมเมื่อค้นหา
      setPage(1); // รีเซ็ตหน้าเป็น 1
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      
      if (data.meals) {
        console.log(`ค้นหาพบ: ${data.meals.length} รายการ`);
        
        // ตรวจสอบและกำจัดรายการซ้ำ
        const uniqueIds = new Set();
        const uniqueMeals = data.meals.filter(meal => {
          if (!uniqueIds.has(meal.idMeal)) {
            uniqueIds.add(meal.idMeal);
            return true;
          }
          return false;
        });
        
        console.log(`หลังกรองรายการซ้ำ: ${uniqueMeals.length} รายการที่ไม่ซ้ำ`);
        
        const formattedRecipes = uniqueMeals.map((meal, index) => ({
          id: meal.idMeal,
          uniqueKey: `${meal.idMeal}-search-${index}-${Date.now()}`, // สร้าง key ที่ไม่ซ้ำสำหรับการค้นหา
          title: meal.strMeal,
          image: meal.strMealThumb,
          duration: '30 นาที',
          servings: `${Math.floor(Math.random() * 4) + 1} คน`,
          description: meal.strInstructions.slice(0, 100) + '...'
        }));
        
        // จำกัดผลลัพธ์ไม่เกิน 24 รายการ
        setRecipes(formattedRecipes.slice(0, 24));
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // จัดการการส่งแบบฟอร์มค้นหา
  const handleSearch = (e) => {
    e.preventDefault();
    searchRecipes(searchQuery);
  };

  // รีเซ็ตการค้นหาและโหลดข้อมูลใหม่
  const resetSearch = () => {
    setSearchQuery('');
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    
    // ป้องกันกรณี allMeals เป็น null หรือ undefined
    if (allMeals && allMeals.length > 0) {
      console.log("รีเซ็ตการค้นหาและโหลดข้อมูลใหม่ทั้งหมด");
      loadMoreRecipes(allMeals, 1);
    } else {
      // ถ้า allMeals ไม่มีข้อมูล ให้เริ่มดึงข้อมูลใหม่ทั้งหมด
      console.log("ไม่มีข้อมูลอาหารในระบบ ดึงข้อมูลใหม่");
      const fetchNewData = async () => {
        try {
          setLoading(true);
          const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
          const data = await response.json();
          
          if (data.meals) {
            // กำจัดรายการที่ซ้ำกัน
            const uniqueIds = new Set();
            const uniqueMeals = data.meals.filter(meal => {
              if (!uniqueIds.has(meal.idMeal)) {
                uniqueIds.add(meal.idMeal);
                return true;
              }
              return false;
            });
            
            setAllMeals(uniqueMeals);
            await loadMoreRecipes(uniqueMeals, 1);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
          setLoading(false);
        }
      };
      
      fetchNewData();
    }
  };

  return (
    <div className="w-full flex-grow bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">ค้นพบสูตรอาหารที่คุณชื่นชอบ</h1>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
              <div className="pl-4">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ค้นหาสูตรอาหาร..."
                className="w-full py-3 px-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition"
              >
                ค้นหา
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recipe List Section */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">สูตรอาหารยอดนิยม</h2>
          <div>
            <span className="text-gray-600">แสดง {filteredRecipes.length} รายการ {recipes.length >= 24 && '(สูงสุด 24 รายการ)'}</span>
          </div>
        </div>
        
        {/* แสดงสถานะ loading เมื่อกำลังโหลดข้อมูลครั้งแรก */}
        {loading && recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={resetSearch}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe, index) => {
                // ใช้ uniqueKey ที่สร้างขึ้นหรือสร้าง fallback key ในกรณีที่ไม่มี
                const uniqueKey = recipe.uniqueKey || `${recipe.id}-${index}-${Math.random().toString(36).substring(2, 9)}`;
                
                // ใช้ ref สำหรับ element สุดท้ายเพื่อตรวจสอบ infinite scroll
                if (filteredRecipes.length === index + 1) {
                  return (
                    <div 
                      ref={lastRecipeElementRef}
                      key={uniqueKey} 
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <Link to={`/recipe/${recipe.id}`} className="block">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">{recipe.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span>{recipe.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-1" />
                              <span>{recipe.servings}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={uniqueKey} 
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <Link to={`/recipe/${recipe.id}`} className="block">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">{recipe.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span>{recipe.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-1" />
                              <span>{recipe.servings}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
            
            {/* แสดงสถานะ loading เมื่อกำลังโหลดข้อมูลเพิ่มเติม */}
            {loading && recipes.length > 0 && (
              <div className="text-center mt-6 py-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">กำลังโหลดข้อมูลเพิ่มเติม...</p>
              </div>
            )}
            
            {/* End of list indicator */}
            {!hasMore && !loading && recipes.length > 0 && (
              <div className="text-center mt-6 py-4 border-t border-gray-200">
                <p className="text-gray-600">แสดงรายการทั้งหมดแล้ว</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            {loading ? (
              <div>
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600">ไม่พบสูตรอาหารที่คุณค้นหา</p>
                <button 
                  onClick={resetSearch}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  แสดงทั้งหมด
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipePage;