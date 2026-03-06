import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './AdminPromotionsPage.css';
import api from '../api/axiosConfig';

interface Promotion {
    id: number;
    name: string;
    promoCode: string;
    description: string;
    discountPercentage: number;
}

const AdminPromotionsPage = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        promoCode: '',
        description: '',
        discount: ''
    });

    // Стани для модалки видалення
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchPromotions = () => {
        api.get<Promotion[]>('/promotions')
            .then(res => setPromotions(res.data))
            .catch(e => console.error(e));
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post('/promotions', {
                name: formData.name,
                promoCode: formData.promoCode,
                description: formData.description,
                discount: parseFloat(formData.discount)
            });

            toast.success("Купон успішно створено! ️");
            setFormData({ name: '', promoCode: '', description: '', discount: '' });
            fetchPromotions();
        } catch (e) {
            console.error(e);
            toast.error("Помилка створення купона ");
        }
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete === null) return;

        try {
            await api.delete(`/promotions/${itemToDelete}`);
            toast.success("Купон успішно видалено! ️");
            fetchPromotions();
        } catch (e) {
            console.error(e);
            toast.error("Помилка видалення ");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className="promotions-title">Акції та Купони</h2>

            <Row>
                <Col lg={4} className="mb-4">
                    <div className="card-pulse">
                        <div className="card-header">Створити новий купон</div>
                        <div className="card-body">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Назва Акції</Form.Label>
                                    <Form.Control name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Новорічна знижка" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Промокод</Form.Label>
                                    <Form.Control name="promoCode" value={formData.promoCode} onChange={handleChange} type="text" placeholder="NEW2026" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Опис</Form.Label>
                                    <Form.Control name="description" value={formData.description} onChange={handleChange} type="text" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Знижка (число)</Form.Label>
                                    <Form.Control name="discount" value={formData.discount} onChange={handleChange} type="number" step="0.01" className="form-control-pulse" />
                                </Form.Group>
                                <Button className="btn-warning-pulse w-100 mt-2" onClick={handleCreate}>Створити Купон</Button>
                            </Form>
                        </div>
                    </div>
                </Col>

                <Col lg={8}>
                    <div className="card-pulse">
                        <div className="card-header">Активні кампанії</div>
                        <div className="card-body p-0">
                            <Table className="table-pulse" responsive hover>
                                <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th>Код</th>
                                    <th>Опис</th>
                                    <th>Знижка</th>
                                    <th className="text-end pe-3">Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {promotions.map(p => (
                                    <tr key={p.id}>
                                        <td style={{fontWeight: 600}}>{p.name}</td>
                                        <td className="promo-code-text">{p.promoCode}</td>
                                        <td>{p.description}</td>
                                        <td style={{color: '#20c997', fontWeight: 600}}>{p.discountPercentage}</td>
                                        <td className="text-end pe-3">
                                            <button className="btn-delete-icon" onClick={() => handleDeleteClick(p.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* --- КАСТОМНА МОДАЛКА ВИДАЛЕННЯ --- */}
            {showDeleteModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
                    <div style={{ backgroundColor: '#171717', padding: '40px', borderRadius: '16px', border: '1px solid #222', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ color: '#fee000', marginBottom: '15px', fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Підтвердження</h3>
                        <p style={{ color: '#aeb5bc', fontSize: '18px', marginBottom: '30px', margin: '0 0 30px 0' }}>Ви дійсно хочете видалити цей купон? Цю дію неможливо скасувати.</p>
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

export default AdminPromotionsPage;