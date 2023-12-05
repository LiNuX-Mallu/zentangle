import User from "../../models/user";
import Chat from "../../models/chat";

export default async (userId: string, username: string) => {
    try {
        const profile = await User.findOne({username}, {firstname: 1, lastname: 1, chatHistory: 1, _id: 0, 'profile.medias': 1});
        const me = await User.findById(userId, {username: 1, _id: 0});

        if (!profile || !me) throw new Error("Couldn't find profile or user");

        const chat = profile?.chatHistory?.find(chat => chat.with === me?.username);
        profile.chatHistory = null!;

        if (chat) {
            const foundChat = await Chat.findById(chat?.chat);
            return {chat: foundChat?.messages ?? [], profile, chatId: chat?.chat ?? null};
        } else return {profile, chat: [], chatId: null};
    } catch(error) {
        throw new Error("Error at service/user/openChat\n"+error);
    }
}