import { MessageInterface } from "../../interfaces/messageInterface";
import Chat from "../../models/chat";
import User from "../../models/user";

export default async (chatId: string | null, username1: string, username2: string, message: MessageInterface) => {
    try {
        const chat = await Chat.findByIdAndUpdate(chatId);
        if (chat) {
            chat.messages.push(message);
            await chat.save();
            return null;
        } else {
            const newChat = await new Chat({messages: [message]}).save();
            await User.findOneAndUpdate({username: username1}, {
                $push: {chatHistory: {with: username2, chat: newChat._id}},
            });
            await User.findOneAndUpdate({username: username2}, {
                $push: {chatHistory: {with: username1, chat: newChat._id}},
            });
            return newChat._id.toString() ?? null;
        }
    } catch(error) {
        console.error("Errot at service/user/saveMessage\n"+error);
    }
}