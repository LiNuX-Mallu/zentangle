import User from "../../models/user";

export default async (data: string, userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Could not find user\n");
        }
        if (user.profile?.relationship?.lookingFor === data) {
            return await User.findByIdAndUpdate(userId, {$unset: {"profile.relationship.lookingFor": null}}, {new: true});
        } else {
            return await User.findByIdAndUpdate(userId, {$set: {"profile.relationship.lookingFor": data}}, {new: true});
        }
    } catch(error) {
        throw new Error("Error at service/user/manageLookingFor\n"+error);
    }
}