import { model, Schema } from "mongoose"

// DECLARE MODEL TYPE
type BookType = {
  _id: string
  name: string
  genre: string
  publicationDate: string
  publisher: string
  author: string
  availability: boolean
  isActive: boolean
  reservationHistory: {
    userName: string
    reservationDate: Date
    deliveryDate: Date
  }[]

}

// DECLARE MONGOOSE SCHEMA
const BookSchema = new Schema<BookType>({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  publicationDate: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reservationHistory: {
    type: [
      {
        userName: {
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
}, {
  timestamps: false,
  versionKey: false,
})

// DECLARE MONGO MODEL
const BookModel = model<BookType>("Book", BookSchema)

// EXPORT ALL
export { BookModel, BookSchema, BookType }
