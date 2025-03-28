# OSPF, ACLs und Troubleshooting (+Gemini)

**Link State Protokolle:** Der Router kennt das gesamte Netzwerk/Netzwerkaufbau.

## OSPF (Open Shortest Path First)

* **Grundlagen:**
  * OSPF ist ein Link-State-Routing-Protokoll, das in RFC 2328 definiert ist.
  * Es verwendet Kosten als Metrik zur Bestimmung des besten Pfads.
  * OSPF verwendet fünf verschiedene Pakettypen: Hello, Database Description (DBD), Link-State Request (LSR), Link-State Update (LSU) und Link-State Acknowledgement (LSAck).
  * OSPF verwendet Designated Router (DR) und Backup Designated Router (BDR) in Multiaccess-Netzwerken, um die Anzahl der Adjazenzen und die LSA-Überflutung zu reduzieren.
* **Konfiguration:**
  * OSPF wird auf einem Router mit dem Befehl `router ospf process-id` aktiviert.
  * Das `network` Kommando wird verwendet, um Schnittstellen zu definieren, die an einem bestimmten OSPF-Prozess teilnehmen.
  * Die Router-ID wird verwendet, um einen Router zu identifizieren.
* **Metrik:**
  * OSPF verwendet Kosten als Metrik, die auf der Bandbreite einer Schnittstelle basiert.
  * Die Kosten werden mit der Formel 10^8 / Bandbreite berechnet.
  > Problem bei der Berechnung: Alles über 100 Mbps wird als 1 betrachtet. Lösung: höhere Referenzbandbreite verwenden. (statt 10^8, z.B. 10^9)

  * Designated Router (DR) und Backup Designated Router (BDR):
     Der **erste Router**, oder der mit der höchsten **Priority** wird DR, der **zweite Router** BDR.
* **Multi-Area OSPF:**

> Linkstate Advertisment:
>
> LSA ist eine Nachricht die Informationen über Netzwerkstruktur enthält.
>

## **ACLs (Access Control Lists)**

* **Grundlagen:**
  * ACLs enthalten eine sequentielle Liste von Permit- oder Deny-Anweisungen, die als Access Control Entries (ACEs) bezeichnet werden.
  * ACLs können verwendet werden, um den Datenverkehr basierend auf verschiedenen Kriterien zu filtern.
* **Typen:**
  * Standard-ACLs filtern Pakete nur anhand der Quelladresse.
  * Erweiterte ACLs filtern Pakete basierend auf Protokolltyp, Quell- und Ziel-IP-Adressen sowie Quell- und Ziel-TCP/UDP-Ports.
  * IPv6-ACLs sind ähnlich wie erweiterte IPv4-ACLs, verwenden jedoch keine Wildcard-Masken, sondern Präfixlängen.
* **Konfiguration:**
  * ACLs werden mit dem Befehl `access-list` konfiguriert.
  * ACLs werden mit dem Befehl `ip access-group` an eine Schnittstelle gebunden.
  * IPv6-ACLs werden mit dem Befehl `ipv6 traffic-filter` an eine Schnittstelle gebunden.
* **Fehlerbehebung:**
  * Häufige ACL-Fehler sind das Eingeben von ACEs in der falschen Reihenfolge oder das Nichtanwenden angemessener Kriterien auf die ACL-Regeln.
  * Die Befehle `show access-lists`, `show ip interface` und `show ipv6 access-list` können verwendet werden, um ACLs zu überprüfen.

> IPV6
>
> Am Ende jeder IPv6 ACLS steht, dass Neighbor Discovery Protocol (NDP) und ICMPv6 aktiviert sind.

## **Troubleshooting**

* **Prozess:**
  * Ein strukturierter Troubleshooting-Prozess kann verwendet werden, um Netzwerkprobleme zu lösen.
  * Ein detaillierter siebenstufiger Troubleshooting-Prozess umfasst die Schritte: Problem definieren, Informationen sammeln, Informationen analysieren, mögliche Ursachen eliminieren, Hypothese aufstellen, Hypothese testen und Problem lösen.
* **Methoden:**
  * Es gibt verschiedene Troubleshooting-Methoden, darunter Bottom-Up, Top-Down, Divide-and-Conquer, Follow-the-Path, Substitution, Comparison und Educated Guess.
* **Tools:**
  * Es gibt verschiedene Software- und Hardware-Troubleshooting-Tools, darunter Netzwerkmanagement-Systemtools, Protokollanalysatoren, digitale Multimeter, Kabeltester, Kabelanalysatoren und Syslog-Server.
* **Symptome und Ursachen:**
  * Netzwerkprobleme können in verschiedenen Schichten des OSI-Modells auftreten.
  * Häufige Symptome und Ursachen von Problemen variieren je nach Schicht.
* **IP-Konnektivität:**
  * Die Fehlerbehebung bei End-to-End-Konnektivitätsproblemen umfasst die Überprüfung der physischen Schicht, die Überprüfung auf Duplex-Fehlpaarungen, die Überprüfung der Adressierung, die Überprüfung des Standardgateways, die Überprüfung des korrekten Pfads, die Überprüfung der Transportschicht, die Überprüfung von ACLs und die Überprüfung von DNS.
