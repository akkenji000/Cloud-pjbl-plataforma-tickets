import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o Microfrontend conseguir consumir a API
  app.enableCors();

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('BFF - Plataforma de Tickets (PJBL)')
    .setDescription('Backend for Frontend agregando dados de Eventos, Pedidos e Taxas.')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(` BFF rodando em: http://localhost:3000`);
  console.log(` Swagger disponível em: http://localhost:3000/api/docs`);
}
bootstrap();