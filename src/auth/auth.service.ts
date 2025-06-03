import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    // Este constuctor es el que se encarga de inyectar las dependencias necesarias para el servicio de autenticación.
    // En este caso, se inyectan JwtService y UsersService.
    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) {}
    
    /**
        * Método para generar un token JWT para un usuario.
        * @param user - El usuario para el cual se generará el token.
        * @returns Un string que representa el token JWT.
     */
    async validateUser(email: string, password: string): Promise<any> {

        // Se busca al usuario por su email utilizando el servicio de usuarios.
        const user = await this.userService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            // Si el usuario existe y la contraseña es correcta, se retorna el usuario sin la contraseña.
            const { password, ...result } = user;
            return result;
        }

        // Si el usuario no existe o la contraseña es incorrecta, se retorna null.
        return null;
    }

    /**
     * Método para generar un token JWT para un usuario.
     * @param user - El usuario para el cual se generará el token.
     * @returns Un string que representa el token JWT.
     */
    async login(user: any) {
        // Se crea un payload con el email y el id del usuario.
        const payload = { email: user.email, sub: user.id };

        // Se genera un token JWT utilizando el JwtService y el payload creado.
        const token = this.jwtService.sign(payload);

        // Se retorna un objeto que contiene el token JWT.
        return { access_token: token}
    }
}
