import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/admin.css';

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="admin-wrapper">
            {/* САЙДБАР */}
            <aside className="admin-sidebar">
                <Link to="/" className="brand">
                    BetPulse <span className="text-warning">Admin</span>
                </Link>

                <nav className="admin-nav">
                    {/* 👇 Дашборд прибрав, тепер першим йде Спорт */}
                    <Link to="/admin/sports" className={`admin-nav-link ${location.pathname.includes('/sports') ? 'active' : ''}`}>
                        Спорт і Ліги
                    </Link>
                    <Link to="/admin/competitions" className={`admin-nav-link ${location.pathname.includes('/matches') ? 'active' : ''}`}>
                        Змагання
                    </Link>
                    <Link to="/admin/promotions" className={`admin-nav-link ${location.pathname.includes('/promotions') ? 'active' : ''}`}>
                        Акції та Купони
                    </Link>
                    <Link to="/admin/users" className={`admin-nav-link ${location.pathname.includes('/users') ? 'active' : ''}`}>
                        Користувачі
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/">
                        <Button variant="outline-light" className="w-100 btn-back-site">← На сайт</Button>
                    </Link>
                </div>
            </aside>

            {/* ОСНОВНИЙ КОНТЕНТ */}
            <div className="admin-content">
                {/* Хедер */}
                <header className="admin-header">
                    <div className="admin-header-title">
                        Панель керування {location.pathname !== '/admin' && `/ ${location.pathname.split('/').pop()}`}
                    </div>
                    <div>
                        <span className="admin-user-badge">Admin User</span>
                        {/* Жовтий кружечок аватара */}
                        <span style={{ display: 'inline-block', width: '32px', height: '32px', backgroundColor: '#fee000', borderRadius: '50%', verticalAlign: 'middle' }}></span>
                    </div>
                </header>

                {/* Тіло сторінки */}
                <main className="admin-page-body">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;