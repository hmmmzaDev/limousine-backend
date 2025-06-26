import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import http from "http";
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

// export default server;
export default app;
