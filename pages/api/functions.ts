import jwt from 'jsonwebtoken'

export function createAuthToken(token: string) {
  const tokenJ = jwt.sign({ token: token }, process.env.ENCODED_KEY as string, {
    expiresIn: '1h',
  })
  return tokenJ
}

export function verify_token(token: string) {
  try {
    const decoded: any = jwt.verify(
      token as string,
      process.env.ENCODED_KEY as string,
    )
    if (!decoded) {
      return false
    }
    return decoded.token
  } catch (error) {
    return false
  }
}
