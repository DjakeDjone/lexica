# Krisenmanagement / Insolvenz

## Ursachen für Krisen

- **externe** Ursachen: schwache Konjunktur, starker Konkurenzdruck, steigende Rohstoffpreise, technischer Fortschritt, *gesättigter Markt*,...
- **interne** Ursachen: Finanzlücken, nachlässiges Forderungsmanagement, Führungsstil, Expansionsbestrebungen, Fehler im Marketing, *fehlendes Controlling*, ...

> Interne Gründe für Krisen sind **fast immer Managementfehler**.
> **Externe** Gründe sind **viel seltener** als interne Gründe für Krisen.

## Ablauf von Krisen

![Ablauf von Unternehmenskrisen](/images/ablauf_von_unternehmenskrisen.png)

- **Strategiekrise**:
    + strategische Fehleinschätzung
    + Verlust von Marktanteilen
- **Erfolgskrise**:
    + Umsatzrückgang
    + Etragsrückgang
    + Überkapazitäten
- **Liquiditätskrise**:
    + Liquiditätsprobleme
    + Überschuldung
    + Insolvenz

## Controlling zum Erkennen von Krisen

![Controlling Strategien](/images/controlling_zum_erkennen_von_krisen.png)

### Controllinginstrumente

- **Strategiekrise**: Portfolio-Analyse, SWOT-Analyse, Branchenvergleich, Stärken-Schwächen-Analyse, ...
- **Erfolgskrise**: Gewinn/Verlustrechnung, Bilanz, Kennzahlenanalyse, ...
- **Liquiditätskrise**: kurzfristige Finanzpläne, kurzfristige Leistungsbudgets

## Sanierung und Auflösung von Unternehmen

### Insolvenz von Unternehmen

![Auslöser einer Unternehmensinsolvenz](/images/auslöser_einer_unternehmensinsolvenz.png)

#### Auslöser einer Unternehmensinsolvenz

- **Zahlungsunfähigkeit**: erhaltene Rechnungen, Löhne, Steuern u. Abgaben können nicht mehr bezahlt werden
- **Überschuldung** und **negative Fortbestandsprognose**: Überschuldung: Vermögen < Schulden; Wenn Überschuldung **und** negative Fortbestandsprognose vorliegen, ist das Unternehmen **insolvent**

### Einzelunternehmen u. Personengesellschaften

sind bei Zahlungsunfähigkeit insolvent

### Kapitalgesellschaften

**strengere Regelungen:** nicht nur bei Zahlungsunfähigkeit sondern auch bei Überschuldung + negative Fortbestandsprognose

> Eine **negative Fortbestandsprognose** ~ drohnende Zahlungsunfähigkeit in der Zukunft

> Liegt ein **Insolvenzgrund** vor, sind Einzelungernehmer bzw bei Gesellschaften Mitglieder von Organen **gesetzlich verpflichtet**, bei Gericht einen **Antrag auf Eröffnung eines Insolvenzverfahrens** zu stellen!

## Insolvenzverfahren

![Insolvenzverfahren](/images/insolvenzverfahren.png)

```mermaid
graph TD
    %% Initial Triggers
    Start1["Zahlungsunfähigkeit"] --> UI["Unternehmensinsolvenz"]
    Start2["Überschuldung und negative Fortbestandsprognose"] --> UI

    %% Main Branches
    UI --> AM["außergerichtliche Maßnahmen"]
    UI --> GI["gerichtliche Insolvenzverfahren"]

    %% Out-of-court measures
    AM --> MORA["Moratorium (Zahlungsaufschub)"]
    AM --> AA["außergerichtlicher Ausgleich"]

    %% Court procedures
    GI --> SPG["Sanierungsplan genehmigt"]
    GI --> SPNG["Sanierungsplan nicht genehmigt"]

    %% Reorganization process
    SPG --> SV["Sanierungsverfahren"]
    SV --> EV["in Eigenverwaltung"]
    SV --> FV["in Fremdverwaltung"]

    %% Outcomes of reorganization
    EV --> SE["Sanierung ist erfolgreich"]
    FV --> SE
    EV --> SS["Sanierung scheitert"]
    FV --> SS

    %% Final results
    SE --> RB["Restschuldbefreiung"]
    RB --> RB_TEXT["Unternehmen wird fortgeführt / Schulden erlassen"]

    SS --> KV["Konkursverfahren"]
    SPNG --> KV
    KV --> KV_TEXT["Verkauf, Zerschlagung oder Schließung"]

    %% Styling
    style UI fill:#0099da,color:white
    style AM fill:#00a651,color:white
    style GI fill:#c2005d,color:white
    style SV fill:#8dbae5,color:black
    style RB fill:#005da8,color:white
    style KV fill:#d24121,color:white
```

