export function getFormatDate(time: string) {
    const date = new Date(time)
    const pad = (num: number) => String(num).padStart(2, '0')
    const formatTime = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    return formatTime
}