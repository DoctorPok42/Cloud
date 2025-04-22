import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/db";
import { verify_token } from "./functions";

export default async function unloadShareLink(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code, token } = req.body;

    if (!code || !token) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const verified = verify_token(token);
    if (!verified)
      return res.status(401).json({ error: "Invalid token" });


    const { db } = await connectToDatabase();
    const share = await db.collection("share").findOneAndDelete({
      uniqueId: code,
    });
    if (!share) {
      return res.status(404).json({ error: "Share link not found" });
    }

    return res.status(200).json({ message: "Share link successfully deleted" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}