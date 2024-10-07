export function formatHora(hora: String) {
    const horaSplit = hora.split(/[ZT+]/)
    return `${horaSplit[0]} ${horaSplit[1].substring(0,5)}`
}

export function stringDiaToDate(hora: string) {
    const horaSplit = hora.split(/[ZT+]/);
    let time = new Date();

    if (horaSplit.length >= 2) {
        time.setFullYear(Number(horaSplit[0].substring(0, 4)));
        time.setMonth(Number(horaSplit[0].substring(5, 7)) - 1);
        
        const hoursAndMinutes = horaSplit[1].split(':');
        if (hoursAndMinutes.length >= 2) {
            time.setHours(Number(hoursAndMinutes[0]));
            time.setMinutes(Number(hoursAndMinutes[1]));
        }
    }

    return time;
}