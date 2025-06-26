export function convertEpochToFormattedDate(epochMilliseconds): any {
    const date = new Date(epochMilliseconds);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    const paddedDay = day < 10 ? `0${day}` : `${day}`;

    const formattedDate = `${month} ${paddedDay}, ${year}`;

    return formattedDate;
}
