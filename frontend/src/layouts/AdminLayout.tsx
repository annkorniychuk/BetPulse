import { Outlet, Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap'; // 👈 Прибрав зайві Row, Col

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
            {/* SIDEBAR */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-4 fw-bold text-warning">VBet Admin</span>
                </a>
                <hr />
                <Nav className="flex-column mb-auto">
                    <Nav.Item>
                        <Link to="/admin" className={`nav-link text-white ${location.pathname === '/admin' ? 'active bg-primary' : ''}`}>
                            📊 Головна
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/admin/users" className={`nav-link text-white ${location.pathname === '/admin/users' ? 'active bg-primary' : ''}`}>
                            👥 Користувачі
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/admin/matches" className={`nav-link text-white ${location.pathname === '/admin/matches' ? 'active bg-primary' : ''}`}>
                            ⚽ Матчі
                        </Link>
                    </Nav.Item>
                </Nav>
                <hr />
                <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic" className="d-flex align-items-center text-white text-decoration-none">
                        <strong>Адміністратор</strong>
                    </Dropdown.Toggle>
                    {/* 👇 ТУТ БУЛА ПОМИЛКА: замінив text="dark" на variant="dark" */}
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="/">На сайт</Dropdown.Item>
                        <Dropdown.Item href="#">Вийти</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* MAIN CONTENT */}
            <div className="w-100">
                <Navbar bg="white" className="border-bottom shadow-sm px-4 mb-4">
                    <span className="text-muted">Панель керування</span>
                </Navbar>
                <Container fluid className="px-4">
                    <Outlet />
                </Container>
            </div>
        </div>
    );
};

export default AdminLayout;