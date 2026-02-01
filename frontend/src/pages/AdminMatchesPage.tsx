import { useState } from 'react';
import { Card, Table, Button, Form, Row, Col, Badge } from 'react-bootstrap';

const AdminMatchesPage = () => {
    // Фейкові дані для прикладу (потім підключимо API)
    const [matches] = useState([
        { id: 1, team1: 'Реал', team2: 'Барселона', date: '2026-02-01 20:00', odds: { w1: 1.9, x: 3.5, w2: 2.1 } },
        { id: 2, team1: 'Арсенал', team2: 'Ман Сіті', date: '2026-02-02 21:45', odds: { w1: 2.5, x: 3.2, w2: 1.8 } },
    ]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>⚽ Управління матчами</h2>
                <Button variant="success">+ Створити новий матч</Button>
            </div>

            <Row>
                {/* ФОРМА СТВОРЕННЯ (Швидка) */}
                <Col md={4}>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white fw-bold">Додати подію</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Команда 1 (Вдома)</Form.Label>
                                    <Form.Control type="text" placeholder="Напр. Динамо" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Команда 2 (Гості)</Form.Label>
                                    <Form.Control type="text" placeholder="Напр. Шахтар" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label>П1</Form.Label>
                                        <Form.Control type="number" step="0.01" />
                                    </Col>
                                    <Col>
                                        <Form.Label>X</Form.Label>
                                        <Form.Control type="number" step="0.01" />
                                    </Col>
                                    <Col>
                                        <Form.Label>П2</Form.Label>
                                        <Form.Control type="number" step="0.01" />
                                    </Col>
                                </Row>
                                <Button variant="primary" className="w-100 mt-3">Зберегти</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* СПИСОК МАТЧІВ */}
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Table hover responsive>
                                <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Дата</th>
                                    <th>Подія</th>
                                    <th>Коефіцієнти</th>
                                    <th>Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matches.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td>{m.date}</td>
                                        <td className="fw-bold">{m.team1} - {m.team2}</td>
                                        <td>
                                            <Badge bg="warning" text="dark" className="me-1">{m.odds.w1}</Badge>
                                            <Badge bg="secondary" className="me-1">{m.odds.x}</Badge>
                                            <Badge bg="warning" text="dark">{m.odds.w2}</Badge>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" className="me-2">✏️</Button>
                                            <Button variant="outline-danger" size="sm">🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminMatchesPage;