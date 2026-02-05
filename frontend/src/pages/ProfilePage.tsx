import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Додав Link
import { AxiosError } from 'axios';
import api from '../api/axiosConfig.ts';
import '../styles/ProfilePage.css';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    balance?: number;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showNameModal, setShowNameModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUser(response.data);
                setNewName(response.data.name);
            } catch (err) {
                const axiosError = err as AxiosError;
                if (axiosError.response && axiosError.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error(err);
                    setError('Не вдалося завантажити профіль.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;

        setIsSaving(true);
        try {
            await api.put('/profile/update-name', { name: newName });

            if (user) {
                setUser({ ...user, name: newName });
            }
            setShowNameModal(false);
        } catch (err) {
            console.error(err);
            alert('Не вдалося змінити ім\'я');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="profile-wrapper">Завантаження...</div>;

    if (error) {
        return (
            <div className="profile-wrapper">
                <div className="profile-card">
                    <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</h3>
                    <Link to="/" className="btn-home">На головну</Link>
                </div>
            </div>
        );
    }

    const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                <div className="profile-avatar">{avatarLetter}</div>
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>

                <div className="stats-row">
                    <div className="stat-item">
                        <span className="stat-label">Баланс</span>
                        <span className="stat-value money">
                            {user?.balance ? user.balance.toFixed(2) : '0.00'} ₴
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">ID</label>
                    <input className="form-input" value={user?.id || ''} readOnly />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" value={user?.email || ''} readOnly />
                </div>

                <div className="profile-actions">
                    <button className="btn-edit" onClick={() => setShowNameModal(true)}>
                        ✎ Змінити ім'я
                    </button>

                    <Link to="/" className="btn-home">⬅ На головну</Link>
                    <button className="btn-logout" onClick={handleLogout}>Вийти</button>
                </div>
            </div>

            {showNameModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Зміна імені</h3>
                        <input
                            type="text"
                            className="form-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Введіть нове ім'я"
                        />
                        <div className="modal-actions">
                            <button className="btn-save" onClick={handleUpdateName} disabled={isSaving}>
                                {isSaving ? 'Збереження...' : 'Зберегти'}
                            </button>
                            <button className="btn-cancel" onClick={() => setShowNameModal(false)}>
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;