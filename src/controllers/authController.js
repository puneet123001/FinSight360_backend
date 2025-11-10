import { OAuth2Client } from "google-auth-library";
import { generateTokens } from "../utils/generateTokens.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user)
      user = await User.create({ name, email, authProvider: "google" });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google Auth Failed" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken } = generateTokens(decoded.userId);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ success: true });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
