# Raid Exercises

Find out the specifics of RAID level 4 and compare it with RAID level 5. What are main differences
regarding storage organization, storage consumption, access behavior and fault tolerance?

## Differences between RAID 4 and RAID 5

| Comparison | RAID 4 | RAID 5 |
|------------|--------|--------|
| **Partitioning** | auf einzelne Festplatten | auf alle Festplatten distribuiert |
| Min. Anzahl Festplatten | 2 | 3 |
| Performance/Speed | gut | besser, weil verteilte Parität |
| Fault Tolerance | 1 Festplattenausfall | 1 Festplattenausfall |

## Raid 6 vs Raid 5

| Comparison | RAID 6 | RAID 5 |
|------------|--------|--------|
| Min. Anzahl Festplatten | 4 | 3 |
| Fault Tolerance | 2 Festplattenausfälle | 1 Festplattenausfall |
| Performance/Speed | langsamer durch doppelte Parität | schneller |
| Storage Efficiency | geringer durch doppelte Parität | höher |

## Präsentation RAID 6

<!-- TODO -->

## RAID 01 vs RAID 10

Der Hauptunterschied zwischen RAID 01 und RAID 10 liegt in der Art und Weise, wie die Daten gespiegelt und verteilt werden. RAID 10 spiegelt zuerst die Daten und verteilt sie dann, während RAID 01 die Daten zuerst verteilt und dann spiegelt.
