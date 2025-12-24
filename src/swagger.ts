import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): any {
    const logger: Logger = new Logger('Swagger');

    const options = new DocumentBuilder()
        .setTitle('ForestDB API')
        .setDescription('The API Description for ForestDB')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api/v1/api-docs", app, document);
    logger.log(`Added swagger on endpoint /api/v2/api-docs`);
}
