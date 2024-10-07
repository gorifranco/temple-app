export function formatHora(hora: String) {
    const horaSplit = hora.split(/[ZT+]/)
    return `${horaSplit[0]} ${horaSplit[1].substring(0,5)}`
}