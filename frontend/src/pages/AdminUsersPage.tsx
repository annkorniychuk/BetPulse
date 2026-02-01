import { useEffect, useState } from 'react';
import { Table, Spinner, Card, Badge, Button } from 'react-bootstrap';
import api from '../api/axiosConfig';
import type { User } from '../types';

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner animation="border" variant="primary" />;

    return (
        <div>
            <h2 className="mb-4">👥 Користувачі системи</h2>
            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <Table striped hover className="m-0 align-middle">
                        <thead className="bg-light">
                        <tr>
                            <th className="ps-4">ID</th>
                            <th>Ім'я</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Статус</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="ps-4">#{user.id}</td>
                                <td className="fw-bold">{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Badge bg={user.role === 'Admin' ? 'danger' : 'info'}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td><Badge bg="success">Активний</Badge></td>
                                <td>
                                    <Button variant="link" className="text-decoration-none">Ред.</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminUsersPage;