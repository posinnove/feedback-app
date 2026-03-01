export interface RegisterInput {
    userName: string;
    email: string;
    password: string;
    accountType: "admin" | "company" | "user";
}

export interface RegisterCompanyInput {
    companyName: string;
    companyEmail: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthPayload {
    userId: number;
    userName: string;
    email: string;
    accountType: "admin" | "company" | "user";
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        userName: string;
        email: string;
        accountType: "admin" | "company" | "user";
        company?: {
            id: number;
            name: string;
            slug: string;
            email: string;
        } | null;
    };
}
