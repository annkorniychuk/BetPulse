import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
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

            setFormData({ name: '', promoCode: '', description: '', discount: '' });
            fetchPromotions();
        } catch (e) {
            console.error(e);
            alert("Помилка створення купона");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Видалити цей купон?')) {
            try {
                await api.delete(`/promotions/${id}`);
                fetchPromotions();
            } catch (e) {
                console.error(e);
                alert("Помилка видалення");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className="promotions-title"> Акції та Купони</h2>

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
                                            <button className="btn-delete-icon" onClick={() => handleDelete(p.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminPromotionsPage;