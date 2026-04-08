import 'dotenv/config'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 🛠️ Ajuste de CORS dinâmico
  // No Render, FRONTEND_URL será https://seu-site.vercel.app
  // Localmente, ele usará http://localhost:3000
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'], // Aceita os dois para facilitar testes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 🖼️ SERVIR ARQUIVOS ESTÁTICOS
  // Render usa a raiz do projeto, mas localmente dist/.. também funciona
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // '0.0.0.0' é importante para o Render encontrar a porta
  
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  
  logger.log(`🚀 API rodando em: ${baseUrl}`);
  logger.log(`📂 Uploads em: ${baseUrl}/uploads`);
}
bootstrap();