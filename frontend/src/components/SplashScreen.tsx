import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    // Пришвидшуємо кроки (250мс замість 500мс), щоб виглядало динамічніше
    const [activeDots, setActiveDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDots((prev) => {
                if (prev >= 5) {
                    clearInterval(interval);
                    setTimeout(onFinish, 500); // Трохи довша пауза в кінці
                    return 5;
                }
                return prev + 1;
            });
        }, 250); // <-- Зробив швидше для плавності потоку

        return () => clearInterval(interval);
    }, [onFinish]);

    return (
        <div style={styles.container}>
            <img
                src={logo}
                alt="BetPulse"
                style={styles.logo}
            />

            <div style={styles.dotsContainer}>
                {[0, 1, 2, 3, 4].map((index) => (
                    // Обгортка крапки (база - жовта)
                    <div key={index} style={styles.dotWrapper}>
                        {/* Жовтий фон (лежить знизу) */}
                        <div style={styles.dotYellow} />

                        {/* Білий фон (лежить зверху і зникає) */}
                        <div
                            style={{
                                ...styles.dotWhite,
                                opacity: index < activeDots ? 0 : 1, // Плавно зникає
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#101010',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    logo: {
        width: '401px',
        height: '81px',
        marginBottom: '37px',
    },
    dotsContainer: {
        display: 'flex',
        gap: '10px',
    },
    // Контейнер для однієї крапки
    dotWrapper: {
        width: '34px',
        height: '34px',
        position: 'relative' as const, // Важливо для накладання
    },
    // Жовтий шар (незмінний)
    dotYellow: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, #FEE000 0%, #D0B907 100%)',
    },
    // Білий шар (анімується прозорість)
    dotWhite: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #E6E7E8 100%)',
        transition: 'opacity 0.6s ease-in-out', // <-- ГЛАДКИЙ ПЕРЕХІД
    }
};

export default SplashScreen;