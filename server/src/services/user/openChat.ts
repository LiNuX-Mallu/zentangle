import User from "../../models/user";
import Chat from "../../models/chat";

export default async (userId: string, username: string) => {
    try {
        const chat = await User.findOne(
            { _id: userId, 'chatHistory.with': username },
            { 'chatHistory.$': 1, _id: 0 }
        );

        const profile = await User.findOne({username}, {firstname: 1, lastname: 1, _id: 0, 'profile.medias': 1});
        if (!profile) throw new Error("Couldn't find profile");

        if (chat) return {chat, profile};
        else return {profile, chat: []};
    } catch(error) {
        throw new Error("Error at service/user/openChat\n"+error);
    }
}