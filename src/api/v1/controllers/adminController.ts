import admin from "firebase-admin";
import { Request, Response } from "express";

export const setUserRole = async (req: Request, res: Response) => {
  try {
    const { uid, role } = req.body; // e.g., { uid: "...", role: "admin" }

    await admin.auth().setCustomUserClaims(uid, { role });

    res.status(200).json({ message: `Role ${role} set for user ${uid}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
