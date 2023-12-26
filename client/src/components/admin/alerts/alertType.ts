export interface Alert {
    _id: string;
    title: string,
    content: string;
    seenBy: object;
    timestamp: Date;
    isActive: boolean;
}