import dotenv from 'dotenv';
import express from 'express';
import next from 'next';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoSessionStore from 'connect-mongo';
import auth from './google';
// import User from './models/User';
import logger from './logs';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;
const MongoStore = mongoSessionStore(session);

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(
  MONGO_URL,
  options,
);

const port = process.env.PORT || 8000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const sess = {
    name: 'builderbook.sid',
    secret: 'HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };
  server.use(session(sess));
  auth({ server, ROOT_URL });
  // server.get('/', async (req, res) => {
  //   // const user = { email: 'team@builderbook.org' };
  //   // req.session.foo = 'bar';
  //   await User.findOne({ slug: 'team-builder-book' }).then((user) => {
  //     req.user = user;
  //     app.render(req, res, '/');
  //   });
  // });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    logger.info(`> Ready on ${ROOT_URL}`);
  });
});
