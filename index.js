// code away!
const server = require('./server');

const PORT = 5000;

server.listen(PORT, ()=>{
    console.log(`\n** Server runnnig on http://localhost:${PORT} **\n`);
})