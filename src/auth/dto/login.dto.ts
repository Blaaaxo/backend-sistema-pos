import { IsEmail, IsString } from 'class-validator';

/**
 * DTO para el inicio de sesión.
 * Contiene las validaciones necesarias para los campos de email y password.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
