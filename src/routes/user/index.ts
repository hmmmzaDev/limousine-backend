import { Express } from "express";

// import the customer routes
import customer from "./customer";

export default function Router(app: Express, commonRoute = "/user") {
    app.use(commonRoute + "/user", user);
    app.use(commonRoute + "/customer", customer);
}
