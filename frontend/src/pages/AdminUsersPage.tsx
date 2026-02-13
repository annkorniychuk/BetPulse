import { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import api from '../api/axiosConfig';
import type { User } from '../types';

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Симуляція затримки або реальний запит
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error loading users:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner animation="border" className="custom-spinner" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="users-page-title"> Користувачі системи</h2>

            <div className="card-pulse">
                <div className="card-body p-0">
                    <Table className="table-pulse" responsive hover>
                        <thead>
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
                                <td className="ps-4" style={{color: '#999'}}>#{user.id}</td>

                                <td className="user-name-cell">{user.name}</td>

                                <td>{user.email}</td>

                                <td>
                                    {/* Логіка вибору класу для бейджа */}
                                    <span className={`custom-badge ${user.role === 'Admin' ? 'admin' : 'user'}`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td>
                                    <span className="custom-badge active">Активний</span>
                                </td>

                                <td>
                                    <button className="btn-edit-link">Ред.</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;