import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
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

    const handleGoogleAuth = async (credentialResponse: { credential?: string }) => {
        try {
            const response = await api.post('/auth/google-login', {
                credential: credentialResponse.credential
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userEmail', response.data.email);
            toast.success("Реєстрація через Google успішна! ");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Помилка реєстрації через Google ");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.agreed) {
            toast.warning("Будь ласка, прийміть умови! ");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.warning("Паролі не співпадають! ");
            return;
        }

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password
            });
            toast.success("Акаунт створено! Тепер увійдіть. ");
            navigate('/login');
        } catch (error) {
            console.error(error);
            const err = error as AxiosError;
            let errorMessage = "Щось пішло не так ";
            if (err.response && err.response.data) {
                errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data);
            }
            toast.error(errorMessage);
        }
    };

    return (
        <GoogleOAuthProvider clientId="29588120359-ppkbibh856jnf6t5qh5gr4iu7tlu21jq.apps.googleusercontent.com">
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

                    <div className="social-section" style={{ marginTop: '20px' }}>
                        <span className="social-text">Продовжити з</span>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleAuth}
                                theme="filled_black"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                        <span className="support-link">Зв’язатися з підтримкою</span>
                    </div>

                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default RegisterPage;