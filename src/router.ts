import AdminRouter from "./routes/admin";
import CustomerRouter from "./routes/user";

export default function ROUTER(app) {
  AdminRouter(app);
  CustomerRouter(app);
}
