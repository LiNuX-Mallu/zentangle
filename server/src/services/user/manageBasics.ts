import User from "../../models/user";

interface BasicsSelected {
    zodiac: string | undefined;
    education: string | undefined;
    familyPlan: string | undefined;
    communication: string | undefined;
    personality: string | undefined;
    loveStyle: string | undefined;
    vaccinated: string | undefined;
}

export default async (selected: BasicsSelected, userId: string) => {
    try {
        const user = await User.findById(userId);
        if (user?.profile) {
            user.profile.basics = selected;
            const saved = await user.save();
            return saved.profile?.basics;
        } else throw new Error("Unknown error");
    } catch(error) {
        throw new Error("Error at service/user/manageBasics\n"+error);
    }
}
