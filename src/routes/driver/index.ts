import { Express } from "express";

// import the driver routes
import booking from "./booking";
import profile from "./profile";

export default function Router(app: Express, commonRoute = "/driver") {
    app.use(commonRoute + "/booking", booking);
    app.use(commonRoute + "/profile", profile);
}
