import { /*Container,*/ Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Frame3 from "../assets/Frame3.svg";
import Sidebar from '../components/sidebar/SideBar.tsx';
import HomePage from "../pages/HomePage";
import  '../styles/main_layout.css'


const MainLayout = () => {
    const isAuth = !!localStorage.getItem('token');

    return (
        <div className="main_conteiner">
            <div className="navbar">
                <div className="logo">
                    <img src={Frame3} alt="Frame" />
                </div>
                <div className="auth_buttons">
                    {!isAuth ? (
                        <>
                            <Link to="/login">
                                <Button variant="custom">Увійти</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="warning">Зареєструватись</Button>
                            </Link>
                        </>
                    ) : (
                        <Link to="/profile">
                            <Button variant="success">Мій профіль</Button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="content">
                <main className="home-page-container">
                    <Sidebar />
                    <HomePage/>
                </main>
            </div>
            <footer className="bg-dark text-secondary text-center py-3 border-top border-secondary">
                <p className="mb-0">© 2026 BetPulse Diploma Project</p>
            </footer>
        </div>
    );
};

export default MainLayout;













// import { Navbar, Container, Nav, Button } from 'react-bootstrap';
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import Frame3 from "../assets/Frame3.svg";
//
// const MainLayout = () => {
//     const navigate = useNavigate();
//     const isAuth = !!localStorage.getItem('token');
//
//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/login');
//         navigate('/register');
//     };
//
//     return (
//         <div className="layout d-flex flex-column min-vh-100">
//             <div className="frame-parent">
//                 <img className="frame-child" src={Frame3} alt="Frame" />
//                 <div className="sign-parent">
//                     <div className="sign">
//                         <Link to="/login" className="me-2">
//                             <Button variant="warning">Увійти</Button>
//                         </Link>
//                     </div>
//                     <div className="sign2">
//                         <Link to="/register" className="me-3">
//                         <Button variant="warning">Зареєструватись</Button>
//                     </Link>
//                     </div>
//                 </div>
//             </div>
//             {/*<Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary">*/}
//             {/*    <Container>*/}
//             {/*        <Navbar.Brand as={Link} to="/">BetPulse</Navbar.Brand>*/}
//             {/*        <Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
//             {/*        <Navbar.Collapse id="basic-navbar-nav">*/}
//             {/*            <Nav>*/}
//             {/*                {isAuth ? (*/}
//             {/*                    <>*/}
//             {/*                        <Button variant="danger" onClick={handleLogout}>*/}
//             {/*                            Вийти*/}
//             {/*                        </Button>*/}
//             {/*                    </>*/}
//             {/*                ) : (*/}
//             {/*                    <>*/}
//             {/*                        <Link to="/login" className="me-2">*/}
//             {/*                            <Button variant="warning">Увійти</Button>*/}
//             {/*                        </Link>*/}
//             {/*                        <Link to="/register" className="me-3">*/}
//             {/*                            <Button variant="warning">Зареєструватись</Button>*/}
//             {/*                        </Link>*/}
//             {/*                    </>*/}
//             {/*                )}*/}
//             {/*            </Nav>*/}
//             {/*        </Navbar.Collapse>*/}
//             {/*    </Container>*/}
//             {/*</Navbar>*/}
//             <div className="layout-body d-flex flex-grow-1">
//                 <aside className="sidebar bg-dark text-light p-3 d-none d-md-block" style={{ width: 240 }}>
//                     Sidebar
//                 </aside>
//                 <main className="flex-grow-1 py-4">
//                     <Container>
//                         <Outlet />
//                     </Container>
//                 </main>
//             </div>
//             <footer className="bg-dark text-secondary text-center py-3 border-top border-secondary">
//                 <p className="mb-0">© 2026 BetPulse Diploma Project</p>
//             </footer>
//         </div>
//     );
// };
//
// export default MainLayout;
