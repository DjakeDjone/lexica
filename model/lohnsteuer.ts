

export interface LstDataIn {
    brutto: number;

    ueberstunden?: number;
    ueberstundenZuschlag?: number;
    ueberstundenTeiler?: number;

    fabo: boolean;
    fabo_voll: boolean;
    avabae: boolean;
    minderj_kinder: number;
    vollj_kinder: number;

    freibetrag?: number;
    pendlerpauschale?: number;
    pendlerpauschaleAbzug?: number;
    pendlereuro_km?: number;

    gewerkschaftsbeitrag?: number;
    betriebsratumlage?: number;
    serviceentgelt?: number;
    akontozahlung?: number;
}

export enum LstDataOutKeys {
    BRUTTO = 'Brutto',
    SOZIALVERSICHERUNG = 'Sozialversicherung',
    UEBERSTUNDEN = 'Überstunden',
    UEBERSTUNDEN_ZUSCHLAG = 'Überstunden Zuschlag',
    UEBERSTUNDEN_TEILER = 'Überstunden Teiler',
    FABO = 'FABO',
    FABO_VOLL = 'FABO Voll',
    AVABAE = 'AVABAE',
    MINDERJ_KINDER = 'Minderjährige Kinder',
    VOLLJ_KINDER = 'Volljährige Kinder',
    FREIBETRAG = 'Freibetrag',
    PENDLERPAUSCHALE = 'Pendlerpauschale',
    PENDLERPAUSCHALE_ABZUG = 'Pendlerpauschale Abzug',
    PENDLEREURO_KM = 'Pendlereuro km',
    GEWERKSCHAFTSBEITRAG = 'Gewerkschaftsbeitrag',
    BETRIEBSRATUMLAGE = 'Betriebsratumlage',
    SERVICEENTGELT = 'Serviceentgelt',
    AKONTOZAHLUNG = 'Akontozahlung',
    AUSZAHLUNG = 'Auszahlung/Überweisung',
    LOHNSTEUER = 'Lohnsteuer',
}

export interface LstDataOutRow {
    name: LstDataOutKeys;
    value1?: number;
    value2?: number;
}

export type LstDataOut = LstDataOutRow[];


export const calcLohnabrechnung = (data: LstDataIn): LstDataOut => {
    if (data.vollj_kinder > 5) {
        data.vollj_kinder = 5;
    } else if (data.vollj_kinder < 0) {
        data.vollj_kinder = 0;
    }
    if (data.minderj_kinder > 5) {
        data.minderj_kinder = 5;
    } else if (data.minderj_kinder < 0) {
        data.minderj_kinder = 0;
    }
    const out = [] as LstDataOut;

    let auszahlung = data.brutto;

    out.push({ name: LstDataOutKeys.BRUTTO, value2: data.brutto })
    let ueberstunden_steuerfrei = 0;
    // Überstunden
    if (data.ueberstunden && data.ueberstundenZuschlag && data.ueberstundenTeiler) {
        
    }
    // Sozialversicherung lfd
    const sv = svbetrag(data.brutto);
    out.push({ name: LstDataOutKeys.SOZIALVERSICHERUNG, value2: sv });
    auszahlung -= sv;
    // Lohnsteuer lfd
    let bemessungsgrundlage = data.brutto - sv - ueberstunden_steuerfrei;
    if (data.freibetrag) {
        bemessungsgrundlage -= data.freibetrag;
    }
    if (data.pendlerpauschale) {
        if (data.pendlerpauschaleAbzug) {
            bemessungsgrundlage -= (data.pendlerpauschale - data.pendlerpauschaleAbzug);
        } else {
            bemessungsgrundlage -= data.pendlerpauschale;
        }       
    }
    if (data.serviceentgelt) {
        bemessungsgrundlage -= data.serviceentgelt;
    }
    if (data.gewerkschaftsbeitrag) {
        bemessungsgrundlage -= data.gewerkschaftsbeitrag;
    }
    bemessungsgrundlage = round(bemessungsgrundlage);
    let lohnsteuer = bemessungsgrundlage * calcLohnsteuerClass(bemessungsgrundlage);    
    if (data.avabae) {
        lohnsteuer -= round(calcLstAbzug(bemessungsgrundlage, data.minderj_kinder + data.vollj_kinder, data.avabae));
    }
    // FABO
    if (data.fabo) {
        lohnsteuer += round(faboPlus(data.fabo_voll, data.minderj_kinder, data.vollj_kinder));
    }
    // Pendlereuro
    if (data.pendlereuro_km) {
        lohnsteuer -= round(data.pendlereuro_km/6);
    }
    out.push({ name: LstDataOutKeys.LOHNSTEUER, value2: lohnsteuer });
    auszahlung -= lohnsteuer;
    // Akontozahlung
    if (data.akontozahlung) {
        out.push({ name: LstDataOutKeys.AKONTOZAHLUNG, value2: data.akontozahlung });
        auszahlung -= data.akontozahlung;
    }
    auszahlung = round(auszahlung);
    out.push({ name: LstDataOutKeys.AUSZAHLUNG, value2: auszahlung });
    return out;
};

