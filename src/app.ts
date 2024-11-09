import userRoutes from "./v1/routes/user.routes"
import express from "express"
import { Request, Response } from "express"
import cors from "cors"
import bookRoutes from "./v1/routes/book.routes"

// ROUTES
const SERVER_VERSION = "/api/v1/"

// FALLBACKS
function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  })
}

export default function createApp() {
  // MIDDLEWARES
  const app = express()

  app.use(cors())
  app.use(express.json())
  
  app.use(SERVER_VERSION + "users", userRoutes)
  app.use(SERVER_VERSION + "books", bookRoutes)
  
  app.use(routeNotFound)
  return app
}