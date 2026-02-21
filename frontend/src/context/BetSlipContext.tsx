import { createContext, useState, type ReactNode, useContext } from 'react';

// Які дані нам потрібні для купона
export interface SelectedBet {
    matchId: number;
    team1: string;
    team2: string;
    betType: string; // '1', 'X', '2'
    odds: number;
}

interface BetSlipContextType {
    bet: SelectedBet | null;
    setBet: (bet: SelectedBet | null) => void;
}

export const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export const BetSlipProvider = ({ children }: { children: ReactNode }) => {
    const [bet, setBet] = useState<SelectedBet | null>(null);

    return (
        <BetSlipContext.Provider value={{ bet, setBet }}>
            {children}
        </BetSlipContext.Provider>
    );
};

// Спеціальний хук, щоб зручно діставати дані купона
export const useBetSlip = () => {
    const context = useContext(BetSlipContext);
    if (!context) {
        throw new Error("useBetSlip має використовуватись всередині BetSlipProvider");
    }
    return context;
};