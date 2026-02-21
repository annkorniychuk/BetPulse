import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useBetSlip } from '../context/BetSlipContext'; // 👈 Додали імпорт контексту
import './CompetitionDetailsPage.css';

interface Competition {
    id: number;
    name: string;
    country: string;
}

interface Match {
    id: number;
    team1: string;
    team2: string;
    startTime: string;
    odds1: number;
    oddsX: number;
    odds2: number;
    status: string;
}

const CompetitionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 👈 Дістаємо функцію setBet з нашого контексту
    const { setBet } = useBetSlip();

    const [competition, setCompetition] = useState<Competition | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compRes = await api.get<Competition>(`/competitions/${id}`);
                setCompetition(compRes.data);

                const matchesRes = await api.get<Match[]>(`/matches?competitionId=${id}`);
                setMatches(matchesRes.data);
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 👈 Оновили функцію: тепер вона приймає весь об'єкт match і передає його в купон
    const handlePlaceBet = (match: Match, betType: string, odds: number) => {
        setBet({
            matchId: match.id,
            team1: match.team1,
            team2: match.team2,
            betType: betType,
            odds: odds
        });
    };

    if (loading) {
        return (
            <div className="details-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (!competition) {
        return (
            <div className="details-container py-5 text-center">
                <h3 className="text-secondary">Змагання не знайдено</h3>
                <Button className="mt-3 btn-back" onClick={() => navigate(-1)}>Повернутися назад</Button>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 details-container">
            <button className="btn-back" onClick={() => navigate(-1)}>
                ❮ Назад до каталогу
            </button>

            <div className="details-header">
                <span className="catalog-badge catalog-badge-country mb-2 d-inline-block">
                    {competition.country}
                </span>
                <h1 className="details-title">{competition.name}</h1>
            </div>

            <h4 className="mb-4" style={{ fontWeight: 600 }}>Доступні матчі</h4>

            {matches.length > 0 ? (
                matches.map(match => (
                    <div key={match.id} className="match-card">
                        <div className="match-info">
                            <div className="match-date">
                                {new Date(match.startTime).toLocaleString('uk-UA', {
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                            <div className="match-teams">
                                <span>🏠 {match.team1}</span>
                                <span>✈️ {match.team2}</span>
                            </div>
                        </div>

                        <div className="odds-container mt-3 mt-md-0">
                            {/* 👈 Оновили виклик функції: передаємо весь об'єкт match */}
                            <button className="btn-odds" onClick={() => handlePlaceBet(match, '1', match.odds1)}>
                                <span className="odds-label">1</span>
                                <span className="odds-value">{match.odds1?.toFixed(2) || '-'}</span>
                            </button>
                            <button className="btn-odds" onClick={() => handlePlaceBet(match, 'X', match.oddsX)}>
                                <span className="odds-label">X</span>
                                <span className="odds-value">{match.oddsX?.toFixed(2) || '-'}</span>
                            </button>
                            <button className="btn-odds" onClick={() => handlePlaceBet(match, '2', match.odds2)}>
                                <span className="odds-label">2</span>
                                <span className="odds-value">{match.odds2?.toFixed(2) || '-'}</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-5" style={{ backgroundColor: '#141414', borderRadius: '8px', border: '1px solid #373737' }}>
                    <h5 style={{ color: '#6c757d' }}>Матчів для цього змагання поки немає</h5>
                </div>
            )}
        </div>
    );
};

export default CompetitionDetailsPage;