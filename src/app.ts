import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";

import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import errorHandler from "./middlewares/apiErrorHandler";
import ROUTER from "./router";
/* import connectDB from "./config/db";
connectDB(); */

import dbConnect from "./config/mongoose";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Limousine API",
      version: "1.0.0",
      description: "API documentation for Limousine-Booking Platform",
    },
    servers: [
      {
        // The URL now uses a variable placeholder {baseUrl}
        url: "<<baseUrl>>",
        description: "API Server (uses environment variable for base URL)",
        variables: {
          baseUrl: {
            // This 'default' value will be used if the Hoppscotch
            // environment variable <<baseUrl>> is not set or not mapped.
            // It ensures the spec is valid and can be used out-of-the-box.
            default: "http://localhost:5000",
            description:
              "The base URL for the API. In Hoppscotch, this will be replaced by your <<baseUrl>> environment variable.",
          },
          // You could add more variables here if needed, for example:
          // port: {
          //   default: "5000", // Default port
          //   description: "Server port"
          // },
          // Then your URL could be: "{baseUrl}:{port}"
        },
      },
      // You can add other server configurations if needed, e.g., for staging or production
      // {
      //   url: "https://staging.api.example.com",
      //   description: "Staging Server"
      // },
      // {
      //   url: "https://production.api.example.com",
      //   description: "Production Server"
      // }
    ],
    // You would also include your tags and x-tagGroups here if you're using them
    // tags: [
    //   { name: "Admin - City", description: "City management for Administrators" },
    //   // ... other tags
    // ],
    // 'x-tagGroups': [
    //   {
    //     name: 'Admin APIs',
    //     tags: [ 'Admin - City', /* ... */ ],
    //   },
    //   // ... other tag groups
    // ],
  },
  apis: ["./dist/routes/**/*.js"], // Files containing annotations as above
  // apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

// Parse JSON bodies (with lenient type checking)
app.use(express.json({ type: ["application/json", "text/plain"] }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {}))
  .on("error", (err) => {
    console.log(err);
  });

app.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec); // Send the generated spec object
});

app.use((req, res, next) => {
  console.log(`Received request for ${req.url} with ${req.method}`);
  next();
});

// Middleware to ensure DB connection for API routes
// This ensures dbConnect is called before your route handlers that need the DB.
app.use(async (req: Request, res: Response, next: NextFunction) => {
  // You might want to be more specific about which routes need DB connection
  // For example, exclude static assets or health checks not needing DB.
  // if (req.path.startsWith("/api/") || req.url.includes("your-api-prefix")) {
  // Adjust as needed
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB Connection Middleware Error:", error);
    // Do not proceed if DB connection fails for critical routes
    res
      .status(503)
      .json({ message: "Service Unavailable - Database connection error" });
    return;
  }
  // }
  next();
});

ROUTER(app);
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use(errorHandler);

export default app;
