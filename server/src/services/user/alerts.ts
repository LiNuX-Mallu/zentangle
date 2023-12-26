import Alert from "../../models/alert";

export default async (userId: string) => {
    try {
        const alert = await Alert.findOneAndUpdate({
            isActive: {$eq: true},
            seenBy: {$nin: [userId]},
        }, {
            $push: {seenBy: userId},
        }, {
            new: true
        });

        return alert;

    } catch (error) {
        throw new Error("Error at service/user/getAlerts\n"+error);
    }
}