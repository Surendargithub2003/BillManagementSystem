const http = require("http");
const app1 = require("./backend/app");

const PORT = 3000;
const server = http.createServer(app1);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

