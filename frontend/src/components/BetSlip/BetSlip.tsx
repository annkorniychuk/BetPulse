import { useState } from 'react';
import { useBetSlip } from '../../context/BetSlipContext';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { AxiosError } from 'axios'; // 👈 1. Додали імпорт AxiosError
import './BetSlip.css';

const BetSlip = () => {
    const { bet, setBet } = useBetSlip();
    const [amount, setAmount] = useState<number | string>(100);
    const [loading, setLoading] = useState(false);

    if (!bet) return null;

    const possibleWin = (Number(amount) * bet.odds).toFixed(2);

    const handlePlaceBet = async () => {
        if (Number(amount) < 10) {
            toast.warning('Мінімальна сума ставки - 10 ₴');
            return;
        }

        setLoading(true);
        try {
            await api.post('/bets', {
                matchId: bet.matchId,
                choice: bet.betType,
                amount: Number(amount),
                odd: bet.odds
            });
            toast.success('Ставку успішно прийнято! 🤑');
            setBet(null);
        } catch (error) {
            const err = error as AxiosError<string>;

            if (err.response?.status === 401) {
                toast.error('Увійдіть в акаунт, щоб зробити ставку!');
            }
            // 👇 ДОДАЛИ ЦЕЙ БЛОК: якщо бекенд надіслав свій текст помилки (наприклад, про баланс)
            else if (err.response?.data) {
                toast.error(err.response.data);
            }
            else {
                toast.error('Помилка при обробці ставки');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bet-slip-panel">
            <div className="bet-slip-header">
                <span>КУПОН</span>
                <button className="btn-close-slip" onClick={() => setBet(null)}>×</button>
            </div>

            <div className="bet-slip-body">
                <div className="bet-slip-teams">
                    {bet.team1} - {bet.team2}
                </div>

                <div className="bet-slip-selection">
                    <span>Вибір: {bet.betType}</span>
                    <span className="bet-slip-odds">{bet.odds.toFixed(2)}</span>
                </div>

                <label style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px', display: 'block' }}>Сума ставки (₴):</label>
                <input
                    type="number"
                    className="bet-slip-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                />

                <div className="bet-slip-footer">
                    <span style={{ color: '#aeb5bc' }}>Можливий виграш:</span>
                    <span style={{ color: '#fee000', fontWeight: 'bold' }}>{possibleWin} ₴</span>
                </div>

                <button
                    className="btn-place-bet"
                    onClick={handlePlaceBet}
                    disabled={loading}
                >
                    {loading ? 'Обробка...' : 'ЗРОБИТИ СТАВКУ'}
                </button>
            </div>
        </div>
    );
};

export default BetSlip;