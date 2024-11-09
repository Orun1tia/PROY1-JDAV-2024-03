import {loginAction, updateUserAction, signinAction, deleteUserAction} from "./user.actions"
import { UserType } from "./user.model"
import { CreateUserType } from "../types"

// DECLARE CONTROLLER FUNCTIONS
async function login(userData: { email: string; password: string }, includeInactive?: boolean):  Promise<{ user: UserType; token: string } | undefined> {

  const user = await loginAction(userData, includeInactive)
  return user
}

async function signin(userData: CreateUserType): Promise<UserType> {
  const createdUser = await signinAction(userData)

  return createdUser
}

async function updateUser(userData: CreateUserType, id: string): Promise<UserType| undefined> {
  const updatedUser = await updateUserAction(userData, id)

  return updatedUser
}

async function deleteUser(id: string): Promise<UserType> {
  const deletedUser = await deleteUserAction(id)

  return deletedUser
}

// EXPORT CONTROLLER FUNCTIONS
export { login, signin, updateUser, deleteUser }
