import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecipePage from './pages/recipe'; // นำเข้าคอมโพเนนต์หน้า Recipe
import RecipeDetailPage from './pages/recipe_detail'; // นำเข้าคอมโพเนนต์หน้า RecipeDetail
import FavoritePage from './pages/favorite'; // นำเข้าคอมโพเนนต์หน้า Favorite

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar  />
        <main className="flex-grow w-full ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipePage />} /> {/* เพิ่มเส้นทางสำหรับหน้า Recipe */}
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/favorites" element={<FavoritePage />} /> {/* เพิ่มเส้นทางสำหรับหน้า Favorite */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;