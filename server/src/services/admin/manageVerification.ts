import User from "../../models/user";
import Verification from "../../models/verification";
import path from "path";
import fs from 'fs/promises'

export default async (requestId: string, verify: boolean) => {
    try {
        const request = await Verification.findByIdAndDelete(requestId);
        if (!request) throw new Error("Error deleting request");

        const user = await User.findByIdAndUpdate(request.requestedBy, {
            $set: {accountVerified: verify ? 'verified' : 'notverified'},
        }, {new: true});
        if (!user) throw new Error("Error updating verification on user");

        if (request?.doc) {
            const filepath = path.join(__dirname, '../../uploads/verifications/', request?.doc);
            await fs.unlink(filepath);
        }
        return user ? true : false;
    } catch (error) {
        throw new Error("Error at service/admin/manageVerification\n"+error)
    }
}