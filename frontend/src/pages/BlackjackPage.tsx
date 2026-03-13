import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import "./BlackjackPage.css";

type Card = {
    rank: string;
    suit: string;
    value: number;
};

const suits = ["♠", "♥", "♦", "♣"];

const ranks = [
    { rank: "A", value: 11 },
    { rank: "2", value: 2 },
    { rank: "3", value: 3 },
    { rank: "4", value: 4 },
    { rank: "5", value: 5 },
    { rank: "6", value: 6 },
    { rank: "7", value: 7 },
    { rank: "8", value: 8 },
    { rank: "9", value: 9 },
    { rank: "10", value: 10 },
    { rank: "J", value: 10 },
    { rank: "Q", value: 10 },
    { rank: "K", value: 10 },
];

const createDeck = (): Card[] => {
    const deck: Card[] = [];

    for (const suit of suits) {
        for (const r of ranks) {
            deck.push({
                rank: r.rank,
                suit,
                value: r.value,
            });
        }
    }

    return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (cards: Card[]) => {
    let total = cards.reduce((sum, card) => sum + card.value, 0);
    let aces = cards.filter((card) => card.rank === "A").length;

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
};

const cardColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "red" : "white";
};

const BlackjackPage = () => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerCards, setPlayerCards] = useState<Card[]>([]);
    const [dealerCards, setDealerCards] = useState<Card[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    const [balance, setBalance] = useState(0);
    const [isBalanceLoaded, setIsBalanceLoaded] = useState(false);
    const [bet, setBet] = useState(50);
    const [message, setMessage] = useState("Натисни «Нова гра»");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/profile");
                setBalance(res.data.balance);
                setIsBalanceLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };

        void fetchProfile();
    }, []);

    const playerScore = useMemo(() => calculateScore(playerCards), [playerCards]);
    const dealerScore = useMemo(() => calculateScore(dealerCards), [dealerCards]);

    const canStart = useMemo(() => {
        return isBalanceLoaded && balance >= bet && bet > 0 && !started;
    }, [isBalanceLoaded, balance, bet, started]);

    const drawCard = (currentDeck: Card[]) => {
        const nextDeck = [...currentDeck];
        const card = nextDeck.shift();
        return { card, nextDeck };
    };

    const increaseBet = () => {
        if (started) return;
        setBet((prev) => prev + 10);
    };

    const decreaseBet = () => {
        if (started) return;
        setBet((prev) => Math.max(10, prev - 10));
    };

    const startGame = async () => {
        if (!canStart) {
            setMessage("Недостатньо коштів для ставки");
            return;
        }

        try {
            const betRes = await api.post("/profile/slot-bet", { amount: bet });
            setBalance(betRes.data.newBalance);
        } catch {
            setMessage("Помилка при знятті ставки");
            return;
        }

        let newDeck = createDeck();

        const p1 = drawCard(newDeck);
        newDeck = p1.nextDeck;

        const d1 = drawCard(newDeck);
        newDeck = d1.nextDeck;

        const p2 = drawCard(newDeck);
        newDeck = p2.nextDeck;

        const d2 = drawCard(newDeck);
        newDeck = d2.nextDeck;

        const newPlayerCards = [p1.card!, p2.card!];
        const newDealerCards = [d1.card!, d2.card!];

        setDeck(newDeck);
        setPlayerCards(newPlayerCards);
        setDealerCards(newDealerCards);
        setGameOver(false);
        setStarted(true);

        const playerTotal = calculateScore(newPlayerCards);
        const dealerTotal = calculateScore(newDealerCards);

        if (playerTotal === 21 && dealerTotal === 21) {
            setMessage("Нічия! У обох blackjack");
            setGameOver(true);
            setStarted(false);
            return;
        }

        if (playerTotal === 21) {
            const win = Math.floor(bet * 2.5);
            try {
                const winRes = await api.post("/profile/slot-win", { amount: win });
                setBalance(winRes.data.newBalance);
                setMessage(`Blackjack! Ти виграв +${win}`);
            } catch {
                setMessage(`Blackjack! Ти виграв +${win} (Помилка зарахування)`);
            }
            setGameOver(true);
            setStarted(false);
            return;
        }

        setMessage("Гра почалась");
    };

    const hit = async () => {
        if (gameOver || !started) return;

        const drawn = drawCard(deck);
        if (!drawn.card) return;

        const nextPlayerCards = [...playerCards, drawn.card];
        const nextScore = calculateScore(nextPlayerCards);

        setDeck(drawn.nextDeck);
        setPlayerCards(nextPlayerCards);

        if (nextScore > 21) {
            setMessage("Перебір! Ти програв");
            setGameOver(true);
            setStarted(false);
        }
    };

    const stand = async () => {
        if (gameOver || !started) return;

        let nextDeck = [...deck];
        let nextDealerCards = [...dealerCards];
        let nextDealerScore = calculateScore(nextDealerCards);

        while (nextDealerScore < 17) {
            const drawn = drawCard(nextDeck);
            if (!drawn.card) break;

            nextDealerCards.push(drawn.card);
            nextDeck = drawn.nextDeck;
            nextDealerScore = calculateScore(nextDealerCards);
        }

        setDealerCards(nextDealerCards);
        setDeck(nextDeck);
        setGameOver(true);
        setStarted(false);

        const finalPlayerScore = calculateScore(playerCards);

        let win = 0;

        if (nextDealerScore > 21) {
            win = bet * 2;
            try {
                const winRes = await api.post("/profile/slot-win", { amount: win });
                setBalance(winRes.data.newBalance);
                setMessage(`Дилер перебрав! Ти виграв +${win}`);
            } catch {
                setMessage(`Дилер перебрав! Ти виграв +${win} (Помилка зарахування)`);
            }
            return;
        }

        if (finalPlayerScore > nextDealerScore) {
            win = bet * 2;
            try {
                const winRes = await api.post("/profile/slot-win", { amount: win });
                setBalance(winRes.data.newBalance);
                setMessage(`Ти виграв +${win}`);
            } catch {
                setMessage(`Ти виграв +${win} (Помилка зарахування)`);
            }
            return;
        }

        if (finalPlayerScore < nextDealerScore) {
            setMessage("Дилер виграв");
            return;
        }

        try {
            const refundRes = await api.post("/profile/slot-win", { amount: bet });
            setBalance(refundRes.data.newBalance);
            setMessage("Нічия. Ставка повернута");
        } catch {
            setMessage("Нічия. Помилка повернення ставки");
        }
    };

    return (
        <div className="bj-page">
            <div className="bj-card">
                <div className="bj-header">
                    <div>
                        <h1>21</h1>
                        <p>Класична гра в 21</p>
                    </div>
                    <div className="bj-balance">
                        Баланс: <span>{isBalanceLoaded ? balance : "..."}</span>
                    </div>
                </div>

                <div className="bj-bet-panel">
                    <span className="bj-label">Ставка</span>

                    <div className="bj-bet-controls">
                        <button
                            type="button"
                            className="bj-small-btn"
                            onClick={decreaseBet}
                            disabled={started}
                        >
                            −
                        </button>

                        <div className="bj-bet-value">{bet}</div>

                        <button
                            type="button"
                            className="bj-small-btn"
                            onClick={increaseBet}
                            disabled={started}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="bj-board">
                    <div className="bj-section">
                        <div className="bj-section-top">
                            <h2>Дилер</h2>
                            <span>{started || gameOver ? dealerScore : 0}</span>
                        </div>

                        <div className="bj-cards">
                            {dealerCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`bj-card-item bj-card-item--${cardColor(card.suit)}`}
                                >
                                    <div>{card.rank}</div>
                                    <div>{card.suit}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bj-section">
                        <div className="bj-section-top">
                            <h2>Гравець</h2>
                            <span>{started || gameOver ? playerScore : 0}</span>
                        </div>

                        <div className="bj-cards">
                            {playerCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`bj-card-item bj-card-item--${cardColor(card.suit)}`}
                                >
                                    <div>{card.rank}</div>
                                    <div>{card.suit}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bj-controls">
                    <button
                        className="bj-btn bj-btn--gold"
                        onClick={startGame}
                        disabled={!canStart}
                    >
                        Нова гра
                    </button>

                    <button
                        className="bj-btn"
                        onClick={hit}
                        disabled={!started || gameOver}
                    >
                        Взяти
                    </button>

                    <button
                        className="bj-btn"
                        onClick={stand}
                        disabled={!started || gameOver}
                    >
                        Стоп
                    </button>
                </div>

                <div className="bj-message">{message}</div>
            </div>
        </div>
    );
};

export default BlackjackPage;