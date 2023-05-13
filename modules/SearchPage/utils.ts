
export const getTimePlay = (time: string) => {
    let totalSeconds = Number(time);
    let hours = Math.floor(totalSeconds / 3600) + "";
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60) + "";
    let seconds = totalSeconds % 60 + "";
    if (hours != "0") {
        return (hours.length == 1 ? "0" + hours: hours)  + ':' + (minutes.length == 1 ? "0" + minutes: minutes) + ':' + (seconds.length == 1 ? "0" + seconds: seconds);
    } else {
        if (minutes) {
            return (minutes.length == 1 ? "0" + minutes: minutes) + ':' + (seconds.length == 1 ? "0" + seconds: seconds);
        } else {
            return (seconds.length == 1 ? "0" + seconds: seconds)
        }
    }
};

