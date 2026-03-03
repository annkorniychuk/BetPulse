import { useNavigate } from "react-router-dom";
import "../styles/PopularLeagues.css";

type League = {
    label: string;
    id: number;
};

const leaguesRow1: League[] = [
    { label: "Чемпіонів УЄФА", id: 3 },
    { label: "Прем'єр Ліга", id: 2 },
    { label: "Ла Ліга", id: 6 },
    { label: "Серія A", id: 7 },
];

const leaguesRow2: League[] = [
    { label: "Бундесліга", id: 8 },
    { label: "Ліга 1", id: 9 },
    { label: "NBA", id: 4 },
    { label: "UPL", id: 13 },
];

const PopularLeagues = () => {
    const navigate = useNavigate();

    return (
        <section className="pl">
            <div className="pl__header">
                <b className="pl__title">ПОПУЛЯРНІ ЛІГИ</b>
            </div>
            <div className="pl__grid">
                <div className="pl__row">
                    {leaguesRow1.map((x) => (
                        <button key={x.id} className="pl__btn" type="button" onClick={() => navigate(`/competition/${x.id}`)}>
                            <span className="pl__btnText">{x.label}</span>
                        </button>
                    ))}
                </div>
                <div className="pl__row">
                    {leaguesRow2.map((x) => (
                        <button key={x.id} className="pl__btn" type="button" onClick={() => navigate(`/competition/${x.id}`)}>
                            <span className="pl__btnText">{x.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularLeagues;