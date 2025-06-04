import { Controller, Post, Body, Res, HttpCode, UnauthorizedException, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto, 
    @Res({ passthrough: true }) res: Response
  ) {
    
    // Validar las credenciales del usuario utilizando el servicio de autenticación.
    const user = await this.authService.validateUser(dto.email, dto.password)

      // Si las credenciales son inválidas, lanzar una excepción de autorización.
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Si las credenciales son válidas, generar un token JWT para el usuario.
    const { access_token } = await this.authService.login(user);

    // Establecer el token JWT en las cookies de la respuesta.
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 86400000, // 1 día en milisegundos
    })

    return { message: 'Login successful' };
  }

  /**
   * Endpoint para cerrar sesión del usuario.
   * @param res - Respuesta HTTP para eliminar el token JWT de las cookies.
   * @throws UnauthorizedException si el usuario no está autenticado.
   * @returns Un mensaje de éxito al cerrar sesión.
   */
  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    // Eliminar el token JWT de las cookies de la respuesta.
    res.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  getProfile(@Request() req) {
    // Retornar la información del usuario autenticado
    return req.user;
  }
}
