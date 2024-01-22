import { MessageInterface } from "../../../interfaces/messageInterface";
import Chat from "../../../models/chat";
import User from "../../../models/user";

export default async (chatId: string, message: MessageInterface, user1: string, user2: string) => {
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, {
        $pull: {messages: {timestamp: message.timestamp}},
    }, {new: true});
    if (chat?.messages.length === 0) {
        await User.findOneAndUpdate({username: user2}, {
            $pull: {chatHistory: {chat: chatId}},
        });
        await User.findOneAndUpdate({username: user1}, {
            $pull: {chatHistory: {chat: chatId}},
        });
        await Chat.findByIdAndDelete(chatId);
    }
    return true;
  } catch (error) {
    console.error("Errot at service/user/deleteMessage\n" + error);
  }
};
