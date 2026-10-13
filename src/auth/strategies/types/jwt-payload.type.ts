export interface JwtPayload {
    userId: string
    iat?: number
    exp?: number
}

export interface AuthenticatedUser {
    userId: number
}