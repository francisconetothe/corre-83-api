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
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = ['http://localhost:3000'];

  if (frontendUrl) {
    // Remove barra no final se o usuário tiver colocado por engano no Render
    allowedOrigins.push(frontendUrl.replace(/\/$/, ""));
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como mobile ou Postman) ou se estiver na lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS bloqueado para a origem: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 🖼️ SERVIR ARQUIVOS ESTÁTICOS
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const port = process.env.PORT || 3001;
  
  // No Render, a porta é dinâmica. '0.0.0.0' é essencial.
  await app.listen(port, '0.0.0.0'); 
  
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  
  logger.log(`🚀 API rodando em: ${baseUrl}`);
  logger.log(`🔗 Frontend autorizado: ${allowedOrigins.join(', ')}`);
}
bootstrap();