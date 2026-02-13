import { Button } from 'react-bootstrap';
import Frame3 from "../assets/Frame3.svg";
import Sidebar from '../components/sidebar/SideBar.tsx';
import '../styles/main_layout.css'
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const MainLayout = () => {
    const location = useLocation();
    const isAuth = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        console.log('Перехід на сторінку:', location.pathname);
    }, [location]);

    return (
        <div className="main_container">
            <div className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img src={Frame3} alt="Frame" />
                    </Link>
                </div>

                <div className="auth_buttons">
                    {!isAuth ? (
                        /* --- НЕ ЗАЛОГІНЕНИЙ --- */
                        <>
                            <Link to="/login">
                                {/* Ця кнопка використовує твій стиль .btn-custom */}
                                <Button variant="custom">Увійти</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="warning">Зареєструватись</Button>
                            </Link>
                        </>
                    ) : (
                        /* --- ЗАЛОГІНЕНИЙ --- */
                        <div style={{ display: 'flex', alignItems: 'center' }}>

                            {/* 👇 КНОПКА АДМІНКИ */}
                            {userRole === 'Admin' && (
                                <Link to="/admin">
                                    {/* Змінили на variant="custom", щоб стиль був такий самий, як у "Увійти" */}
                                    <Button variant="custom">
                                         Адмін Панель
                                    </Button>
                                </Link>
                            )}

                            {/* КНОПКА ПРОФІЛЮ */}
                            <Link to="/profile">
                                <Button className="btn-profile">Мій профіль</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="content">
                <main className="home-page-container">
                    <Sidebar />
                    <div style={{ width: '100%' }}>
                        <Outlet />
                    </div>
                </main>
            </div>

            <footer className="bg-dark text-secondary text-center py-3 border-top border-secondary">
                <p className="mb-0">© 2026 BetPulse Diploma Project</p>
            </footer>
        </div>
    );
};

export default MainLayout;