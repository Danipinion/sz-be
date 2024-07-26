import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    req.session.userId = user.id;
    await req.session.save();
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Me = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ msg: "please login" });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: "Logout failed" });
  });
  res.status(200).json({ msg: "Logout success" });
};
