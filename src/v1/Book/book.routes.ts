import { Router, Request, Response } from "express"
import { createBook, deleteBook, readBooks, updateBook } from "./book.controller"
import { authorizationMiddleware } from "../Middleware/auth"

// INIT ROUTES
const bookRoutes = Router()

// DECLARE ENDPOINT FUNCTIONS
async function GetBooks(request: Request, response: Response) {
  try {
   const queryData = {
      id: request.query.id as string,
      includeInactive: request.query.includeInactive === "true" ? true : request.query.includeInactive  === "false" ? false : undefined,
    }

    const books = await readBooks(queryData, request.body)

    if (!books) {
      return response.status(404).json({ message: "No book(s) found" })
    }

    response.status(200).json({
      message: "Success.",
      books,
    })

  } catch (error) {
    response.status(500).json({
      message: "Failure",
      information: (error as any).toString(),
    })
  }
}


async function CreateBook(request: Request, response: Response) {
  if (request.body.name === undefined || request.body.genre === undefined || request.body.publicationDate === undefined || request.body.publisher === undefined || 
    request.body.author === undefined || request.body.availability === undefined) {
    return response.status(400).json({
      message: "Missing fields"
    })
  }

  try {
    const books = await createBook(request.body)

    response.status(200).json({
      message: "Success.",
      books: books,
    })

  } catch (error) {
    response.status(500).json({
      message: "Failure",
      information: (error as any).toString()
    })
  }
}

async function UpdateBook(request: Request, response: Response) {
  if (!request.body) {
    return response.status(400).json({
      message: "Missing fields"
    })
  } else {

    try {
      const books = await updateBook(request.body, request.query.id as string)

      if (!books) {
        return response.status(404).json({ message: "Invalid book ID" })
      }

      response.status(200).json({
        message: "Data successfully changed",
        books: books,
      })

    } catch (error) {
      response.status(500).json({
        message: "Failure",
        information: "Invalid book ID"
      })
    }
  }


}

async function DeleteBook(request: Request, response: Response) {
  try {
    const user = await deleteBook(request.query.id as string)
    
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
bookRoutes.get("/", GetBooks)
bookRoutes.put("/", authorizationMiddleware("canUpdateBooks", true), UpdateBook)
bookRoutes.post("/", authorizationMiddleware("canCreateBooks"), CreateBook)
bookRoutes.delete("/", authorizationMiddleware("canDeleteBooks", true), DeleteBook)

// EXPORT ROUTES
export default bookRoutes
