import Admin from "../../models/admin";

interface adminData {
    username: string;
    password: string;
}

export default async (data: adminData) => {
    const {username, password} = data;
    try {
        const admin = await Admin.findOne();
        if (admin) {
            if (admin && admin.password === password) {
                return admin._id;
            } else {
                return false;
            }
        } else return false;
    } catch(error) {
        throw new Error("Error at service/admin/checkAdmin\n"+error);
    }
}