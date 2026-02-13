import { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import './AdminMatchesPage.css';

const AdminMatchesPage = () => {
    // Фейкові дані
    const [matches] = useState([
        { id: 1, team1: 'Реал', team2: 'Барселона', date: '2026-02-01 20:00', odds: { w1: 1.9, x: 3.5, w2: 2.1 } },
        { id: 2, team1: 'Арсенал', team2: 'Ман Сіті', date: '2026-02-02 21:45', odds: { w1: 2.5, x: 3.2, w2: 1.8 } },
    ]);

    return (
        <div>
            {/* Заголовок і кнопка */}
            <div className="matches-header-row">
                <h2 className="matches-title"> Управління матчами</h2>
                <Button className="btn-warning-pulse">+ Створити новий матч</Button>
            </div>

            <Row>
                {/* --- ФОРМА --- */}
                <Col md={4}>
                    <div className="card-pulse">
                        <div className="card-header">
                            Додати подію
                        </div>
                        <div className="card-body">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Команда 1 (Вдома)</Form.Label>
                                    <Form.Control type="text" placeholder="Напр. Динамо" className="form-control-pulse" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Команда 2 (Гості)</Form.Label>
                                    <Form.Control type="text" placeholder="Напр. Шахтар" className="form-control-pulse" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label>П1</Form.Label>
                                        <Form.Control type="number" step="0.01" className="form-control-pulse" />
                                    </Col>
                                    <Col>
                                        <Form.Label>X</Form.Label>
                                        <Form.Control type="number" step="0.01" className="form-control-pulse" />
                                    </Col>
                                    <Col>
                                        <Form.Label>П2</Form.Label>
                                        <Form.Control type="number" step="0.01" className="form-control-pulse" />
                                    </Col>
                                </Row>
                                <Button className="btn-warning-pulse w-100 mt-4">Зберегти</Button>
                            </Form>
                        </div>
                    </div>
                </Col>

                {/* --- ТАБЛИЦЯ --- */}
                <Col md={8}>
                    <div className="card-pulse">
                        <div className="card-body p-0">
                            <Table className="table-pulse" responsive>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Дата</th>
                                    <th>Подія</th>
                                    <th>Коефіцієнти</th>
                                    <th className="text-end pe-4">Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matches.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td>{m.date}</td>

                                        {/* Клас для жовтого тексту команд */}
                                        <td className="match-teams">
                                            {m.team1} - {m.team2}
                                        </td>

                                        {/* Класи для бейджів */}
                                        <td>
                                            <span className="odds-badge">{m.odds.w1}</span>
                                            <span className="odds-badge draw">{m.odds.x}</span>
                                            <span className="odds-badge">{m.odds.w2}</span>
                                        </td>

                                        {/* Кнопки дій */}
                                        <td className="text-end pe-3">
                                            <button className="action-icon-btn" title="Редагувати">✏️</button>
                                            <button className="action-icon-btn" title="Видалити">🗑️</button>
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

export default AdminMatchesPage;