const round = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
}

export const svbetrag = (brutto: number) => {
    let faktor = 0;
    if (brutto <= 1951) {
        faktor = 0.1512;
    } else if (brutto <= 2128) {
        faktor = 0.1612;
    } else if (brutto <= 2306) {
        faktor = 0.1712;
    } else {
        faktor = 0.1807;
    }
    return round(brutto * faktor);
}

export const faboPlus = (voll: boolean, minderj_kinder: number, vollj_kinder: number) => {
    const fabo = 166.68*vollj_kinder + 58.34*minderj_kinder;
    return round(voll ? fabo : fabo/2);
};

// € 1.079,00 	0 %
// € 1.745, 83 	20 %
// € 2.887,08 	30 %
// € 5.562,00 	40 %
// € 8.283, 17 	48 %
// € 83.344, 33 	50 %
//     darüber 	55 %

export const calcLohnsteuerClass = (bemessungsgrundlage: number) => {
    if (bemessungsgrundlage <= 1079) {
        return 0;
    } else if (bemessungsgrundlage <= 1745.83) {
        return 0.2;
    } else if (bemessungsgrundlage <= 2887.08) {
        return 0.3;
    } else if (bemessungsgrundlage <= 5562) {
        return 0.4;
    } else if (bemessungsgrundlage <= 8283.17) {
        return 0.48;
    } else if (bemessungsgrundlage <= 83344.33) {
        return 0.5;
    } else {
        return 0.55;
    }
}

export const calcLstAbzug = (bemessungsgrundlage: number, kinder: number, avabae: boolean) => {
    if (!avabae) {
        if (bemessungsgrundlage <= 1079) {
            return 0;
        } else if (bemessungsgrundlage <= 1745.83) {
            return 254.38;
        } else if (bemessungsgrundlage <= 2887.08) {
            return 428.96;
        } else if (bemessungsgrundlage <= 5562) {
            return 717.67;
        } else if (bemessungsgrundlage <= 8283.17) {
            return 1162.63;
        } else if (bemessungsgrundlage <= 83344.33) {
            return 1328.30;
        } else {
            return 5495.51;
        }
    } else {
        if (bemessungsgrundlage <= 1079) {
            return 0;
        } else if (bemessungsgrundlage <= 1745.83) {
            if (kinder === 1) {
                return 302.05;
            } else if (kinder === 2) {
                return 318.88;
            } else if (kinder === 3) {
                return 340.13;
            } else if (kinder === 4) {
                return 361.38;
            }  else if (kinder === 5) {
                return 382.63;
            }
        } else if (bemessungsgrundlage <= 2887.08) {
            if (kinder === 1) {
                return 476.63;
            } else if (kinder === 2) {
                return 493.46;
            } else if (kinder === 3) {
                return 514.71;
            } else if (kinder === 4) {
                return 535.96;
            }  else if (kinder === 5) {
                return 557.21;
            }
        } else if (bemessungsgrundlage <= 5562) {
            if (kinder === 1) {
                return 765.34;
            } else if (kinder === 2) {
                return 782.17;
            } else if (kinder === 3) {
                return 803.42;
            } else if (kinder === 4) {
                return 824.67;
            }  else if (kinder === 5) {
                return 845.92;
            }
        } else if (bemessungsgrundlage <= 8283.17) {
            if (kinder === 1) {
                return 1210.30;
            } else if (kinder === 2) {
                return 1227.13;
            } else if (kinder === 3) {
                return 1248.38;
            } else if (kinder === 4) {
                return 1269.63;
            }  else if (kinder === 5) {
                return 1290.88;
            }
        } else if (bemessungsgrundlage <= 83344.33) {
            if (kinder === 1) {
                return 1375.97;
            } else if (kinder === 2) {
                return 1392.80;
            } else if (kinder === 3) {
                return 1414.05;
            } else if (kinder === 4) {
                return 1435.30;
            }  else if (kinder === 5) {
                return 1456.55;
            }
        } else {
            if (kinder === 1) {
                return 5543.18;
            } else if (kinder === 2) {
                return 5560.01;
            } else if (kinder === 3) {
                return 5581.26;
            } else if (kinder === 4) {
                return 5602.51;
            }  else if (kinder === 5) {
                return 5623.76;
            }
        }
        return 0;
    }
};