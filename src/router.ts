import AdminRouter from "./routes/admin";
import UserRouter from "./routes/user";

export default function ROUTER(app) {
  AdminRouter(app);
  UserRouter(app);
}
