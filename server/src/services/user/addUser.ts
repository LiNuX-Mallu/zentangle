import User from "../../models/user";

interface UserData {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    dob: Date;
    password: string;
}

export default async (data: UserData) => {
    try {
        const newUser = new User(data);
        const saved = await newUser.save();
        return saved;
    } catch(error) {
        throw new Error("Error at service/user/addUser\n" + error);
    }
};