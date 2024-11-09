import bcrypt from 'bcrypt'
import { UserModel, UserType } from "../User/user.model"
import { CreateUserType } from "../types"
import jwt from 'jsonwebtoken'
import { BookModel } from '../Book/book.model';


// DECLARE ACTION FUNCTION
async function loginAction(userData: { email: string; password: string }, includeInactive?: boolean): Promise<{ user: UserType; token: string } | undefined> {
  const { email, password } = userData

  const results = await UserModel.findOne({ email, ...(includeInactive? {} : { isActive: true })  }).select('-isActive')
  

  if (!results || !await bcrypt.compare(password, results.password)) {
    return undefined
  }

  const token = jwt.sign({
    id: results._id, 
    canUpdateUsers: results.canUpdateUsers,
    canUpdateBooks: results.canUpdateBooks,
    canCreateBooks: results.canCreateBooks,
    canDeleteBooks: results.canDeleteBooks,
    canDeleteUsers: results.canDeleteUsers
    
  }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

  const { password: _, ...resultsNoPassword } = results.toObject()
  return { user: resultsNoPassword as UserType, token }
}


async function signinAction(userData: CreateUserType): Promise<UserType> {

  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const userWithHashedPassword = { ...userData, password: hashedPassword }
  const results = await UserModel.create(userWithHashedPassword)

  return results
}

async function updateUserAction(userData: CreateUserType, id: string): Promise<UserType | undefined> {
  
  const updatedData: Partial<CreateUserType> = { ...userData }

  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    updatedData.password = hashedPassword //
  } else {
    delete updatedData.password
  }

  const results = await UserModel.findByIdAndUpdate(id, updatedData, { new: true })
  if (!results) {
    return undefined
  }

  if (userData.reservationHistory && userData.reservationHistory.length > 0) {
    const latestReservation = userData.reservationHistory[userData.reservationHistory.length - 1]

    const book = await BookModel.findOne({
      name: latestReservation.bookName,
      availability: true
    })

    if (book) {
      book.reservationHistory.push({
        userName: results.name,
        reservationDate: latestReservation.reservationDate,
        deliveryDate: latestReservation.deliveryDate
      })

      book.availability = false
      await book.save()
    }
  }


  const { password: _, ...resultsNoPassword } = results.toObject()
  return resultsNoPassword as UserType
}

async function deleteUserAction(id: string): Promise<UserType> {

  const results = await UserModel.findByIdAndUpdate(id, {isActive: false} , { new: true })

  return results as UserType
}

// EXPORT ACTION FUNCTION
export { loginAction, signinAction, updateUserAction,deleteUserAction }
