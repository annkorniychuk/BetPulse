import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { getCompetitions } from "../api/axiosConfig";
import "./HomePage.css";

type Competition = {
    id: number;
    name: string;
    sportId: number;
    country: string;
};

const HomePage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCompetitions();
                setCompetitions(data);
            } catch (error) {
                console.error("Failed to load competitions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-page">
             {/*карусель*/}
            <div className="carousel-section">
                <Carousel />
            </div>

            {/*категорії*/}
            <div className="quick-categories container mt-4">
                <button className="category-btn">ВОЛЕЙБОЛ</button>
                <button className="category-btn">ФУТБОЛ</button>
                <button className="category-btn">БАСКЕТБОЛ</button>
                <button className="category-btn">ТЕНІС</button>
            </div>
            {/*ліги*/}
            <div className="popular-leagues container mt-4">
                <button className="league-btn">Чемпіонів УЄФА</button>
                <button className="league-btn">Європи УЄФА</button>
                <button className="league-btn">Прем’єр Ліга</button>
                <button className="league-btn">Ла Ліга</button>
                <button className="league-btn">Серія А</button>
                <button className="league-btn">Бундесліга</button>
                <button className="league-btn">Ліга 1</button>
                <button className="league-btn">Кубок Іспанії</button>
            </div>
            {/*компетітіон*/}
            <div className="popular-games container mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    competitions.map(c => (
                        <div key={c.id} className="game-card">
                            {c.name} — {c.country} — Sport ID: {c.sportId}
                        </div>
                    ))
                )}
            </div>
            <div className="games-grid container mt-4">
                <div className="grid-section">
                    <h3>Вибрані Ігри</h3>
                    <div className="grid-cards">
                        {/*апі*/}
                    </div>
                </div>
                <div className="grid-section">
                    <h3>Нові Ігри</h3>
                    <div className="grid-cards">{/*map*/}</div>
                </div>
                <div className="grid-section">
                    <h3>Лайв-Казино</h3>
                    <div className="grid-cards">{/*map*/}</div>
                </div>
                <div className="grid-section">
                    <h3>Популярні Ігри</h3>
                    <div className="grid-cards">{/*map*/}</div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;






// import { useEffect, useState } from "react";
// import Carousel from "../components/Carousel";
// import { getCompetitions } from "../api/axiosConfig";
// import "./HomePage.css";
//
// type Competition = {
//     id: number;
//     name: string;
//     sportId: number;
//     country: string;
// };
//
// const HomePage = () => {
//     const [competitions, setCompetitions] = useState<Competition[]>([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await getCompetitions();
//                 setCompetitions(data);
//             } catch (error) {
//                 console.error("Failed to load competitions", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     return (
//         <div>
//             <div className="container-fluid p-0">
//                 <Carousel />
//             </div>
//
//             <div className="container mt-4">
//                 {loading && <p>Loading...</p>}
//
//                 <div className="row">
//                     {competitions.map(c => (
//                         <div key={c.id} className="col-md-4 mb-3">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5>{c.name}</h5>
//                                     <p>Country: {c.country}</p>
//                                     <p>Sport ID: {c.sportId}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default HomePage;
