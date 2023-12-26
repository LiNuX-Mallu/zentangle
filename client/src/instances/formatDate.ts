export default function formatDate(timestamp: Date) {
    const date = new Date(timestamp);
    
    // Get day, month, and year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Formatted date in day/month/year format
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}