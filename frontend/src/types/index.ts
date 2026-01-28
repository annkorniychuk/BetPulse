// src/types/index.ts

export interface User {
    id: number;
    email: string;
    name: string;
    role?: string;
}

export interface Competition {
    id: number;
    name: string;
    country?: string;
    sportId: number;
    sport?: {
        id: number;
        name: string;
    };
}
