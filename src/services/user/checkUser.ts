import User from "../../models/user";

interface UserData {
    username: string;
    password: string;
}

export default async (data: UserData) => {
    const {username, password} = data;
    try {
        const user = await User.findOne({username});
        if (user) {
            if (user && user.password === password) {
                return user._id;
            } else {
                return false;
            }
        } else return false;
    } catch(error) {
        throw new Error("Error at service/user/checkUser\n"+error);
    }
}