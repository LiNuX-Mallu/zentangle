import Report from "../../models/report";
import User from "../../models/user";

export default async (currentPage: number, filter: string) => {
    const perPage = 6;
    try {
        const reports = await Report.find({status: filter ?? 'open'})
            .sort({timestamp: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
        if (!reports) throw new Error("Cannot find reports");

        return await Promise.all(reports.map(async (report) => {
            return {
                id: report._id,
                status: report.status,
                complainer: await User.findOne({username: report.complainer}),
                complainee: await User.findOne({username: report.complainee}),
                complaint: report.complaint,
                images: report.images,
                timestamp: report.timestamp,
            }
        }));

    } catch(error) {
        throw new Error("Error at service/admin/getReports\n"+error);
    }
}