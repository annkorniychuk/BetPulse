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

    // ДІСТАЄМО УСІ ПАРАМЕТРИ З ПОСИЛАННЯ
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const searchCountry = searchParams.get('country');
    const searchSportId = searchParams.get('sportId');

    const navigate = useNavigate();

    // СИНХРОНІЗУЄМО СТАН КНОПОК З URL
    useEffect(() => {
        if (searchSportId) {
            setSelectedSport(Number(searchSportId));
        } else {
            setSelectedSport(null);
        }
    }, [searchSportId]);

    useEffect(() => {
        api.get<Competition[]>('/competitions')
            .then(res => setCompetitions(res.data))
            .catch(e => console.error(e));

        api.get<Sport[]>('/sports')
            .then(res => setSports(res.data))
            .catch(e => console.error(e));
    }, []);

    // 👇 ОНОВЛЕНА ЛОГІКА ФІЛЬТРАЦІЇ (Пошук по назві змагання АБО спорту)
    const filteredCompetitions = competitions.filter(c => {
        const query = searchQuery.toLowerCase();

        // Знаходимо ім'я спорту для поточної картки (або пустий рядок, якщо не знайдено)
        const sportName = sports.find(s => s.id === c.sportId)?.name.toLowerCase() || '';

        // Шукаємо співпадіння АБО в назві ліги, АБО в назві спорту
        const matchesSearch = c.name.toLowerCase().includes(query) || sportName.includes(query);

        const matchesSport = selectedSport ? c.sportId === selectedSport : true;
        const matchesCountry = searchCountry ? c.country === searchCountry : true;

        return matchesSearch && matchesSport && matchesCountry;
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
        navigate(`/competition/${id}`);
    };

    // Обробник кліку по кнопці "Всі"
    const handleClearFilters = () => {
        setSelectedSport(null);
        setSearchParams({}); // Очищаємо URL повністю
    };

    // Обробник кліку по спорту
    const handleSelectSport = (sportId: number) => {
        setSelectedSport(sportId);
        searchParams.set('sportId', sportId.toString());
        searchParams.delete('country'); // Скидаємо країну, бо ми змінили спорт
        setSearchParams(searchParams);
    };

    return (
        <div className="container-fluid px-4 py-4 catalog-container">
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

            <h2 className="catalog-title">
                {/* ВИВОДИМО КРАЇНУ В ЗАГОЛОВОК, ЯКЩО ВОНА ВИБРАНА */}
                {searchQuery ? `РЕЗУЛЬТАТИ ПОШУКУ: "${searchQuery}"` : 'СПОРТИВНІ ПОДІЇ'}
                {searchCountry && !searchQuery && ` — ${searchCountry}`}
            </h2>

            <Row className="mb-4">
                <Col className="d-flex gap-2 flex-wrap">
                    <Button
                        className={`btn-filter ${selectedSport === null ? 'active' : ''}`}
                        onClick={handleClearFilters}
                    >
                        Всі
                    </Button>
                    {sports.map(sport => (
                        <Button
                            key={sport.id}
                            className={`btn-filter ${selectedSport === sport.id ? 'active' : ''}`}
                            onClick={() => handleSelectSport(sport.id)}
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
                        Нічого не знайдено {searchCountry && `в країні ${searchCountry}`}
                    </h5>
                )}
            </Row>
        </div>
    );
};

export default SportsCatalogPage;