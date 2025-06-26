import { Express } from "express";

// import the user and utils routes
import user from "./user";
import utils from "./utils";

export default function Router(app: Express, commonRoute = "/admin") {
  app.use(commonRoute + "/user", user);
  app.use(commonRoute + "/utils", utils);
}
