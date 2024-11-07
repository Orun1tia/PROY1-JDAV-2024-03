import { BookModel, BookType } from "../models/book.model"
import { CreateBookType } from "../types"

// DECLARE ACTION FUNCTION
async function readBookAction(bookData: { id?: string; genre?: string; publicationDate?: string; publisher?: string; author?: string; name?: string; availability?: boolean; includeInactive?: boolean }): Promise<BookType[] | BookType | undefined> {
  const { id, genre, publicationDate, publisher, author, name, availability, includeInactive } = bookData

  
  if (id) {
    const results = await BookModel.findOne({ _id: id, ...(includeInactive ? {} : { isActive: true }) }).select('-isActive')
    return results || undefined
  }

  const query: any = { ...(includeInactive ? {} : { isActive: true }) }
  if (genre) query.genre = genre
  if (publicationDate) query.publicationDate = new Date(publicationDate)
  if (publisher) query.publisher = publisher
  if (author) query.author = author
  if (name) query.name = { $regex: new RegExp(name, 'i') }
  if (availability !== undefined) query.availability = availability

  const results = await BookModel.find(query).select('-isActive')
  
  return results.length > 0 ? results : undefined
}




async function createBookAction(bookData: CreateBookType): Promise<BookType> {
  const results = await BookModel.create(bookData)

  return results
}

async function updateBookAction(userData: CreateBookType, id: string): Promise<BookType | undefined> {
  const results = await BookModel.findByIdAndUpdate(id, userData, { new: true })

  if (!results) {
    return undefined
  }

  return results
}

async function deleteBookAction(id: string): Promise<BookType> {

  const results = await BookModel.findByIdAndUpdate(id, { isActive: false }, { new: true })

  return results as BookType
}

// EXPORT ACTION FUNCTION
export { readBookAction, createBookAction, updateBookAction, deleteBookAction }
