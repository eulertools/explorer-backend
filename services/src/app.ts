import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers, { HookContext as FeathersHookContext, } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import compress from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import favicon from 'serve-favicon';
import appHooks from './app.hooks';
import channels from './channels';
import ddb from './ddb';
import { Application } from './declarations';
import { websocketHook } from './hooks/auth';
import logger from './logger';
import { internal as internalMiddleware, redis as redisMiddleware, } from './middleware';
import models from './models';
import services from './services';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('events').EventEmitter.defaultMaxListeners = 100;

dotenv.config();

const app: Application = express(feathers());

export type HookContext<T = any> = {
  app: Application;
} & FeathersHookContext<T>;

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({tracing: true}),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({app}),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(function (req, res, next) {
  const urlPath = req.url.split('/')
  const chainId = urlPath[1] === 'eth' || urlPath[1] === 'bsc' ? urlPath[1] : null;
  req.url = req.url.replace('/bsc/', '/')
  req.url = req.url.replace('/eth/', '/')
  req.feathers = {chain: chainId};
  next();
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Set up Plugins and providers
app.configure(express.rest());
app.configure(
  socketio(
    {
      path: '/ws',
      pingInterval: 8000,
      pingTimeout: 60000,
    },
    function (io) {
      io.use(websocketHook(app));
    }
  )
);

// setup data sources
//app.configure(sequelize);
app.configure(ddb);

// init models
app.configure(models);

// Configure other middleware (see `middleware/index.ts`)
app.configure(internalMiddleware);
app.configure(redisMiddleware);

// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({logger} as any));

app.hooks(appHooks);

export default app;
