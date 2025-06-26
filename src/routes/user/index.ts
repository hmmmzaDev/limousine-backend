import { Express } from "express";

// import the user routes
import user from "./user";

export default function Router(app: Express, commonRoute = "/user") {
    app.use(commonRoute + "/user", user);
}
