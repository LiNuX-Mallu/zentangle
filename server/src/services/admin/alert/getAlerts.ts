import Alert from "../../../models/alert";

export default async (currentPage: number, isActive: boolean) => {
  const perPage = 6;
  try {
    const alerts = await Alert.find({ isActive })
      .sort({ timestamp: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!alerts) throw new Error("Cannot find alerts");
    return alerts;
  } catch (error) {
    throw new Error("Error at service/admin/getAlerts\n" + error);
  }
};
