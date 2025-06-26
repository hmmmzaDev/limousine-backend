import { Express } from "express";

// import the user routes
import user from "./user";
import customer from "./customer";

export default function Router(app: Express, commonRoute = "/user") {
    app.use(commonRoute + "/user", user);
    app.use(commonRoute + "/customer", customer);
}
