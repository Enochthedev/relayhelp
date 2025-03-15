// Common types/interfaces for backend & frontend
export interface User {
    id: string;
    email: string;
    role: 'admin' | 'agent' | 'customer';
    teamId: string;
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'pending' | 'closed';
    assignedTo?: string;
}