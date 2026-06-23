import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import HomePage from "../../pages/HomePage/Home";
import TeachersPage from "../../pages/TeachersPage/Teachers";
import FavoritesPage from "../../pages/FavoritesPage/Favorites";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster />
      </main>
    </>
  );
}

export default App;
