import User from "../../models/user";

export default async (medias: string[], userId: string) => {
    try {
        const reordered = await User.findByIdAndUpdate(userId, {$set: {"profile.medias": medias}}, {new: true});
        if (reordered?.isModified) return true;
        else throw new Error("Cannot reorder\n");
    } catch(error) {
        throw new Error("Error at service/user/manageReorder\n"+error);
    }
}