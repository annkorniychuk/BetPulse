import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/axiosConfig';
import './LoginPage.css';

interface LoginResponse {
    token: string;
    role: string;
    email: string;
    id: number;
}

const LoginPage: FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Оновлення полів при введенні
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Відправка форми на сервер
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {

            const response = await api.post<LoginResponse>('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            const { token, role, email } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);   // Для адмін-кнопки
            localStorage.setItem('userEmail', email); // Для профілю

            console.log(`Вхід успішний! Роль: ${role}`);

            // Переходимо на головну
            navigate('/');

        } catch (error) {
            console.error("Помилка входу:", error);
            const err = error as AxiosError;

            let errorMessage = "Невірний логін або пароль";

            // Обробка помилки (якщо сервер повернув текст або JSON)
            if (err.response && err.response.data) {
                errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data);
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="card-top-row">
                    <div className="bp-logo-small">BP</div>
                    <div className="close-icon" onClick={() => navigate('/')}>✕</div>
                </div>

                <h2 className="login-title">Увійдіть у аккаунт</h2>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                name="email"
                                placeholder="Емейл адреса"
                                className="custom-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Пароль"
                                className="custom-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="password-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer' }}
                            >
                                {showPassword ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7.63636 5 4 8.63636 2 12C4 15.3636 7.63636 19 12 19C16.3636 19 20 15.3636 22 12C20 8.63636 16.3636 5 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94L6.06 6.06" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12C4 15.3636 7.63636 19 12 19C14.757 19 17.214 17.653 19.06 15.775" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5C14.634 5 16.973 6.136 18.77 7.96" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.9 9.9C9.37 10.45 9 11.2 9 12C9 13.6569 10.3431 15 12 15C12.8 15 13.55 14.63 14.1 14.1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="forgot-pass-link" onClick={() => alert("Функція у розробці")}>
                        Забули пароль?
                    </div>

                    <button type="submit" className="btn-login">Увійти</button>
                </form>

                <div className="register-link" onClick={() => navigate('/register')}>
                    Не маєте аккаунт? <span>Зареєструйтеся зараз!</span>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;