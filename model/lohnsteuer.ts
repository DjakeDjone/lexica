import { calcLohnsteuerClass, lstData, type LstClass } from "./lstdata";

export interface LstDataIn {
  brutto: number;

  ueberstunden50?: number;
  ueberstunden100?: number;
  ueberstundenTeiler?: number;

  fabo: boolean;
  fabo_voll: boolean;
  avabae: boolean;
  minderj_kinder: number;
  vollj_kinder: number;

  freibetrag?: number;
  pendlerpauschale?: number;
  pendlerpauschaleKostenUebername?: number;
  pendlereuro_km?: number;

  gewerkschaftsbeitrag?: number;
  betriebsratsumlage?: number;
  serviceentgelt?: number;
  akontozahlung?: number;
}

export enum LstDataOutKeys {
  BRUTTO = "Brutto",
  GESAMT = "Gesamtbrutto",
  SOZIALVERSICHERUNG = "Sozialversicherung",
  UE_GRUNDLOHN = "ÜG",
  UEBERSTUNDEN_ZUSCHLAG = "Überstunden Zuschlag",
  UEBERSTUNDEN_TEILER = "Überstunden Teiler",
  UEZ_FREI = "ÜZ steuerfrei",
  UEZ_PFLICHTIG = "ÜZ steuerpflichtig",
  UEZ_MAX = "jedoch höchstens",
  FABO = "FABO",
  FABO_VOLL = "FABO Voll",
  AVABAE = "AVABAE",
  MINDERJ_KINDER = "Minderjährige Kinder",
  VOLLJ_KINDER = "Volljährige Kinder",
  FREIBETRAG = "Freibetrag",
  PENDLERPAUSCHALE = "Pendlerpauschale",
  PENDLERPAUSCHALE_ABZUG = "Pendlerpauschale Abzug",
  PENDLEREURO_KM = "Pendlereuro km",
  PENDLEREURO = "Pendlereuro",
  GEWERKSCHAFTSBEITRAG = "Gewerkschaftsbeitrag",
  BETRIEBSRATUMLAGE = "Betriebsratumlage",
  SERVICEENTGELT = "Serviceentgelt",
  BEMESS_GRUNDLAGE = "Bemessungsgrundlage",
  AKONTOZAHLUNG = "Akontozahlung",
  AUSZAHLUNG = "Auszahlung/Überweisung",
  LOHNSTEUER = "Lohnsteuer",
  ABZUG = "Abzug",
}

