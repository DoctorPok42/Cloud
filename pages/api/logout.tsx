import { NextApiRequest, NextApiResponse } from "next";

export default async function Logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Set-Cookie", ["username=; Path=/; Max-Age=-1"]);
  res.status(200).end();
}
