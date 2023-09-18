export const getTodayDate = () => {
    var today = new Date()
    return today.setHours(today.getHours() - 5);    
}