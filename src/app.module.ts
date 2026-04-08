import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsController } from './settings/settings.controller'; // 1. Importe aqui
import { ProvasModule } from './provas/provas.module';
import { ArtigosModule } from './artigos/artigos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DatabaseModule,
    AuthModule,
    ProvasModule,
    ArtigosModule,
  ],
  controllers: [
    AppController, 
    SettingsController // 2. Adicione aqui para ativar as rotas de banner
  ],
  providers: [AppService],
})
export class AppModule {}