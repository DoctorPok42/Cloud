import { NextApiResponse } from "next";

export default async function Logout(
  res: NextApiResponse
) {
  res.setHeader("Set-Cookie",
    [
      "username=; Path=/; Max-Age=-1",
      "token=; Path=/; Max-Age=-1"
    ]);
  res.status(200).end();
}
