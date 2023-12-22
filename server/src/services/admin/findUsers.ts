import User from "../../models/user";

export default async (currentPage: number, filter: string) => {
    const perPage = 6;
    const query = filter === 'verified' ? {accountVerified: 'verified'} : {};
    try {
        const users = await User.find(query).skip((currentPage - 1) * perPage).limit(perPage);
        if (users) {
            return users;
        } else {
            throw new Error("Cannot find users\n");
        }
    } catch(error) {
        throw new Error("Error at service/admin/findUsers"+error);
    }
}