export var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DayMonthDateYear(datestr){
    const date = new Date(datestr)
    let str = daysOfWeek[date.getDay()] +", " +  monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
    return str
}

export function MonthDateYear(datestr){
    const date = new Date(datestr)
    let str = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
    return str
}