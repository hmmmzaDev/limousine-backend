import { Express } from "express";

// import the customer routes
import customer from "./customer";
import booking from "./booking";
import payment from "./payment";

export default function Router(app: Express, commonRoute = "/customer") {
    app.use(commonRoute + "/profile", customer);
    app.use(commonRoute + "/booking", booking);
    app.use(commonRoute + "/payment", payment);
}
