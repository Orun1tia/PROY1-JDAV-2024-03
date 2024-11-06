import { model, Schema } from "mongoose"

// DECLARE MODEL TYPE
type UserType = {
  _id: string
  name: string
  email: string
  password: string
  canUpdateUsers: boolean
  canUpdateBooks: boolean
  canCreateBooks: boolean
  canDeleteBooks: boolean
  canDeleteUsers: boolean
  isActive: boolean
  reservationHistory: {
    bookName: string
    reservationDate: Date
    deliveryDate: Date
  }[]
}

// DECLARE MONGOOSE SCHEMA
const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    canUpdateUsers: {
      type: Boolean,
      default: false
    },
    canUpdateBooks: {
      type: Boolean,
      default: false
    },
    canCreateBooks: {
      type: Boolean,
      default: false
    },
    canDeleteUsers: {
      type: Boolean,
      default: false
    },
    canDeleteBooks: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    reservationHistory: {
      type: [
        {
          bookName: {
            type: String,
            required: true
          },
          reservationDate: {
            type: Date,
            required: true
          },
          deliveryDate: {
            type: Date,
            required: true
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema)

// EXPORT ALL
export { UserModel, UserSchema, UserType }
