import User from "../../models/user";

export default async (where: string, what: string | boolean | object, userId: string) => {
    try {
        let field: null | string = null;
        switch (where) {
            case 'distance':
                field = "preferences.distance";
                break;
            case 'onlyFromAgeRange':
                field = "preferences.onlyFromAgeRange";
                break;
            case 'ageRange':
                field = "preferences.ageRange";
                break;
            case 'global':
                field = "preferences.global";
                break;
            default:
                field = null;
        }
        const query = {[field as string]: what };
        const updated = await User.findByIdAndUpdate(userId, query, {new: true});
        if (updated) return true;
        else throw new Error("Unknown error\n");
    } catch(error) {
        throw new Error("Error at service/user/updateSettigns\n"+error);
    }
}