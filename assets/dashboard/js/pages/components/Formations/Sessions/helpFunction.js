const Helper = require('@commonComponents/functions/helper');

function formatTimeZero(temps){
    return (temps < 10) ? "0" + temps : temps
}

function setToStringDatabase(hours, minutes)
{
    return (hours !== 0 ? (hours + "h") : "") + (minutes !== 0 ? (formatTimeZero(minutes) + "min") : "");
}

function setToString(hours, minutes)
{
    return (hours !== 0 ? (hours + "h ") : "") + (minutes !== 0 ? (minutes + "min") : "");
}

function getIntervalTime(end, start)
{
    let nInterval = ""
    if((end !== null && end !== "") && (start !== null && start !== "")){
        let timeStartHours = parseInt(start.getHours());
        let timeStartMinutes = parseInt(start.getMinutes());

        let timeEndHours = parseInt(end.getHours());
        let timeEndMinutes = parseInt(end.getMinutes());

        if(timeEndHours > timeStartHours && timeEndMinutes === 0){
            timeEndHours = timeEndHours - 1;
            timeEndMinutes = 60;
        }

        let intervalHours = timeEndHours - timeStartHours;
        let intervalMinutes = timeEndMinutes - timeStartMinutes;

        if(intervalMinutes === 60){
            intervalHours = intervalHours + 1;
            intervalMinutes = 0;
        }

        nInterval = setToString(intervalHours, intervalMinutes);
    }

    return nInterval;
}

function getHoursMinutesFromDatabase(duration)
{
    let timeDurationHours = 0;
    let timeDurationMinutes = 0;

    if(duration){
        let timeDuration = duration.split("h");

        if(timeDuration.length >= 2){
            timeDurationHours = timeDuration[0];
            timeDurationMinutes = timeDuration[1] !== "" ? timeDuration[1] : 0;
        }else{
            if(duration.indexOf("h") !== -1){
                timeDurationHours = timeDuration[0];
            }else if(duration.indexOf("min") !== -1){
                timeDurationMinutes = timeDuration[0];
            }
        }
    }

    return [parseInt(timeDurationHours !== "" ? timeDurationHours : 0), parseInt(timeDurationMinutes !== "" ? timeDurationMinutes : 0)];
}

function getHoursMinutes(duration)
{
    let timeDurationHours = 0;
    let timeDurationMinutes = 0;

    if(duration){
        let nDuration = duration.replaceAll("h", "") ;
        nDuration = nDuration.replaceAll("min", "") ;

        let timeDuration = nDuration.split(" ");

        if(timeDuration.length >= 2){
            timeDurationHours = timeDuration[0];
            timeDurationMinutes = timeDuration[1];
        }else{
            if(duration.indexOf("h") !== -1){
                timeDurationHours = timeDuration[0];
            }else if(duration.indexOf("min") !== -1){
                timeDurationMinutes = timeDuration[0];
            }
        }
    }

    return [parseInt(timeDurationHours !== "" ? timeDurationHours : 0), parseInt(timeDurationMinutes !== "" ? timeDurationMinutes : 0)];
}

function getDurationByDay(duration, duration2)
{
    let nDuration = getHoursMinutes(duration);
    let nDuration2 = getHoursMinutes(duration2);

    return setToString(nDuration[0] + nDuration2[0], nDuration[1] + nDuration2[1]);
}

function getDurationTotal(duration, duration2, start, end)
{
    if(start !== null && start !== "" && end !== null && end !== ""){
        let nDuration = getHoursMinutes(duration);
        let nDuration2 = getHoursMinutes(duration2);

        let nbHours = nDuration[0] + nDuration2[0];
        let nbMinutes = nDuration[1] + nDuration2[1];

        let startArray = Helper.extractDateToArray(start);
        let endArray = Helper.extractDateToArray(end);

        let nbDays = Helper.getNbDayBetweenDateArray(startArray, endArray)

        let total = (nbHours * 60 + nbMinutes) * nbDays;

        let hours = Math.floor(total / 60);
        let minutes = total % 60;

        return setToString(hours, minutes);
    }

    return "";
}

function setTimeToString(start, end)
{
    let a = setToStringDatabase(start.getHours(), start.getMinutes());
    let b = end !== "" ? setToStringDatabase(end.getHours(), end.getMinutes()) : null;

    return a + (b ? " - " + b : "");
}

function getTimeFromDatabase(time)
{
    time.replaceAll(" ", "");
    time = time.split('-');

    let a = getHoursMinutesFromDatabase(time[0].trim());
    let b = getHoursMinutesFromDatabase(time[1].trim());

    let timeA = new Date();
    timeA.setHours(a[0]); timeA.setMinutes(a[1]);

    let timeB = new Date();
    timeB.setHours(b[0]); timeB.setMinutes(b[1]);

    return [timeA, timeB];
}

module.exports = {
    getIntervalTime,
    getDurationTotal,
    getDurationByDay,
    setTimeToString,
    getHoursMinutes,
    getTimeFromDatabase
}
