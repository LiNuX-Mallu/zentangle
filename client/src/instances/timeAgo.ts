export function timeAgo(timestamp: Date): string {
    const timeInMillis = typeof timestamp === 'string' ? Date.parse(timestamp) : (timestamp as Date).getTime();
    const seconds = Math.floor((Date.now() - timeInMillis) / 1000);

    const interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return `${interval}y ago`;
    }
    if (interval === 1) {
        return '1y ago';
    }

    const months = Math.floor(seconds / 2592000);
    if (months > 1) {
        return `${months}m ago`;
    }
    if (months === 1) {
        return '1m ago';
    }

    const days = Math.floor(seconds / 86400);
    if (days > 1) {
        return `${days}d ago`;
    }
    if (days === 1) {
        return '1d ago';
    }

    const hours = Math.floor(seconds / 3600);
    if (hours > 1) {
        return `${hours}h ago`;
    }
    if (hours === 1) {
        return '1h ago';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes > 1) {
        return `${minutes}m ago`;
    }
    if (minutes === 1) {
        return '1m ago';
    }

    return 'just now';
}