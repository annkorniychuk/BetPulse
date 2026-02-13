import { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import './AdminPromotionsPage.css';

const AdminPromotionsPage = () => {
    // Фейкові дані
    const [promotions] = useState([
        { id: 1, code: 'WELCOME500', discount: '500 UAH', type: 'Бонус', status: 'Active', expiry: '2026-12-31' },
        { id: 2, code: 'CHAMPIONS20', discount: '20%', type: 'Знижка', status: 'Expired', expiry: '2025-01-01' },
    ]);

    return (
        <div>
            <h2 className="promotions-title"> Акції та Купони</h2>

            <Row>
                {/* ФОРМА ДОДАВАННЯ */}
                <Col lg={4} className="mb-4">
                    <div className="card-pulse">
                        <div className="card-header">Створити новий купон</div>
                        <div className="card-body">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Промокод</Form.Label>
                                    <Form.Control type="text" placeholder="Напр. BONUS2026" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Тип винагороди</Form.Label>
                                    <Form.Select className="form-control-pulse">
                                        <option>Фіксована сума (UAH)</option>
                                        <option>Відсоток (%)</option>
                                        <option>Фрібет</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Значення</Form.Label>
                                    <Form.Control type="number" placeholder="500" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Діє до</Form.Label>
                                    <Form.Control type="date" className="form-control-pulse" />
                                </Form.Group>
                                <Button className="btn-warning-pulse w-100 mt-2">Створити Купон</Button>
                            </Form>
                        </div>
                    </div>
                </Col>

                {/* СПИСОК КУПОНІВ */}
                <Col lg={8}>
                    <div className="card-pulse">
                        <div className="card-header">Активні кампанії</div>
                        <div className="card-body p-0">
                            <Table className="table-pulse" responsive hover>
                                <thead>
                                <tr>
                                    <th>Код</th>
                                    <th>Бонус</th>
                                    <th>Тип</th>
                                    <th>Статус</th>
                                    <th>Термін дії</th>
                                    <th>Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {promotions.map(p => (
                                    <tr key={p.id}>
                                        <td className="promo-code-text">{p.code}</td>
                                        <td>{p.discount}</td>
                                        <td>{p.type}</td>
                                        <td>
                                            {/* Логіка стилів для статусу */}
                                            <span className={`promo-status-badge ${p.status === 'Active' ? 'active' : 'expired'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>{p.expiry}</td>
                                        <td>
                                            <button className="btn-delete-icon">🗑️</button>
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