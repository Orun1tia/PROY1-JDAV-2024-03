import { BookType } from "./Book/book.model"
import { UserType } from "./User/user.model"


export type CreateUserType = Omit<UserType, "_id">
export type UpdateUserType = Omit<Partial<UserType>, "_id">
export type CreateBookType = Omit<BookType, "_id">
export type UpdateBookType = Omit<Partial<BookType>, "_id">