import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint para crear un nuevo usuario.
   * @param createUserDto - El DTO que contiene los datos del usuario a crear.
   * @returns El usuario creado.
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // se busca el usuario por email, si existe se lanza un error
    const existingUser = await this.usersService.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new Error('Este usuario ya existe con ese email');
    }

    // si no existe se crea el usuario
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint para obtener todos los usuarios.
   * @returns Lista de usuarios.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Endpoint para obtener un usuario por su ID.
   * @param id - El ID del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Endpoint para actualizar un usuario por su ID.
   * @param id - El ID del usuario a actualizar.
   * @param updateUserDto - El DTO que contiene los datos actualizados del usuario.
   * @returns El usuario actualizado.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Endpoint para eliminar un usuario por su ID.
   * @param id - El ID del usuario a eliminar.
   * @returns El resultado de la eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
