import { Router, Request, Response } from "express"
import { deleteUser, login, signin, updateUser } from "../controllers/user.controller"
import { CreateUserType } from "../types"
import { authorizationMiddleware } from "../../../middleware/auth"

// INIT ROUTES
const userRoutes = Router()

// DECLARE ENDPOINT FUNCTIONS
async function Login(request: Request, response: Response) {
  if (request.body.email === undefined || request.body.password === undefined) {
    return response.status(400).json({
      message: "Missing fields"
    })
}

try {
  const includeInactive = request.query.includeInactive === "true" ? true : request.query.includeInactive  === "false" ? false : undefined
  const users = await login(request.body, includeInactive)

  if (!users) {
    return response.status(404).json({ message: "Invalid user or incorrect password." })
  }
  
  response.status(200).json({
    message: "Logged-in Success.",
    token: users.token,
  })

} catch (error) {
  response.status(500).json({
    message: "Failure",
    information: (error as any).toString()
  })
}
}

async function Signin(request: Request<CreateUserType>, response: Response) {
  if (request.body.name === undefined || request.body.email === undefined || request.body.password === undefined) {
    return response.status(400).json({
      message: "Missing fields"
    })
  }

  try {
    const user = await signin(request.body)
    
    response.status(200).json({
      message: "Success.",
      user: user,
    })

  } catch (error) {
    response.status(500).json({
      message: "Failure",
      information: (error as any).toString()
    })
  }
}

async function UpdateUser(request: Request, response: Response) {
  if (!request.body) {
    return response.status(400).json({
      message: "Missing fields"
    })
  }else if (request.body.canUpdateUsers !== undefined || request.body.canUpdateBooks !== undefined || request.body.canCreateBooks !== undefined || request.body.canDeleteBooks !== undefined 
    || request.body.canDeleteUsers !== undefined) {

      return response.status(403).json({
        message: "Unauthorized: Only authorized personnel can modify permissions directly in the database."
      });
  }else{

    try {
      const user = await updateUser(request.body, request.query.id as string)

      if (!user) {
        return response.status(404).json({ message: "Invalid user ID" })
      }
      
      response.status(200).json({
        message: "Data successfully changed",
        user: user,
     })
  
    } catch (error) {
      response.status(500).json({
        message: "Failure",
        information: "Invalid user ID"
      })
    }
  }
  
  
}

async function DeleteUser(request: Request, response: Response) {
    try {
      const user = await deleteUser(request.query.id as string)
      
      response.status(200).json({
        message: "User successfully disabled",
        user: user._id,
     })
  
    } catch (error) {
      response.status(500).json({
        message: "Failure",
        information: "Invalid user ID"
      })
    }
  }
  
  

// DECLARE ENDPOINTS
userRoutes.get("/", Login)
userRoutes.put("/", authorizationMiddleware("canUpdateUsers", true), UpdateUser)
userRoutes.post("/", Signin)
userRoutes.delete("/", authorizationMiddleware("canDeleteUsers", true), DeleteUser)

// EXPORT ROUTES
export default userRoutes
