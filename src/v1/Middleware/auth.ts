import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { UserType } from "../User/user.model"

export function authorizationMiddleware(permissionField: keyof UserType, requireId: boolean = false) {
    return async (request: Request, response: Response, next: NextFunction) => {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            return response.status(401).json({
                message: "Authorization header is missing."
            })
        }

        const token = authHeader.split(' ')[1]

        try {
            const jwtValues: any = verify(token, process.env.JWT_SECRET as string)
            const userId = jwtValues.id
            const userPermissions = jwtValues[permissionField]

            let targetUserId: string | undefined

            if (requireId) {
                targetUserId = request.query.id as string

                if (!targetUserId) {
                    return response.status(400).json({
                        message: "User ID is missing in query parameters."
                    })
                }
            }

            if (!userPermissions && targetUserId !== userId) {
                return response.status(403).json({
                    message: "You do not have permission to perform this action."
                })
            }
            next()
        } catch (error) {
            return response.status(401).json({
                message: "Invalid or expired token."
            })
        }
    }
}
