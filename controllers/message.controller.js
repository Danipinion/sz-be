import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      select: {
        text: true,
        date: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const createMessage = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  // Check if userId is set and not null
  if (!id) {
    return res.status(400).json({ msg: "User not authenticated" });
  }

  try {
    // Check if user exists in the database
    const userExists = await prisma.users.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Create the message
    await prisma.message.create({
      data: {
        text,
        user: {
          connect: {
            id: id,
          },
        },
      },
    });

    res.status(201).json({ msg: "Message created successfully" });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ msg: error.message });
  }
};
