import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service'; // Ajustado para caminho relativo seguro

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  // ROTA DE CADASTRO (Acessada pela sua página secreta no Next.js)
  @Post('register')
  async register(@Body() data: any) {
    // Criptografando a senha com 10 rounds de salt
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  // ROTA DE LOGIN (Conexão real com MySQL via Prisma)
  @Post('login')
  @HttpCode(HttpStatus.OK) // Garante que retorne 200 em vez de 201
  async login(@Body() body: any) {
    // 1. Busca o usuário pelo e-mail único
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    // 2. Validação de existência
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Comparação da senha digitada com o hash do banco
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 4. Retorno de sucesso (O token aqui é temporário até instalarmos o @nestjs/jwt)
    return {
      token: 'jwt-correria-83-real-session',
      user: { 
        name: user.name, 
        email: user.email 
      }
    };
  }
}