import User from "../../models/user"
import Chat from "../../models/chat";

export default async (userId: string) => {
    try {
        const user = await User.findById(userId, {chatHistory: 1, _id: 0});
        if (!user) return [];

        const chatHistory = await Promise.all(user.chatHistory.map(async (chat) => {
            const profile = await User.findOne({username: chat?.with}, {'profile.medias': 1, 'username': 1});
            const messages = await Chat.findById(chat?.chat);
            return {
                profile: {name: profile?.username, picture: profile?.profile?.medias[0]},
                lastMessage: messages?.messages[messages.messages?.length - 1],
            }
        }));

        chatHistory.sort((a, b) => {
            const timeA = a.lastMessage?.timestamp?.getTime();
            const timeB = b.lastMessage?.timestamp?.getTime();
            if (timeA && timeB) {
              return timeB - timeA;
            }
            return 0;
        })
        
        return chatHistory ?? [];
    } catch(error) {
        throw new Error("Error at service/user/getMessages\n"+error);
    }
}