import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const response = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msgk: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {}
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirm password do not match" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  try {
    await prisma.users.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
