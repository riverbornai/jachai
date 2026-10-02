export default function (time) {
    if (!time) return "";

    const date = new Date(time || "");
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    const dayDiff = Math.floor(diff / 86400);

    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
        return date.toISOString().split("T")[0];
    }

    const intervals = [
        { limit: 60, label: "just now" },
        { limit: 120, label: "1 minute ago" },
        { limit: 3600, label: "minutes", divisor: 60 },
        { limit: 7200, label: "1 hour ago" },
        { limit: 86400, label: "hours", divisor: 3600 },
    ];

    if (dayDiff === 0) {
        for (const interval of intervals) {
            if (diff < interval.limit) {
                if (interval.divisor) {
                    return `${Math.floor(diff / interval.divisor)} ${interval.label} ago`;
                }
                return interval.label;
            }
        }
    }

    if (dayDiff === 1) return "Yesterday";
    if (dayDiff < 7) return `${dayDiff} days ago`;
    return `${Math.ceil(dayDiff / 7)} weeks ago`;
}