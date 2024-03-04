import { Wallet } from "ethers";
import { Client } from "@xmtp/react-sdk";

const sendMessage = async () => {
  const wallet = Wallet.createRandom();
  const client = await Client.create(wallet);
  console.log(wallet.address);
  try {
    // Ensure the client is ready
    await client.ready;

    // Create or get a conversation with the recipient
    const conversation = await client.conversations.newConversation(
      "0x7E0b0363404751346930AF92C80D1fef932Cc48a"
    );

    // Send a message
    await conversation.send("Hello from a random wallet!");

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

// src/api/hello.js
export default async function handler(req, res) {
  // Call the function to send a message
  await sendMessage();
  console.log("XMTP message operation completed.");

  res
    .status(200)
    .json({ message: "Hello from a serverless function inside src!" });
}
