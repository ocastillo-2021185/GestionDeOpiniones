import jwt from 'jsonwebtoken'

export const generateJwt = async (payload) => {
    try {
        let secretKey = process.env.SECRET_KEY
        return jwt.sign(payload, secretKey, {
            expiresIn: '3h',
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error);
        return error
    }
}