export type LstDataOutRow = {
  name: LstDataOutKeys;
  lineAbove?: boolean;
  subtract?: boolean;
  nameCalc?: string;
  value1?: number;
  value2?: number;
};

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



  out.push({ name: LstDataOutKeys.BRUTTO, value2: data.brutto });
  let ueberstunden_steuerfrei = 0;
  let brutto = data.brutto;
  // Überstunden
  if (
    (data.ueberstunden50 || data.ueberstunden100) &&
    data.ueberstundenTeiler
  ) {
    const grundlohn = round(data.brutto / data.ueberstundenTeiler);
    const ue50 = data.ueberstunden50 || 0;
    const ue100 = data.ueberstunden100 || 0;

    const ueg = round((ue50 + ue100) * grundlohn);
    out.push({
      name: LstDataOutKeys.UE_GRUNDLOHN,
      nameCalc: `${LstDataOutKeys.UE_GRUNDLOHN}: ${brutto} / ${data.ueberstundenTeiler} = ${grundlohn} • ${
        ue50 + ue100
      }`,
      value2: ueg,
    });

    const halblohn = round(grundlohn / 2);
    let remaining = 0;
    const ue50frei = Math.min(ue50, 18);
    const ue50pflichtig = ue50 - ue50frei;
    const uez50frei = round(halblohn * ue50frei);

    if (ue100) {
      if (ue50) {
        out.push({
          name: LstDataOutKeys.UEZ_FREI,
          nameCalc: `${LstDataOutKeys.UEZ_FREI}: ${halblohn} • ${ue50frei} = ${uez50frei}`,
        });
        if (uez50frei > 200) {
          out.push({ name: LstDataOutKeys.UEZ_MAX, value1: 200 });
          ueberstunden_steuerfrei = 200;
          remaining = uez50frei - 200;
        } else {
          ueberstunden_steuerfrei = uez50frei;
        }
        const ue100frei = round(grundlohn * ue100);
        out.push({
          name: LstDataOutKeys.UEZ_FREI,
          nameCalc: `${grundlohn} • ${ue100}`,
          value1: ue100frei,
          value2: round(ue100frei + ueberstunden_steuerfrei)
        });
        ueberstunden_steuerfrei += ue100frei;
      } else {
        out.push({
          name: LstDataOutKeys.UEZ_FREI,
          nameCalc: `${LstDataOutKeys.UEZ_FREI}: ${grundlohn} • ${ue100} = ${ueberstunden_steuerfrei}`,
          value2: uez50frei,
        });
        ueberstunden_steuerfrei += round(grundlohn * ue100);
      }
    } else {
      if (uez50frei > 200) {
        out.push({
          name: LstDataOutKeys.UEZ_FREI,
          nameCalc: `${LstDataOutKeys.UEZ_FREI}: ${halblohn} • ${ue50} = ${uez50frei}, höchstens bis`,
          value2: 200,
        });
        ueberstunden_steuerfrei = 200;
        remaining = round(uez50frei - 200);
      } else {
        out.push({
          name: LstDataOutKeys.UEZ_FREI,
          nameCalc: `${LstDataOutKeys.UEZ_FREI}: ${halblohn} • ${ue50} = ${uez50frei}`,
          value2: uez50frei,
        });
        ueberstunden_steuerfrei = uez50frei;
      }
    }

    const pflichtig_contrib = [];
    let uePflichtig = 0;
    if (ue50pflichtig) {
      uePflichtig = round(halblohn * ue50pflichtig);
      pflichtig_contrib.push(`${halblohn} • ${ue50pflichtig} = ${uePflichtig}`);
    }

    if (remaining) {
      pflichtig_contrib.push(remaining.toFixed(2));
      uePflichtig += remaining;
    }

    out.push({
      name: LstDataOutKeys.UEZ_PFLICHTIG,
      nameCalc:
        LstDataOutKeys.UEZ_PFLICHTIG + ": " + pflichtig_contrib.join(" + "),
      value2: uePflichtig,
    });

    brutto += ueg + uePflichtig + ueberstunden_steuerfrei;

    out.push({name: LstDataOutKeys.GESAMT, value2: brutto, lineAbove: true});
  }

    let auszahlung = brutto;
  // Sozialversicherung lfd
  const sv = svbetrag(brutto);
  out.push({
    name: LstDataOutKeys.SOZIALVERSICHERUNG,
    value2: sv,
    subtract: true,
  });
  auszahlung -= sv;
  // Lohnsteuer lfd
  out.push({ name: LstDataOutKeys.LOHNSTEUER });
  let bemessungsgrundlage = brutto - sv - ueberstunden_steuerfrei;
  out.push({ name: LstDataOutKeys.BRUTTO, value1: brutto });
  if (ueberstunden_steuerfrei) {
    out.push({
      name: LstDataOutKeys.UEZ_FREI,
      value1: ueberstunden_steuerfrei,
      subtract: true,
    });
  }
  out.push({
    name: LstDataOutKeys.SOZIALVERSICHERUNG,
    value1: sv,
    subtract: true,
  });

  if (data.freibetrag) {
    bemessungsgrundlage -= data.freibetrag;
    out.push({
      name: LstDataOutKeys.FREIBETRAG,
      value1: data.freibetrag,
      subtract: true,
    });
  }

  if (data.pendlerpauschale) {
    let pp = data.pendlerpauschale;
    if (data.pendlerpauschaleKostenUebername) {
      pp = round(pp - data.pendlerpauschaleKostenUebername / 12);
    }
    bemessungsgrundlage -= pp;
    out.push({
      name: LstDataOutKeys.PENDLERPAUSCHALE,
      value1: pp,
      subtract: true,
    });
  }

  if (data.serviceentgelt) {
    bemessungsgrundlage -= data.serviceentgelt;
    out.push({
      name: LstDataOutKeys.SERVICEENTGELT,
      value1: data.serviceentgelt,
      subtract: true,
    });
  }

  if (data.gewerkschaftsbeitrag) {
    bemessungsgrundlage -= data.gewerkschaftsbeitrag;
    out.push({
      name: LstDataOutKeys.GEWERKSCHAFTSBEITRAG,
      value1: data.gewerkschaftsbeitrag,
      subtract: true,
    });
  }

  bemessungsgrundlage = round(bemessungsgrundlage);
  out.push({
    name: LstDataOutKeys.BEMESS_GRUNDLAGE,
    value1: bemessungsgrundlage,
    lineAbove: true,
  });

  const lstClass = calcLohnsteuerClass(bemessungsgrundlage);
  const steuersatz = lstData[lstClass].steuersatz;
  let lohnsteuer = round(bemessungsgrundlage * steuersatz);
  out.push({
    name: LstDataOutKeys.LOHNSTEUER,
    nameCalc: `• ${(steuersatz * 100).toFixed(0)}%`,
    value1: lohnsteuer,
    lineAbove: true,
  });

  // FABO
  if (data.fabo) {
    const fabo = round(
      faboPlus(data.fabo_voll, data.minderj_kinder, data.vollj_kinder)
    );
    lohnsteuer -= fabo;
    out.push({ name: LstDataOutKeys.FABO, value1: fabo, subtract: true });
  }

  const abzug = calcLstAbzug(
    lstClass,
    data.minderj_kinder + data.vollj_kinder,
    data.avabae
  );
  lohnsteuer -= abzug;
  out.push({ name: LstDataOutKeys.ABZUG, value1: abzug, subtract: true });

  // Pendlereuro
  if (data.pendlereuro_km) {
    const pendlereuro = round(data.pendlereuro_km / 6);
    lohnsteuer -= pendlereuro;
    out.push({
      name: LstDataOutKeys.PENDLEREURO,
      value1: pendlereuro,
      subtract: true,
    });
  }

  lohnsteuer = Math.max(round(lohnsteuer), 0);
  auszahlung -= lohnsteuer;
  out.push({
    name: LstDataOutKeys.LOHNSTEUER,
    value2: lohnsteuer,
    lineAbove: true,
    subtract: true,
  });

  // Gewerkschaftsbeitrag
  if (data.gewerkschaftsbeitrag) {
    out.push({
      name: LstDataOutKeys.GEWERKSCHAFTSBEITRAG,
      value2: data.gewerkschaftsbeitrag,
      subtract: true,
    });
    auszahlung -= data.gewerkschaftsbeitrag;
  }

  // Serviceentgelt
  if (data.serviceentgelt) {
    out.push({
      name: LstDataOutKeys.SERVICEENTGELT,
      value2: data.serviceentgelt,
      subtract: true,
    });
    auszahlung -= data.serviceentgelt;
  }

  // Betriebsratumlage
  if (data.betriebsratsumlage) {
    out.push({
      name: LstDataOutKeys.BETRIEBSRATUMLAGE,
      value2: data.betriebsratsumlage,
      subtract: true,
    });
    auszahlung -= data.betriebsratsumlage;
  }

  // Akontozahlung
  if (data.akontozahlung) {
    out.push({
      name: LstDataOutKeys.AKONTOZAHLUNG,
      value2: data.akontozahlung,
      subtract: true,
    });
    auszahlung -= data.akontozahlung;
  }
  auszahlung = round(auszahlung);
  out.push({
    name: LstDataOutKeys.AUSZAHLUNG,
    value2: auszahlung,
    lineAbove: true,
  });
  return out;
};

const round = (value: number, digits: number = 2): number => {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
};

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
  return round(Math.min(brutto, 6060) * faktor);
};

export const faboPlus = (
  voll: boolean,
  minderj_kinder: number,
  vollj_kinder: number
) => {
  const fabo = 166.68 * minderj_kinder + 58.34 * vollj_kinder;
  return round(voll ? fabo : fabo / 2);
};

export const calcLstAbzug = (
  klasse: LstClass,
  kinder: number,
  avabae: boolean
) => {
  const data = lstData[klasse];
  if (!avabae) {
    return round(data.abzug + data.vab);
  }
  let abzug = data.abzug + data.vab;
  if (kinder === 1) {
    abzug += data.kind_1;
  } else if (kinder === 2) {
    abzug += data.kind_2;
  } else if (kinder >= 3) {
    abzug += data.kind_3;
    abzug += (kinder - 3) * 21.25;
  }
  return round(abzug);
};
