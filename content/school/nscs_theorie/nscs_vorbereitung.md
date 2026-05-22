# NSCS Vorbereitung

## Ethernet

### Übertragung mittels Strom

- Koaxialkabel: Innenleiter, Isolator, Außenleiter, Schutzmantel
- Twisted Pair (UTP, STP): verdrillte Adernpaare, um elektromagnetische Störungen zu reduzieren

### Kollisionserkennung

- Sender horcht auf dem Medium, ob nur das gesendet wird, was er selbst sendet
- Wenn nicht, Kollision erkannt, alle Sender stoppen, warten zufällige Zeit und senden erneut

### Kollisionsdomäne

Eine Kollisionsdomäne ist ein Netzwerksegment, in dem Kollisionen auftreten können. Alle Geräte, die an dasselbe Segment angeschlossen sind, befinden sich in derselben Kollisionsdomäne.

Sie wird von einem Switch oder Router getrennt, da diese Geräte den Datenverkehr filtern und weiterleiten, wodurch Kollisionen vermieden werden.

In einem vollständig geswitchten Netzwerk hat jedes Gerät seine eigene Kollisionsdomäne, da der Switch den Datenverkehr direkt an das Zielgerät weiterleitet. Daher können in einem solchen Netzwerk **keine Kollisionen auftreten.**

> Full Dublex/Half Duplex: Full Duplex ermöglicht gleichzeitiges Senden und Empfangen von Daten, während Half Duplex nur eine Richtung gleichzeitig erlaubt. In einem Full Duplex Netzwerk können keine Kollisionen auftreten, da die Kommunikation in beide Richtungen gleichzeitig möglich ist. In einem Half Duplex Netzwerk können Kollisionen auftreten, wenn zwei Geräte gleichzeitig senden.

### Qualitätskriterien von Kabeln

- **Bandbreite**: maximale Datenrate, die über das Kabel übertragen werden kann
- **Dämpfung**: Signalverlust über die Entfernung, gemessen in dB. Die Dämpfung hängt von der Kabellänge und der Frequenz ab. Höhere Frequenzen haben in der Regel eine höhere Dämpfung.
- **Störanfälligkeit**: Anfälligkeit für elektromagnetische Störungen, z.B. durch andere Kabel oder Geräte

Ein Kabel hat Kapazitive und Induktive Eigenschaften, die die Signalübertragung beeinflussen können. (Quasi wie ein Kondensator und eine Spule) Die Kapazität und Induktivität können zu Signalverzerrungen führen, insbesondere bei höheren Frequenzen.


## Mail

### E2E encryption

- PGP (Pretty Good Privacy): Verschlüsselung von E-Mails, die auf einem Schlüsselpaar basiert (privat und öffentlich)
- S/MIME (Secure/Multipurpose Internet Mail Extensions): Verschlüsselung von E-Mails, die auf X.509-Zertifikaten basiert
- Beide Methoden bieten Authentizität, Integrität und Vertraulichkeit, aber PGP ist benutzerfreundlicher und flexibler, während S/MIME besser in Unternehmensumgebungen integriert ist.

## IPv4


