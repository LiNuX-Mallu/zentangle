export interface Alert {
    _id: string;
    title: string,
    content: string;
    seenBy: string[];
    timestamp: Date;
    isActive: boolean;
}