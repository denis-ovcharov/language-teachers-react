import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import HomePage from "../../pages/Home/Home";
import TeachersPage from "../../pages/Teachers/Teachers";
import FavoritesPage from "../../pages/Favorites/Favorites";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/language-teachers-react" element={<HomePage />} />
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
