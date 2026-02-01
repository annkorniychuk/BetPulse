import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Твій CSS (головне, щоб там не було зайвих відступів)

// Components
import SplashScreen from './components/SplashScreen';

// Pages
import HomePage from './pages/HomePage';
import AdminLayout from './layouts/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminMatchesPage from './pages/AdminMatchesPage';
import RegisterPage from './pages/RegisterPage';
function App() {
    // Стан завантаження: true = показуємо заставку, false = показуємо сайт
    const [isLoading, setIsLoading] = useState(true);

    // Якщо ще вантажиться - показуємо ТІЛЬКИ сплеш
    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }

    // Коли завантажилось - показуємо сайт
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sports" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Адмінка */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="matches" element={<AdminMatchesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;