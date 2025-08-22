import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import http from "http";
const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || "5000", 10);
const HOST = process.env.HOST || "0.0.0.0";
if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, HOST, () => {
    console.log(`server listening on http://${HOST}:${PORT}`);
  });
}

// export default server;
export default app;
