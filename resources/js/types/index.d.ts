import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Budget{
    id: string;
    user_id: User.id;
    name: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    user: User;
    transactions: Transaction[];
}

export interface Transaction{
    id: string;
    budget_id: Budget.id;
    user_id: User.id;
    name: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    budget: Budget; 
    user: User; 
}
