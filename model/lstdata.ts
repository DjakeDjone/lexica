export enum LstClass {
  KLASSE_0 = "Klasse 0",
  KLASSE_1 = "Klasse 1",
  KLASSE_2 = "Klasse 2",
  KLASSE_3 = "Klasse 3",
  KLASSE_4 = "Klasse 4",
  KLASSE_5 = "Klasse 5",
  KLASSE_6 = "Klasse 6",
}

export function calcLohnsteuerClass(bemessungsgrundlage: number): LstClass {
  for (const lstClass of Object.entries(lstData).toReversed()) {
    const [key, value] = lstClass;
    if (bemessungsgrundlage >= value.grenzeAb) {
      return key as LstClass;
    }
  }
  return LstClass.KLASSE_0;
}

type LstClassData = {
  grenzeAb: number;
  steuersatz: number;
  abzug: number;
  vab: number;
  kind_1: number;
  kind_2: number;
  kind_3: number;
};

export const lstData: Record<LstClass, LstClassData> = {
  "Klasse 0": {
    grenzeAb: 0,
    steuersatz: 0,
    abzug: 0,
    vab: 0,
    kind_1: 0,
    kind_2: 0,
    kind_3: 0,
  },
  "Klasse 1": {
    grenzeAb: 1079.01,
    steuersatz: 0.2,
    abzug: 215.8,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
  "Klasse 2": {
    grenzeAb: 1745.84,
    steuersatz: 0.3,
    abzug: 390.38,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
  "Klasse 3": {
    grenzeAb: 2887.09,
    steuersatz: 0.4,
    abzug: 679.09,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
  "Klasse 4": {
    grenzeAb: 5562.01,
    steuersatz: 0.48,
    abzug: 1124.05,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
  "Klasse 5": {
    grenzeAb: 8283.18,
    steuersatz: 0.5,
    abzug: 1289.72,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
  "Klasse 6": {
    grenzeAb: 83344.34,
    steuersatz: 0.55,
    abzug: 5456.93,
    vab: 38.58,
    kind_1: 47.67,
    kind_2: 64.5,
    kind_3: 85.75,
  },
};
