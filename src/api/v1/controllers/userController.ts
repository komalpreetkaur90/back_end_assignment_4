import admin from "firebase-admin";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await admin.auth().getUser(uid);

    res.status(200).json({
      message: "User details fetched successfully",
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
