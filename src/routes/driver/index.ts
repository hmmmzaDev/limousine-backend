import { Express } from "express";

// import the driver routes
import booking from "./booking";

export default function Router(app: Express, commonRoute = "/driver") {
    app.use(commonRoute + "/booking", booking);
}
