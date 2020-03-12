const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();



//custom middleware
server.use(logger);
server.use(express.json());
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
    const method = req.method;
    const url = req.originalUrl;
    console.log(`Method '${method}' to URL '${url}' requested on '${new Date}'`)
    next();
}

module.exports = server;

