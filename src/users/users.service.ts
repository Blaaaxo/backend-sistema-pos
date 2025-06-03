import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // Agrega esta línea al inicio

@Injectable()
export class UsersService {
  // Inyectamos el servicio de Prisma para poder interactuar con la base de datos
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param createUserDto - El DTO que contiene los datos del usuario a crear.
   * @returns El usuario creado.
   */
  async create(createUserDto: CreateUserDto) {
    // Encriptar la contraseña antes de crear el usuario
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Crear un nuevo objeto con la contraseña encriptada
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    // Crear el usuario en la base de datos
    return this.prismaService.user.create({
      data: userData,
    });
  }

  /**
   * Encripta la contraseña del usuario utilizando bcrypt.
   * @param password - La contraseña a encriptar.
   * @returns La contraseña encriptada.
   */
  private async hashPassword(password: string): Promise<string> {
    // Definimos el número de rondas de sal para bcrypt
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns Una lista de usuarios.
   */
  async findAll() {
    return this.prismaService.user.findMany();
  }

  /**
   * Busca un usuario por su ID.
   * @param id - El ID del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  async findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }

  /**
   * Busca un usuario por su email.
   * @param email - El email del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  /**
   * Actualiza un usuario existente.
   * @param id - El ID del usuario a actualizar.
   * @param updateUserDto - El DTO que contiene los datos actualizados del usuario.
   * @returns El usuario actualizado.
   */
  async update(id: number, updateUserDto: UpdateUserDto) {

    let userData = {...updateUserDto};

    // Si se proporciona una nueva contraseña, encriptarla antes de actualizar
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    return this.prismaService.user.update({
      where: { id: id },
      data: userData,
    });
  }

  /**
   * Elimina un usuario por su ID.
   * @param id - El ID del usuario a eliminar.
   * @returns Un mensaje de confirmación de eliminación.
   */
  async remove(id: number) {
    return this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
