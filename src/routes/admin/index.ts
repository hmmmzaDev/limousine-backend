import { Express } from "express";

// import the user and utils routes
import user from "./user";
import utils from "./utils";
import customer from "./customer";
import driver from "./driver";

export default function Router(app: Express, commonRoute = "/admin") {
  app.use(commonRoute + "/user", user);
  app.use(commonRoute + "/utils", utils);
  app.use(commonRoute + "/customer", customer);
  app.use(commonRoute + "/driver", driver);
}
