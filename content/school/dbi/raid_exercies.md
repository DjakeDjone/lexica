---
title: "RAID Exercises"
protocolAbgabedatum: "05.12.2025"
protocolAufgabenNr: 02
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "05.12.2025"
protocolDescription: "RAID Exercises and Comparisons"
---

Find out the specifics of RAID level 4 and compare it with RAID level 5\. What are main differences  
regarding storage organization, storage consumption, access behavior and fault tolerance?

## Differences between RAID 4 and RAID 5

| Comparison | RAID 4 | RAID 5 |
| :---- | :---- | :---- |
| **Partitioning** | auf einzelne Festplatten | auf alle Festplatten distribuiert |
| Min. Anzahl Festplatten | 2 | 3 |
| Performance/Speed | gut | besser, weil verteilte Parität |
| Fault Tolerance | 1 Festplattenausfall | 1 Festplattenausfall |

## Raid 6 vs Raid 5

| Comparison | RAID 6 | RAID 5 |
| :---- | :---- | :---- |
| Min. Anzahl Festplatten | 4 | 3 |
| Fault Tolerance | 2 Festplattenausfälle | 1 Festplattenausfall |
| Performance/Speed | langsamer durch doppelte Parität | schneller |
| Storage Efficiency | geringer durch doppelte Parität | höher |

## Präsentation RAID 6

## RAID 01 vs RAID 10

Der Hauptunterschied zwischen RAID 01 und RAID 10 liegt in der Art und Weise, wie die Daten gespiegelt und verteilt werden. RAID 10 spiegelt zuerst die Daten und verteilt sie dann (Stripe of Mirrors), während RAID 01 die Daten zuerst verteilt und dann spiegelt (Mirror of Stripes).  
**Präferenz: RAID 10** RAID 10 wird im Allgemeinen bevorzugt, da es eine bessere Fehlertoleranz und schnellere Wiederherstellungszeiten (Rebuild) bietet. Fällt bei RAID 01 eine Platte aus, ist der gesamte Spiegelarm gefährdet/degradiert. Bei RAID 10 betrifft der Ausfall nur das jeweilige Spiegelpaar.

## RAID-Z2 vs RAID 6

**Wesentlicher Unterschied:** RAID-Z2 ist spezifisch für das ZFS-Dateisystem und eng mit diesem integriert (Software/Filesystem-Level), während RAID 6 klassischerweise auf Blockebene (oft Hardware-Controller) arbeitet.

* **Write Hole:** RAID 6 hat das Problem des "Write Hole" (Dateninkonsistenz bei Stromausfall während des Schreibens), was teure Controller mit Batterie-Backup erfordert. RAID-Z2 nutzt "Copy-on-Write" und variable Stripe-Breiten, wodurch das Write-Hole-Problem eliminiert wird.  
* **Resilvering:** RAID 6 muss die ganze Disk wiederherstellen. RAID-Z2 muss nur die tatsächlich geschriebenen Daten wiederherstellen (Resilvering), was oft viel schneller ist.

**Präferenz für große Disks (\>6-8 TB): RAID-Z2** Bei sehr großen Festplatten dauert ein Rebuild (Wiederherstellung) bei klassischem RAID 6 extrem lange, was das Risiko eines zweiten Ausfalls erhöht. Zudem steigt die Wahrscheinlichkeit von unkorrigierbaren Lesefehlern (URE/UBER). ZFS/RAID-Z2 prüft die Datenintegrität mittels Checksums bei jedem Lesen und verhindert so "Silent Data Corruption", was bei großen Datenmengen kritisch ist.

## RAID Overview

| RAID Level | Striping | Mirroring | Capacity | Parity | Min \#drives | Max failing drives | Read/Write behavior |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **0** | YES | NO | $N$ | NO | 2 | 0 | Sehr schnell (R/W), da parallel. |
| **1** | NO | YES | $N/2$ | NO | 2 | 1 (pro Paar) | Schnell (R), Mittel (W \- muss auf beide schreiben). |
| **01** | YES | YES | $N/2$ | NO | 4 | 1 (pro Span) | Sehr schnell (R/W). |
| **10** | YES | YES | $N/2$ | NO | 4 | 1 (pro Paar) | Sehr schnell (R/W). Besserer Rebuild als 01\. |
| **4** | YES | NO | $N-1$ | YES | 3 | 1 | Schnell (R), Langsam (W) wegen Paritäts-Bottleneck. |
| **5** | YES | NO | $N-1$ | YES | 3 | 1 | Sehr schnell (R), Mittel (W) wegen Paritätsberechnung. |
| **6** | YES | NO | $N-2$ | YES | 4 | 2 | Sehr schnell (R), Langsamer (W) wegen doppelter Parität. |

## XOR Truth Tables

Das exklusive Oder (XOR / $\\oplus$) liefert 1 (wahr), wenn eine **ungerade** Anzahl der Eingänge 1 ist.

### 2 Bits

| A | B | A ⊕ B |
| :---- | :---- | :---- |
| 0 | 0 | **0** |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **0** |

### 3 Bits

| A | B | C | A ⊕ B ⊕ C |
| :---- | :---- | :---- | :---- |
| 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | **1** |
| 0 | 1 | 0 | **1** |
| 0 | 1 | 1 | **0** |
| 1 | 0 | 0 | **1** |
| 1 | 0 | 1 | **0** |
| 1 | 1 | 0 | **0** |
| 1 | 1 | 1 | **1** |

### 4 Bits

```text
B1 = 1 1 0 0   1 1 0 0
B3 = 0 0 1 0   1 1 0 1
B4 = 1 0 1 0   1 1 0 1
P  = 0 1 1 0   1 0 1 1
-------------------------
B2 = 0 0 1 0   0 1 1 1  <-- Dies entspricht dem ursprünglichen B2
```

## Parity Calculation

Gegeben sind 4 Bytes in einem RAID 5 System. Die Parität $P$ wird durch bitweises XOR aller Blöcke berechnet:  
$P = B_1 \oplus B_2 \oplus B_3 \oplus B_4$
