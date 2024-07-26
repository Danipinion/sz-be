import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const verifyUser = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) {
      return res.status(401).json({ msg: "Please login" });
    }
    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Please login" });
  }
};
