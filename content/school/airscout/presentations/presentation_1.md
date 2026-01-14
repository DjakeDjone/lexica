---
marp: true
theme: htl-airscout
paginate: true
header: '![height:50px](https://htlstp.ac.at/wp-content/uploads/2024/10/htl-logo.svg)'
footer: 'Benjamin Friedl, Luca Reisenbichler'
---
<!-- _class: lead -->
<!-- _paginate: false -->
<!-- _footer: '' -->

<div class="cover-layout">
 <div class="cover-image">
  <img src="team.png" alt="Team Airscout" />
 </div>
 <div class="cover-text">
  <h1 class="cover-title">PROJEKT AIRSCOUT</h1>
  <p class="cover-name">Benjamin Friedl (PL)</p>
  <p class="cover-name">Tobias Eisinger (PO)</p>
  <p class="cover-name">Luca Reisenbichler (PL-Stv.)</p>
  <p class="cover-name">Christian Patzl (PTM)</p>
  <p class="cover-name">Valentin Hacker (PTM)</p>
 </div>
</div>

---

## AGENDA

- Auftraggeber
- Ist-Situation
- Projektziele
- Soll-Situation
- Masterplan
- IT-Architektur
- Next Steps

---

## AUFTRAGGEBER

- **Projektverantwortlicher**: Dipl.-Ing. [cite_start]Martin Pfeffel [cite: 21, 23]
- [cite_start]**Organisation**: HTBLUVA St. Pölten [cite: 24]

---

## IST-SITUATION (I)

- [cite_start]**Green Mobility @ School**: Aktuelles System zur Anzeige von Umweltdaten [cite: 28, 29]
- [cite_start]**Zeitraum**: Datenbestand vom 5. Nov. 2024 bis 5. Nov. 2025 [cite: 30]
- [cite_start]**Visualisierung**: Umweltdaten werden aktuell lediglich als einfache Punkte auf einer Karte dargestellt [cite: 41]
- [cite_start]**Kartengrundlage**: Verwendung von OpenStreetMap-Daten [cite: 39]

---

## IST-SITUATION (II)

- [cite_start]**Hintergrund**: Ehemaliges Erasmus+ Projekt mit Schulen aus Luxemburg, Deutschland, Österreich und Spanien [cite: 43, 45, 46]
- **Hardware-Vergleich**:
  - [cite_start]**AirScout (HTBLUVA St. Pölten)**: Kompakt, nachhaltig (100 % EU-Teile), 40h Akkulaufzeit [cite: 50, 54, 55, 56]
  - [cite_start]**AirScout (LTEtt d'Ettelbruck)**: Vollständig wasserfest und portabel [cite: 51, 58]
  - [cite_start]**AirScout (GDS2 Sindelfingen)**: Einfacher Aufbau und modularer Austausch von Teilen [cite: 53, 61]

---

## PROJEKTZIELE

- [cite_start]**Web-Entwicklung**: Erstellung einer Website zur Visualisierung von Umweltdaten [cite: 64, 65, 66]
- [cite_start]**Analyse-Tools**: Filterung der Daten nach Datum und spezifischen Messwerten [cite: 67]
- [cite_start]**Visualisierung**: Einführung einer Werteverteilungskarte (Heatmap) [cite: 69]
- **Community**:
  - [cite_start]Benutzer können eigene Sensordaten beitragen [cite: 70]
  - [cite_start]Ranglistensystem für Schulen und Teilnehmer basierend auf der Datenmenge [cite: 72]

---

## MEILENSTEINE

- [cite_start]**Sensordaten**: Anzeige der Daten auf der Karte bis 06. November 2025 [cite: 89, 90]
- [cite_start]**User-Verwaltung**: Fertigstellung des Systems bis 15. Jänner 2026 [cite: 91]
- [cite_start]**Projekt-Abschluss**: Vollständige Erfüllung des Scopes bis 17. Februar 2026 [cite: 92]

---

## SOLL-SITUATION

- [cite_start]**Optimierung für Radfahrer**: Identifizierung von kühlen Orten und frischer Luft [cite: 100, 101]
- [cite_start]**Nachhaltigkeit**: Förderung des Umstiegs auf Fahrräder zur CO2-Einsparung [cite: 102, 104]
- **Leaderboard**:
  - [cite_start]1. Max M. (HTL St. Pölten): 67 Messwerte [cite: 155, 157, 158, 159]
  - [cite_start]2. Werner .. (HTL St. Pölten): 42 Messwerte [cite: 161, 162, 163]

---

## MASTERPLAN

| Projektphasen | Status | Zeitplan |
| :--- | :--- | :--- |
| Projektinitiierung | Abgeschlossen | [cite_start]Sept [cite: 172, 173] |
| Planung & Analyse | Abgeschlossen | [cite_start]Okt [cite: 173] |
| System-Entwurf | Laufend | [cite_start]Nov [cite: 173] |
| SW-Entwicklung | In Arbeit | [cite_start]Dez - Apr [cite: 173] |
| Abschluss/Übergabe | Geplant | [cite_start]Mai [cite: 173] |

---

## IT-ARCHITEKTUR

- [cite_start]**Frontend**: Angular mit Tailwind CSS, DaisyUI und Leaflet [cite: 177, 179, 180, 181]
- [cite_start]**Backend**: Java Spring Boot [cite: 182, 183]
- [cite_start]**Datenbank**: PostgreSQL mit der TimescaleDB Extension [cite: 184, 186]
- [cite_start]**Testing & CI/CD**: GitHub Actions und JUnit [cite: 187, 188]
- [cite_start]**Infrastruktur**: Projektmanagement via GitHub Projects und Containerisierung mit Docker [cite: 190, 191]

---

## NEXT STEPS

- [cite_start]Fertigstellung der Log-In Seite [cite: 200, 201]
- [cite_start]Evaluierung möglicher Mobile-App-Varianten [cite: 202]
- [cite_start]Finalisierung des Leaderboards [cite: 203]
- [cite_start]Implementierung der Werteverteilung auf der Karte [cite: 204]
- [cite_start]Optimierung der Datenfilterung [cite: 206]
