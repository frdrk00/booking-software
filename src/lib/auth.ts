import { jwtVerify } from 'jose'

interface UserJwtPayload {
    jti: string
    iat: number
}

export function getJwtSecretKey(): string {
    const secret = process.env.JWT_SECRET_KEY

    if(!secret || secret.length === 0) {
        throw new Error('JWT secret is not defined')
    }

    return secret
}

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))

        return verified.payload as UserJwtPayload
    } catch (error) {
        throw new Error('You token is invalid')
    }
}