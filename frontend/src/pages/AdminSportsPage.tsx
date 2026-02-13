import { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';

interface Competition {
    id: number;
    name: string;
    country: string;
}

interface Sport {
    id: number;
    name: string;
    competitions: Competition[];
}

const AdminSportsPage = () => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: 0, name: '' });

    // 1. Прибрали useCallback. Просто звичайна функція.
    const fetchSports = async () => {
        try {
            const res = await api.get<Sport[]>('/sports');
            setSports(res.data);
        } catch (e) {
            console.error("Помилка завантаження:", e);
        }
    };

    // 2. Викликаємо її при завантаженні сторінки.
    useEffect(() => {
        fetchSports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 👆 Цей коментар вище ВИМИКАЄ помилку для цього рядка.

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await api.put(`/sports/${formData.id}`, { name: formData.name });
            } else {
                await api.post('/sports', { name: formData.name });
            }
            // Оновлюємо список після збереження
            await fetchSports();
            setShowModal(false);
        } catch (e) {
            console.error("Помилка збереження:", e);
            alert('Помилка збереження');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Видалити?')) {
            try {
                await api.delete(`/sports/${id}`);
                await fetchSports();
            } catch (e) {
                console.error("Помилка видалення:", e);
                alert('Помилка видалення');
            }
        }
    };

    const openModal = (sport?: Sport) => {
        if (sport) {
            setFormData({ id: sport.id, name: sport.name });
            setEditMode(true);
        } else {
            setFormData({ id: 0, name: '' });
            setEditMode(false);
        }
        setShowModal(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{fontWeight: 600}}> Керування Спортом</h2>
                <Button className="btn-warning-pulse" onClick={() => openModal()}>
                    + Додати Категорію
                </Button>
            </div>

            <Row>
                {sports.map(sport => (
                    <Col md={6} xl={4} key={sport.id} className="mb-4">
                        <div className="card-pulse h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span style={{fontSize: '18px'}}>{sport.name}</span>
                                <div>
                                    <Button size="sm" variant="link" style={{textDecoration: 'none', color: '#fee000'}} onClick={() => openModal(sport)}>✏️</Button>
                                    <Button size="sm" variant="link" style={{textDecoration: 'none', color: '#dc3545'}} onClick={() => handleDelete(sport.id)}>🗑️</Button>
                                </div>
                            </div>
                            <div className="card-body">
                                <h6 style={{color: '#999', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>Ліга / Змагання:</h6>
                                {sport.competitions && sport.competitions.length > 0 ? (
                                    <Table className="table-pulse" size="sm">
                                        <tbody>
                                        {sport.competitions.map(comp => (
                                            <tr key={comp.id}>
                                                <td style={{border: 'none', padding: '5px 0'}}>
                                                    {comp.name}
                                                    <span style={{color: '#555', marginLeft: '10px', fontSize: '12px'}}>
                                                            {comp.country || 'Світ'}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p style={{color: '#555', fontStyle: 'italic'}}>Пусто</p>
                                )}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <div style={{backgroundColor: '#141414', border: '1px solid #373737', color: '#fff'}}>
                    <Modal.Header closeButton closeVariant="white" style={{borderBottom: '1px solid #373737'}}>
                        <Modal.Title>{editMode ? 'Редагувати' : 'Додати'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Назва</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-pulse"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer style={{borderTop: '1px solid #373737'}}>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Скасувати</Button>
                        <Button className="btn-warning-pulse" onClick={handleSubmit}>Зберегти</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSportsPage;