import {readBookAction, createBookAction, updateBookAction, deleteBookAction} from "./book.actions"
import { BookType } from "./book.model"
import { CreateBookType } from "../types"

// DECLARE CONTROLLER FUNCTIONS
async function readBooks(queryData: { id?: string; includeInactive?: boolean }, bodyData: Partial<BookType>): Promise<BookType | BookType[] | undefined> {
  const bookData = {
    ...bodyData,
    ...queryData,
  }

  const books = await readBookAction(bookData)
  return books
}

async function createBook(bookData: CreateBookType): Promise<BookType> {
  const createdBook = await createBookAction(bookData)

  return createdBook
}

async function updateBook(bookData: CreateBookType, id: string): Promise<BookType| undefined> {
  const updatedUser = await updateBookAction(bookData, id)

  return updatedUser
}

async function deleteBook(id: string): Promise<BookType> {
  const deletedUser = await deleteBookAction(id)

  return deletedUser
}


// EXPORT CONTROLLER FUNCTIONS
export { readBooks, createBook, updateBook, deleteBook }