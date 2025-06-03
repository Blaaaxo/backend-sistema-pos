export class User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    // Relación con el perfil
    profile?: {
        id: number;
        firstName: string;
        lastName: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    };
}
