import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 👈 Додав Navigate
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MainLayout from "./layouts/main-layout";
import SplashScreen from './components/SplashScreen';

// Pages
import HomePage from './pages/HomePage';
import AdminLayout from './layouts/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminMatchesPage from './pages/AdminMatchesPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from './pages/ProfilePage';
import AdminPromotionsPage from './pages/AdminPromotionsPage';
import AdminSportsPage from './pages/AdminSportsPage';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/sports" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    {/* 👇 Якщо просто /admin -> кидаємо на Спорт (бо дашборда нема) */}
                    <Route index element={<Navigate to="sports" replace />} />

                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="matches" element={<AdminMatchesPage />} />
                    <Route path="promotions" element={<AdminPromotionsPage />} />
                    <Route path="sports" element={<AdminSportsPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;