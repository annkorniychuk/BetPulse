import { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
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

    // Стани для кастомної модалки видалення
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchSports = async () => {
        try {
            const res = await api.get<Sport[]>('/sports');
            setSports(res.data);
        } catch (e) {
            console.error("Помилка завантаження:", e);
        }
    };

    useEffect(() => {
        fetchSports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await api.put(`/sports/${formData.id}`, { name: formData.name });
                toast.success("Категорію успішно оновлено! ️");
            } else {
                await api.post('/sports', { name: formData.name });
                toast.success("Нову категорію створено! ");
            }
            await fetchSports();
            setShowModal(false);
        } catch (e) {
            console.error("Помилка збереження:", e);
            toast.error("Помилка збереження ");
        }
    };

    // Відкриваємо модалку видалення
    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    // Фактичне видалення після підтвердження
    const confirmDelete = async () => {
        if (itemToDelete === null) return;

        try {
            await api.delete(`/sports/${itemToDelete}`);
            toast.success("Категорію успішно видалено! ");
            await fetchSports();
        } catch (e) {
            console.error("Помилка видалення:", e);
            toast.error("Помилка видалення ");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
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
                <h2 style={{fontWeight: 600}}>Керування Спортом</h2>
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
                                    <Button size="sm" variant="link" style={{textDecoration: 'none', color: '#dc3545'}} onClick={() => handleDeleteClick(sport.id)}>🗑️</Button>
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

            {/* Модалка для додавання/редагування */}
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

            {/* --- КАСТОМНА МОДАЛКА ВИДАЛЕННЯ --- */}
            {showDeleteModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
                    <div style={{ backgroundColor: '#171717', padding: '40px', borderRadius: '16px', border: '1px solid #222', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ color: '#fee000', marginBottom: '15px', fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Підтвердження</h3>
                        <p style={{ color: '#aeb5bc', fontSize: '18px', marginBottom: '30px', margin: '0 0 30px 0' }}>Ви дійсно хочете видалити цю категорію спорту? Цю дію неможливо скасувати.</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                                style={{ flex: 1, padding: '14px', backgroundColor: 'transparent', border: '1px solid #3a414b', color: '#aeb5bc', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{ flex: 1, padding: '14px', backgroundColor: '#dc3545', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSportsPage;