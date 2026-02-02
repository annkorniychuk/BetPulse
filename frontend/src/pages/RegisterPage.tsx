import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios'; //
import './RegisterPage.css';
import api from '../api/axiosConfig';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        agreed: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.agreed) {
            alert("Будь ласка, прийміть умови!");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }

        try {
            // Відправка на бекенд
            const response = await api.post('/auth/register', {
                email: formData.email,
                password: formData.password
            });

            console.log("Успішна реєстрація:", response.data);
            alert("Акаунт створено! Тепер увійдіть.");
            navigate('/login');

        } catch (error) {
            console.error("Помилка реєстрації:", error);


            const err = error as AxiosError;

            let errorMessage = "Щось пішло не так";

            if (err.response && err.response.data) {
                errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data);
            }

            alert(errorMessage);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="card-top-row">
                    <div className="bp-logo-small">BP</div>
                    <div className="close-icon" onClick={() => navigate('/')}>✕</div>
                </div>

                <h2 className="register-title">Створити аккаунт</h2>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Емейл адреса"
                            className="custom-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div style={{position: 'relative', width: '100%'}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Пароль"
                                className="custom-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: 15, top: 15, cursor: 'pointer', opacity: 0.6}}>
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M1 1l22 22"/></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </span>
                        </div>

                        <div style={{position: 'relative', width: '100%'}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Підтвердження паролю"
                                className="custom-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            name="agreed"
                            className="custom-checkbox"
                            checked={formData.agreed}
                            onChange={handleChange}
                        />
                        <p className="checkbox-text">
                            Я підтверджую, що мені є 21 рік, не маю ігрової залежності і обмежень щодо доступу до гральних закладів та/або участі в азартній грі. Я ознайомлений (-на) і приймаю умови Договору оферти, Правил Організатора, Політики конфіденційності.
                        </p>
                    </div>

                    <button type="submit" className="btn-register">Реєстрація</button>
                </form>

                <div className="login-link" onClick={() => navigate('/login')}>
                    Вже маєте аккаунт?
                </div>

                <div className="social-section">
                    <span className="social-text">Продовжити з</span>
                    <div className="social-icons">
                        <button className="social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        </button>
                        <button className="social-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                        </button>
                        <button className="social-btn">
                            <svg width="22" height="22" viewBox="0 0 384 512" fill="black" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                        </button>
                    </div>
                    <span className="support-link">Зв’язатися з підтримкою</span>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;