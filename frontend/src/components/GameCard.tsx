import "../styles/GameCard.css";

type Props = {
    homeTeam: string;
    awayTeam: string;
    homeOdd: number;
    awayOdd: number;
};

const GameCard = ({ homeTeam, awayTeam, homeOdd, awayOdd }: Props) => {
    return (
        <div className="game-card">
            <div className="live-badge">
                <b className="live-text">LIVE</b>
            </div>

            <div className="teams-wrapper">
                <div className="team-row">
                    <b className="team-name">{homeTeam}</b>
                    <div className="odd-box">
                        <b>{homeOdd}</b>
                    </div>
                </div>

                <div className="team-row">
                    <b className="team-name">{awayTeam}</b>
                    <div className="odd-box">
                        <b>{awayOdd}</b>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameCard;