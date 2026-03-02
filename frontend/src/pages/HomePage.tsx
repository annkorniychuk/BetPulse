import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { getCompetitions } from "../api/axiosConfig";
import "./HomePage.css";
import GameCard from "../components/GameCard";

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
            <div className="container-fluid p-0">
                {/* Карусель */}
                <div className="carousel-section home-wide">
                    <Carousel />
                </div>

                {/* Контент */}
                <div className="container home-content mt-4">
                    {/* категорії */}
                    <div className="quick-categories">
                        <button className="category-btn">ВОЛЕЙБОЛ</button>
                        <button className="category-btn">ФУТБОЛ</button>
                        <button className="category-btn">БАСКЕТБОЛ</button>
                        <button className="category-btn">ТЕНІС</button>
                    </div>

                    {/* ліги */}
                    <div className="popular-leagues mt-4">
                        <button className="league-btn">Чемпіонів УЄФА</button>
                        <button className="league-btn">Європи УЄФА</button>
                        <button className="league-btn">Прем’єр Ліга</button>
                        <button className="league-btn">Ла Ліга</button>
                        <button className="league-btn">Серія А</button>
                        <button className="league-btn">Бундесліга</button>
                        <button className="league-btn">Ліга 1</button>
                        <button className="league-btn">Кубок Іспанії</button>
                    </div>

                    {/* ігри */}
                    <div className="popular-games mt-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            competitions.map((c) => (
                                <GameCard
                                    key={c.id}
                                    homeTeam={c.name}
                                    awayTeam={c.country}
                                    homeOdd={1.59}
                                    awayOdd={2.56}
                                />
                            ))
                        )}
                    </div>

                    {/* решта секцій */}
                    <div className="games-grid mt-4">
                        <div className="grid-section">
                            <h3>Вибрані Ігри</h3>
                            <div className="grid-cards">{/*апі*/}</div>
                        </div>
                    </div>
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
