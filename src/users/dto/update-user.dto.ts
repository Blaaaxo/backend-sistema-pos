import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO para actualizar un usuario.
 * Hereda de CreateUserDto para reutilizar sus propiedades.
 * @export UpdateUserDto
 * @class UpdateUserDto
 */
export class UpdateUserDto extends CreateUserDto{}
