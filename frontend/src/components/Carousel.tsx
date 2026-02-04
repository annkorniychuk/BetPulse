import { useState, useEffect, useCallback } from 'react';
import '../styles/carousel.css';

const SLIDES = [
    { id: 1, color: '#1E1E1E', text: 'БОНУС НА ПЕРШИЙ ДЕПОЗИТ 100%' },
    { id: 2, color: '#2a2a2a', text: 'СТАВКИ НА СПОРТ ТУТ' },
    { id: 3, color: '#333333', text: 'НОВІ ІГРИ ВЖЕ ЧЕКАЮТЬ' },
];

const Carrousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="carousel-container">
            <button className="carousel-btn left" onClick={prevSlide}>❮</button>

            <div className="carousel-viewport" style={{ overflow: 'hidden' }}> {/* Важливо для роботи зміщення */}
                <div
                    className="carousel-track"
                    style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease-in-out', // Додаємо плавність
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {SLIDES.map((slide) => (
                        <div
                            key={slide.id}
                            className="carousel-slide"
                            style={{
                                backgroundColor: slide.color,
                                minWidth: '100%', // Кожен слайд займає всю ширину
                                height: '300px', // Або ваша висота
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <h1 style={{ color: 'white' }}>{slide.text}</h1>
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-btn right" onClick={nextSlide}>❯</button>

            <div className="carousel-dots">
                {SLIDES.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            cursor: 'pointer',
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: index === currentIndex ? 'white' : 'gray',
                            margin: '5px'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carrousel;