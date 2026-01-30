// src/layouts/MainLayout.tsx
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';

    const MainLayout = () => {
    const navigate = useNavigate();
    const isAuth = !!localStorage.getItem('token');
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <>
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">BetPulse</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Головна</Nav.Link>
              <Nav.Link as={Link} to="/promotions">Акції</Nav.Link>
            </Nav>
            <Nav>
              {isAuth ? (
                <>
                    <Link to="/profile" className="me-2">
                        <Button variant="outline-light">Мій Профіль</Button>
                    </Link>
                  <Button variant="danger" onClick={handleLogout}>Вийти</Button>
                </>
              ) : (
                  <Link to="/login" className="me-2">
                <Button variant="warning">Увійти</Button>
                  </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ minHeight: '80vh' }}>
        <Outlet />
      </Container>
            <footer className="bg-dark text-secondary text-center py-3 mt-4 border-top border-secondary">
                <p className="mb-0">© 2026 BetPulse Diploma Project</p>
            </footer>
        </>
    );
};

export default MainLayout;