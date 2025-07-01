import { Express } from "express";

// import the admin routes
import auth from "./auth";
import utils from "./utils";
import customer from "./customer";
import driver from "./driver";
import booking from "./booking";

export default function Router(app: Express, commonRoute = "/admin") {
  app.use(commonRoute + "/auth", auth);
  app.use(commonRoute + "/utils", utils);
  app.use(commonRoute + "/customer", customer);
  app.use(commonRoute + "/driver", driver);
  app.use(commonRoute + "/booking", booking);
}
