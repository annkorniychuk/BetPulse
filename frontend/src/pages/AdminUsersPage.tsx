import { useEffect, useState } from 'react';
import { Table, Spinner, Modal, Button, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';
import type { User } from '../types';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });

    const fetchUsers = () => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user: User) => {
        setEditId(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role ?? 'User'
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditId(null);
        setFormData({ name: '', email: '', role: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.put(`/users/${editId}`, formData);
            fetchUsers();
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Помилка оновлення");
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner animation="border" className="custom-spinner" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="users-page-title">Користувачі системи</h2>
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
                            <th className="pe-4">Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="ps-4 user-id-cell">#{user.id}</td>
                                <td className="user-name-cell">{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`custom-badge ${user.role === 'Admin' ? 'admin' : 'user'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td><span className="custom-badge active">Активний</span></td>
                                <td className="pe-4">
                                    <button className="btn-edit-link" onClick={() => handleEditClick(user)}>Ред.</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} centered contentClassName="modal-content">
                <Modal.Header closeButton>
                    <Modal.Title>Редагувати користувача</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="admin-form-label">Ім'я</Form.Label>
                            <Form.Control
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                type="text"
                                className="admin-form-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="admin-form-label">Email</Form.Label>
                            <Form.Control
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                type="email"
                                className="admin-form-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="admin-form-label">Роль</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role || ''}
                                onChange={handleChange}
                                className="admin-form-input"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className="btn-secondary-dark">Скасувати</Button>
                    <Button onClick={handleSave} className="btn-save-user">Зберегти</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminUsersPage;