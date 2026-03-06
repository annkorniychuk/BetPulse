import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import './AdminCompetitionsPage.css';

interface Sport {
    id: number;
    name: string;
}

interface Competition {
    id: number;
    name: string;
    sportId: number;
    country: string;
}

const AdminCompetitionsPage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        sportId: ''
    });

    const [editId, setEditId] = useState<number | null>(null);

    // Стани для модалки видалення
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchCompetitions = () => {
        api.get<Competition[]>('/competitions')
            .then(res => setCompetitions(res.data))
            .catch(e => console.error(e));
    };

    const fetchSports = () => {
        api.get<Sport[]>('/sports')
            .then(res => setSports(res.data))
            .catch(e => console.error(e));
    };

    useEffect(() => {
        fetchCompetitions();
        fetchSports();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const data = {
                name: formData.name,
                sportId: parseInt(formData.sportId)
            };

            if (editId) {
                await api.put(`/competitions/${editId}`, data);
                toast.success("Змагання успішно оновлено! ✏");
                setEditId(null);
            } else {
                await api.post('/competitions', data);
                toast.success("Змагання успішно створено! ");
            }

            setFormData({ name: '', sportId: '' });
            fetchCompetitions();
        } catch (e) {
            console.error(e);
            toast.error("Помилка збереження змагання ");
        }
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete === null) return;

        try {
            await api.delete(`/competitions/${itemToDelete}`);
            toast.success("Змагання успішно видалено! ️");
            fetchCompetitions();
        } catch (e) {
            console.error(e);
            toast.error("Помилка видалення ");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleEdit = (comp: Competition) => {
        setEditId(comp.id);
        setFormData({
            name: comp.name,
            sportId: comp.sportId.toString()
        });
    };

    // Допоміжна функція: шукаємо назву спорту по ID
    const getSportName = (sportId: number) => {
        const sport = sports.find(s => s.id === sportId);
        return sport ? sport.name : `ID: ${sportId}`;
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4">Керування змаганнями</h2>

            <Row>
                <Col lg={4} className="mb-4">
                    <div className="card-pulse">
                        <div className="card-header">
                            {editId ? 'Редагувати змагання' : 'Створити нове змагання'}
                        </div>
                        <div className="card-body">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Назва змагання (напр. Ла Ліга)</Form.Label>
                                    <Form.Control
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control-pulse"
                                        placeholder="Введіть назву..."
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Вид спорту</Form.Label>
                                    <Form.Select
                                        name="sportId"
                                        value={formData.sportId}
                                        onChange={handleChange}
                                        className="form-control-pulse"
                                    >
                                        <option value="">Оберіть спорт...</option>
                                        {sports.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button
                                    className="w-100 mt-2 btn-vbet"
                                    onClick={handleSubmit}
                                    disabled={!formData.name || !formData.sportId}
                                >
                                    {editId ? 'Зберегти зміни' : 'Створити'}
                                </Button>

                                {editId && (
                                    <Button
                                        className="w-100 mt-2 btn-secondary-dark"
                                        onClick={() => {
                                            setEditId(null);
                                            setFormData({ name: '', sportId: '' });
                                        }}
                                    >
                                        Скасувати
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                </Col>

                <Col lg={8}>
                    <div className="card-pulse">
                        <div className="card-header">Список змагань</div>
                        <div className="card-body p-0">
                            <Table className="table-pulse" responsive hover>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Назва</th>
                                    <th>Спорт</th>
                                    <th>Країна</th>
                                    <th className="text-end pe-4">Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {competitions.map(c => (
                                    <tr key={c.id}>
                                        <td className="comp-id">#{c.id}</td>
                                        <td className="comp-name">{c.name}</td>
                                        {/* 👇 ТУТ ВИВОДИМО НАЗВУ ЗАМІСТЬ ID */}
                                        <td className="comp-sport">{getSportName(c.sportId)}</td>
                                        <td>{c.country}</td>
                                        <td className="text-end pe-3">
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleEdit(c)}
                                                title="Редагувати"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteClick(c.id)}
                                                title="Видалити"
                                            >
                                                🗑️
                                            </button>
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
                        <p style={{ color: '#aeb5bc', fontSize: '18px', marginBottom: '30px', margin: '0 0 30px 0' }}>Ви дійсно хочете видалити це змагання? Цю дію неможливо скасувати.</p>
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

export default AdminCompetitionsPage;