import User from "../../models/user";

export default async (selected: string[], userId: string) => {
    try {
        const user = await User.findById(userId);
        if (user?.profile) {
            user.profile.languages = selected;
            const saved = await user.save();
            return saved.profile?.languages;
        } else throw new Error("Unknown error");
    } catch(error) {
        throw new Error("Error at service/user/manageLanguage\n"+error);
    }
}