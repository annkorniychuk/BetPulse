import { useState, useEffect, useCallback } from 'react';
import sport1 from '../assets/banners/sport1.png';
import sport2 from '../assets/banners/sport2.png';
import sport3 from '../assets/banners/sport3.png';
import '../styles/carousel.css';

const SLIDES = [
    { id: 1, image: sport1 },
    { id: 2, image: sport2 },
    { id: 3, image: sport3 },
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

            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {SLIDES.map((slide) => (
                        <div key={slide.id} className="carousel-slide">
                            <img src={slide.image} alt="slide" className="carousel-image" />
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
                    />
                ))}
            </div>
        </div>
    );
};

export default Carrousel;