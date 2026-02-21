import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axiosConfig';
import './SportsCatalogPage.css';

interface Sport {
    id: number;
    name: string;
}

interface Competition {
    id: number;
    name: string;
    sportId: number;
    sport?: Sport;
    country: string;
}

const SportsCatalogPage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    // Додали хук для навігації
    const navigate = useNavigate();

    useEffect(() => {
        api.get<Competition[]>('/competitions')
            .then(res => setCompetitions(res.data))
            .catch(e => console.error(e));

        api.get<Sport[]>('/sports')
            .then(res => setSports(res.data))
            .catch(e => console.error(e));
    }, []);

    const filteredCompetitions = competitions.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSport = selectedSport ? c.sportId === selectedSport : true;
        return matchesSearch && matchesSport;
    });

    const handleAddFavorite = async (id: number) => {
        try {
            await api.post(`/profile/favorites/${id}`);
            toast.success('Додано в улюблене! ❤️');
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === 401) {
                toast.error('Будь ласка, авторизуйтесь, щоб додавати в улюблене.');
            } else if (err.response?.status === 400) {
                toast.warning('Це змагання вже у вашому списку!');
            } else {
                toast.error('Помилка при додаванні');
            }
        }
    };

    const handleViewDetails = (id: number) => {
        // Замість alert реально переходимо на нову сторінку
        navigate(`/competition/${id}`);
    };

    return (
        <div className="container-fluid px-4 py-4 catalog-container">
            {/* Контейнер для відображення повідомлень */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                theme="dark"
            />

            <h2 className="catalog-title">
                {searchQuery ? `РЕЗУЛЬТАТИ ПОШУКУ: "${searchQuery}"` : 'СПОРТИВНІ ПОДІЇ'}
            </h2>

            <Row className="mb-4">
                <Col className="d-flex gap-2 flex-wrap">
                    <Button
                        className={`btn-filter ${selectedSport === null ? 'active' : ''}`}
                        onClick={() => setSelectedSport(null)}
                    >
                        Всі
                    </Button>
                    {sports.map(sport => (
                        <Button
                            key={sport.id}
                            className={`btn-filter ${selectedSport === sport.id ? 'active' : ''}`}
                            onClick={() => setSelectedSport(sport.id)}
                        >
                            {sport.name}
                        </Button>
                    ))}
                </Col>
            </Row>

            <Row className="g-3">
                {filteredCompetitions.length > 0 ? (
                    filteredCompetitions.map(c => (
                        <Col key={c.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                            <Card className="catalog-card">
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        {/* Замінили Bootstrap Badge на span з нашими класами */}
                                        <span className="catalog-badge catalog-badge-sport">
                                            {sports.find(s => s.id === c.sportId)?.name || 'Спорт'}
                                        </span>
                                        <span className="catalog-badge catalog-badge-country">
                                            {c.country}
                                        </span>
                                    </div>
                                    <Card.Title className="catalog-card-title">
                                        {c.name}
                                    </Card.Title>

                                    <div className="d-flex gap-2 mt-auto pt-4">
                                        <Button
                                            className="w-100 btn-catalog-details"
                                            onClick={() => handleViewDetails(c.id)}
                                        >
                                            Деталі
                                        </Button>
                                        <Button
                                            className="btn-catalog-favorite"
                                            onClick={() => handleAddFavorite(c.id)}
                                            title="Додати в улюблене"
                                        >
                                            ❤️
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <h5 className="catalog-empty-msg">
                        За запитом "{searchQuery}" нічого не знайдено
                    </h5>
                )}
            </Row>
        </div>
    );
};

export default SportsCatalogPage;