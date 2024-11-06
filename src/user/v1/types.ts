import { BookType } from "./models/book.model"
import { UserType } from "./models/user.model"


export type CreateUserType = Omit<UserType, "_id">
export type UpdateUserType = Omit<Partial<UserType>, "_id">
export type CreateBookType = Omit<BookType, "_id">
export type UpdateBookType = Omit<Partial<BookType>, "_id">