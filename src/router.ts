import AdminRouter from "./routes/admin";
import CustomerRouter from "./routes/user";
import DriverRouter from "./routes/driver";

export default function ROUTER(app) {
  AdminRouter(app);
  CustomerRouter(app);
  DriverRouter(app);
}
