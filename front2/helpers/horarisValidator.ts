export function validarHoraris(horaris: Map<number, { desde: string | null; fins: string | null }[]>) {
    let errors = new Map<number, { errDesde: string | null; errFins: string | null }[]>();
    let status = false;

    for (let diaSetmana = 0; diaSetmana < 7; diaSetmana++) {
        const horariDia = horaris.get(diaSetmana);

        if (horariDia) {
            for (let i = 0; i < horariDia.length; i++) {
                const { desde, fins } = horariDia[i];
                let errDesde: string | null = null;
                let errFins: string | null = null;
                if (desde == null) {
                    errDesde = "Desde no pot ser buit"
                    status = true
                }
                if (fins == null) {
                    errFins = "Fins no pot ser buit"
                    status = true
                }
                if (desde && fins) {
                    if (desde >= fins) {
                        status = true
                        errDesde = "Desde no pot ser major que Fins"
                        errFins = "Fins no pot ser major que Desde"
                    }
                }
                if (errDesde || errFins) {
                    if (!errors.has(diaSetmana)) {
                        errors.set(diaSetmana, []);
                    }
                    errors.get(diaSetmana)!.push({ errDesde: errDesde, errFins: errFins });
                }
                errors.get(diaSetmana)!.push({ errDesde: errDesde, errFins: errFins });
            }
        }
    }
    return { status: status, errors: errors };
}
