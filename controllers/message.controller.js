import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      select: {
        text: true,
        date: true,
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

async function sendToExternalAPI(data) {
  try {
    const response = await fetch(
      "http://103.247.12.9:3000/api/v1/prediction/7c409c1e-9997-4351-8aa5-a151074f0dc0",
      {
        headers: {
          Authorization: "Bearer QgbxuaheuYixNxAnq-USjP-7NJ41ndDOJC5cOyFqSDk",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending to external API:", error);
    throw new Error("Failed to send data to external API");
  }
}

export const createMessage = async (req, res) => {
  const { text } = req.body;

  try {
    const externalApiResponse = await sendToExternalAPI({
      question: text,
    });

    // Create the message
    await prisma.message.create({
      data: {
        text: externalApiResponse.text,
      },
    });

    res.status(201).json({ msg: "Message created successfully" });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ msg: error.message });
  }
};

setInterval(async () => {
  const message = {
    text: "tolong buatkan artikel singkat 1 paragraf mengenai kenakalan remaja",
  };

  try {
    await createMessage({ body: message });
    console.log("Message created successfully");
  } catch (error) {
    console.error("Error creating message:", error);
  }
}, 1 * 60 * 60 * 1000);
