export const getTodayDate = () => {
    var today = new Date()
    return today.setHours(today.getHours() - 5);    
}
export const getTodayDateFormat = (today: string) => {
    let now = new Date(today)
    return new Date(now.setHours(now.getHours() + +(process.env.MODIFY_TIMEZONE || "0")));    
}