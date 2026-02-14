import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
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
    sport?: Sport;
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
                setEditId(null);
            } else {
                await api.post('/competitions', data);
            }

            setFormData({ name: '', sportId: '' });
            fetchCompetitions();
        } catch (e) {
            console.error(e);
            alert("Помилка збереження змагання");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Видалити це змагання?')) {
            try {
                await api.delete(`/competitions/${id}`);
                fetchCompetitions();
            } catch (e) {
                console.error(e);
                alert("Помилка видалення");
            }
        }
    };

    const handleEdit = (comp: Competition) => {
        setEditId(comp.id);
        setFormData({
            name: comp.name,
            sportId: comp.sportId.toString()
        });
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
                                        <td className="comp-sport">{c.sport?.name || `ID: ${c.sportId}`}</td>
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
                                                onClick={() => handleDelete(c.id)}
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
        </div>
    );
};

export default AdminCompetitionsPage;