### Sanierung

Sanierungsmaßnahmen haben das Ziel, die Existenz des Unternehmens zu retten. Das Mitwirken der Gläubiger ist in allen Fällen notwendig.

#### Moratorium ~ Zahlungsaufschub

Die Gläubiger gewähren dem Unternehmen einen **Zahlungsaufschub**, damit es Zeit hat, eine Sanierung durchzuführen.

#### Außergerichtlicher Ausgleich

Die Gläubiger **verzichten** auf einen Teil ihrer Forderungen, damit das Unternehmen überleben kann. Dazu müssen **alle** Gläubiger zustimmen.

#### Sanierungsverfahren in Eigenverwaltung

Das Unternehmen bleibt unter der Leitung der bisherigen Geschäftsführung, die von einem Sachwalter überwacht wird. Das Unternehmen muss einen Sanierungsplan vor Gericht vorlegen. Außerdem muss den Gläubigern eine **Rückzahlungsquote** von **mindestens 30%** angeboten werden, die innerhalb von **zwei Jahren** zurückgezahlt werden soll. Zustimmen muss eine **Mehrheit der Gläubiger**

#### Sanierungsverfahren in Fremdverwaltung

Das Gericht ernennt einen Insolvenzverwalter, der die Leitung des Unternehmens übernimmt. Das Unternehmen muss einen Sanierungsplan vor Gericht vorlegen. Außerdem muss den Gläubigern eine **Rückzahlungsquote** von **mindestens 20%** angeboten werden, die innerhalb von **zwei Jahren** zurückgezahlt werden soll. Zustimmen muss eine **Mehrheit der Gläubiger**

-> Ist das Sanierungsverfahren erfolgreich, erhält das Unternehmen eine **Restschuldbefreiung** und kann fortgeführt werden. Scheitert das Sanierungsverfahren, wird ein Konkursverfahren eingeleitet.

## Konkurs

![Konkursverfahren](/images/konkursverfahren.png)

