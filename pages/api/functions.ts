import jwt from "jsonwebtoken";

export function createAuthToken(token: string, long?: boolean) {
  const tokenJ = jwt.sign({ token: token }, process.env.ENCODED_KEY as string, {
    ...(!long && { expiresIn: "1h" }),
  });
  return tokenJ;
}

export function verify_token(token: string) {
  try {
    const decoded: any = jwt.verify(token, process.env.ENCODED_KEY as string);
    if (!decoded) {
      return false;
    }
    return decoded.token;
  } catch (error) {
    return false;
  }
}
