import Report from "../../models/report";
import User from "../../models/user";

export default async (userId: string, against: string, reason: string, images: string[]) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("Cannot find user");

        const report = await new Report({
            status: 'submitted',
            complainer: user.username,
            complainee: against,
            reason,
        }).save();
        if (!report) throw new Error("Cannot create report");

        user.reports.push(report._id);
        return user.save();
        
    } catch (error) {
        throw new Error("Error at service/user/manageReport\n"+error);
    }
}