```mermaid
graph TD
    %% Initial Application
    KA["Konkursantrag durch Gläubiger/in oder Schuldner/in"] --> PRU["Prüfung der Voraussetzungen zur Durchführung des Konkursverfahrens"]

    %% Rejection Path
    PRU --> ABG["Konkursantrag wird abgelehnt"]
    ABG --> AMM["Ablehnung mangels Masse\n(Abweisung des Konkursantrags mangels kostendeckenden Vermögens)"]
    AMM --> EGB["Entzug der Gewerbeberechtigung\n(gilt für 3 Jahre als Gewerbeausschließungsgrund)"]
    EGB --> KRB["keine Restschuldbefreiung\n(Haftung 30 Jahre)"]

    %% Acceptance Path
    PRU --> ANG["Konkursantrag wird angenommen"]
    ANG --> MVW["Masseverwalter\n(Bestellung eines Insolvenzverwalters, der den Betrieb führt)"]
    MVW --> ADF["Anmeldung der Forderungen\n(Gläubiger/innen werden aufgefordert, Forderungen anzumelden)"]
    ADF --> ESF["Entscheidung über Schließung bzw. Fortführung des Unternehmens"]

    %% Decision Branch
    ESF --> SWB["Schließung wird beschlossen"]
    ESF --> FWB["Fortführung wird beschlossen"]

    %% Liquidation Path
    SWB --> KVF["Konkursverfahren"]
    KVF --> VDU["Verwertung des Unternehmens"]
    VDU --> EDV["Erlöse der Verwertung werden auf die Gläubiger/innen verteilt\n(Konkursquote)"]
    EDV --> KRB

    %% Reorganization Path
    FWB --> SVF["Sanierungsverfahren in Fremdverwaltung\n(Quote: 20% in 2 Jahren, Gläubigermehrheit)"]
    SVF --> VERF["Verfahren erfolgreich:\nRestschuldbefreiung"]

    %% Styling
    style KA fill:#00b0f0,color:white
    style PRU fill:#99ccff,color:black
    style ABG border:1px solid #ed7d31
    style ANG border:1px solid #4472c4
    style AMM fill:#f8cbad,color:black
    style MVW fill:#b4c6e7,color:black
    style EGB fill:#f8cbad,color:black
    style ADF fill:#b4c6e7,color:black
    style ESF fill:#8e91c2,color:white
    style KVF fill:#c00000,color:white
    style KRB fill:#ed7d31,color:white
```

### Rangordung der Forderungen

Zuerst werden die Aussonderungsansprüche, dann die Absonderungsansprüche und zuletzt die Massenforderungen erfüllt.

1. **Aussonderungsansprüche**: Der Schuldener ist nicht Eigentümer dieser Vermögenswerte. z.B. Reperaturübernahmen, leihweise überlassene Sachen, Kommissionsware
2. **Absonderungsansprüche**: besonders berechtigte Forderungen. z.B. gesetzliches Pfandrecht für Spediteure u. Frachtführer, Hypotheken
3. **Massenforderungen**: diese Forderungen entstehen nach der Eröffnung des Insolvenzverfahrens. z.B. Kosten des Insolvenzverfahrens, Gehälter für die Zeit der Abwicklung

> **Insolvenzentgelt**: zum Zeitpunkt des Insolvenzantrags ausstehende **Lohn**- u. Gehaltzahlungen der Mitarbeiter ist über den **Insolvenz-Entgelt-Fonds** gesichert, wenn sie ihre Forderungen bei der IEF-Service-GmbH anmelden.

**Konkursquote**

$$
\text{Konkursquote} = \frac{\text{Restvermögen}}{\text{Insolvenzforderungen}}
$$

## Privatinsolvenz

Die Privatinsolvenz ist für natürliche Personen als auch für **Einzelunternehmer**

![Privatinsolvenz](/images/privatinsolvenz.png)

### Zahlungsplan

Schuldner bietet an, **einen Teil** seiner Schulden in **maximal 7 Jahren** zurückzuzahlen.

Merkmale:

- **Rückzahlungsquote** berechnet sich aus dem voraussichtlichen Einkommen der nächsten 3 Jahre
- **keine Pfändung**
- **Mehrheit der Gläubiger** muss zustimmen

### Abschöpfungsverfahren

Alles **Einkommen über dem Existenzminimum** wird gepfändet. Dauer ist **5 Jahre**

Abschöpfungsverfahren mithilfe eines **Tilgungsplans** dauert **nur 3 Jahre**, wenn der Antrag auf Privatinsolvenz innerhalb von **30 Tagen** nach Eröffnung des Insolvenzverfahrens gestellt wird. Wärenddessen **keine neuen Schulden** mehr

## Freiwillige Auflösung von Unternehmen

Einige Schließungsgründe sind:

- **Ruhestand**
- **Tod**
- **persönliche Gründe**: z.B. Krankheit, Scheidung, ...
- **Pop-up Stores**: Form eines Unternehmens, die nur für eine begrenzte Zeit existieren, z.B. für die Weihnachtszeit, ...
