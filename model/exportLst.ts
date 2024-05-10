import type { LstDataIn, LstDataOut } from "./lohnsteuer"

export const genTextFromJSON = (data:LstDataIn) => {
    let text = `Max Muster (Schulungsleiter); Gehalt ${data.brutto}`
    if (data.ueberstunden50) {
        text += `; ${data.ueberstunden50} Überstunden mit 50% ÜZ`
    }
    if (data.ueberstunden100) {
        text += ` und ${data.ueberstunden100} Überstunden mit 100% steuerfreiem ÜZ`
    }
    if (data.ueberstundenTeiler) {
        text += `, Überstundenteiler ${data.ueberstundenTeiler}`
    }
    if (data.fabo) {
        text += `, mit FABO Plus`
    }
    if (data.fabo_voll) {
        text += ` (voller Bonus)`
    }
    if (data.avabae) {
        text += ` und mit AVAB`
    }
    if (data.minderj_kinder) {
        text += `, ${data.minderj_kinder} minderjährige Kinder`
    }
    if (data.vollj_kinder) {
        text += ` und ${data.vollj_kinder} volljährige Kinder`
    }
    if (data.freibetrag) {
        text += `, Freibetrag € ${data.freibetrag}/Monat`
    }
    if (data.pendlerpauschale) {
        text += `, Pendlerpauschale ${data.pendlerpauschale}/Monat`
    }
    if (data.pendlereuro_km) {
        text += `, Pendlereuro für ${data.pendlereuro_km}km (einfache Fahrstrecke)`
    }
    if (data.pendlerpauschaleKostenUebername) {
        text += `, Kostenübernahme KlimaTicket Ö € ${data.pendlerpauschaleKostenUebername}/Jahr durch Arbeitgeber`
    }
    if (data.gewerkschaftsbeitrag) {
        text += `, Gewerkschaftsbeitrag € ${data.gewerkschaftsbeitrag}`
    }
    if (data.serviceentgelt) {
        text += `, Service-Entgelt (E-Card-Gebühr) € ${data.serviceentgelt}`
    }
    if (data.betriebsratsumlage) {
        text += `, Betriebsratsumlage € ${data.betriebsratsumlage}`
    }
    if (data.akontozahlung) {
        text += `, Akontozahlung ${data.akontozahlung}`
    }
    text += `; Abrechnung für Juni`
    return text;
}