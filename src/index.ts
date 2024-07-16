import todoSequelize from './database/setup/database';
import server from './server';
import swaggerUi from 'swagger-ui-express';
import express, { RequestHandler } from 'express';

const PORT = process.env.PORT;

todoSequelize
  .sync()
  .then(() => {
    console.log('DB has been successfully initialized');
  })
  .catch(e => {
    console.log(e);
  });

if (process.env.NODE_ENV === 'dev') {
  server.use(express.static('docs'));

  // Typecasting swaggerUi.serve
  const swaggerServeMiddlewares: RequestHandler[] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    swaggerUi.serve as unknown as RequestHandler[];

  // Hinzufügen jeder Middleware-Funktion einzeln
  swaggerServeMiddlewares.forEach((middleware: RequestHandler) => {
    server.use('/swagger', middleware);
  });

  // Typecasting swaggerUi.setup
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const swaggerSetupMiddleware: RequestHandler = swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  }) as unknown as RequestHandler;

  server.use('/swagger', swaggerSetupMiddleware);

  console.log(`Swagger launched on at https://localhost:${PORT ?? ''}/swagger`);
}

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
