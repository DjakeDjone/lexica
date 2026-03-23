# Letzter NSCS Test

made by @gemini

## **1\. E-Mail-Systeme und Protokolle**

\[Referenz: Mail\_v2.pdf\]

### **Komponenten und der Weg einer E-Mail**

* **MUA (Mail User Agent):** Der E-Mail-Client des Absenders/Empfängers (z. B. Outlook, Thunderbird).  
* **MTA (Mail Transfer Agent):** Der Mail-Server, der die E-Mails weiterleitet.  
* **MDA (Mail Delivery Agent):** Der Ziel-Mail-Server, der die E-Mail im Postfach des Empfängers ablegt.  
* **MX-Eintrag (Mail Exchange):** Ein DNS-Eintrag, der angibt, an welche IP-Adresse E-Mails für eine bestimmte Domain gesendet werden sollen \[Referenz: Mail\_v2.pdf, S. 3\].

### **Protokolle**

* **SMTP (Simple Mail Transfer Protocol, Port 25):** Dient dem reinen Senden/Weiterleiten von E-Mails zwischen MTAs. Da SMTP nativ keine Verschlüsselung oder Authentifizierung bietet, wurde **ESMTP** (Extended SMTP) eingeführt (inkl. STARTTLS, SMTP-Auth, DSN) \[Referenz: Mail\_v2.pdf, S. 4-7\].  
* **POP3 (Post Office Protocol, Port 110 / verschlüsselt 995):** Lädt E-Mails vom Server herunter. Ideal für Einwahlverbindungen. *Nachteil:* Keine Synchronisierung; E-Mails werden meist lokal verwaltet und vom Server gelöscht.  
* **IMAP (Internet Message Access Protocol, Port 143 / verschlüsselt 993):** Verwaltet E-Mails direkt auf dem Server (Ordnerstrukturen etc.). Ideal für Unternehmen und die Nutzung mehrerer Endgeräte, da der Posteingang stets synchronisiert ist \[Referenz: Mail\_v2.pdf, S. 8-9\].

### **Sicherheit**

* **Authentisierung vs. Authentifizierung vs. Autorisierung:** \* *Authentisierung:* Behauptung einer Identität (z. B. Passwort-Eingabe).  
  * *Authentifizierung:* Überprüfung dieser Behauptung durch das System.  
  * *Autorisierung:* Einräumung von Rechten nach erfolgreicher Prüfung \[Referenz: Mail\_v2.pdf, S. 3-4\].  
* **STARTTLS vs. SMTPS:** STARTTLS beginnt unverschlüsselt und handelt dann Verschlüsselung aus. SMTPS ist von Beginn an verschlüsselt.  
* **PGP (Pretty Good Privacy):** Bietet echte End-to-End-Verschlüsselung mithilfe einer Public-Key-Infrastruktur. Verhindert, dass MTAs auf dem Weg mitlesen können \[Referenz: Mail\_v2.pdf, S. 10\].  
* **SPF (Sender Policy Framework):** Ein DNS-TXT-Eintrag, der definiert, welche IP-Adressen (MTAs) befugt sind, E-Mails für diese Domain zu versenden. Schützt vor gefälschten Absenderadressen (Spoofing) \[Referenz: Mail\_v2.pdf, S. 10\].

## **2\. Firewalls und IP-Tables**

\[Referenz: firewall\_03.pdf\]

### **Grundlagen**

* **Paketfilter (Layer 3 & 4):** Überprüfen Quell-/Ziel-IP, Protokolle (TCP/UDP/ICMP), Ports und Flags. Sie betrachten *nicht* den Inhalt (Payload) der Pakete \[Referenz: firewall\_03.pdf, S. 2\].  
* **Stateful Packet Filtering:** Merkt sich den Verbindungsstatus. Zustände: NEW (neue Verbindung), ESTABLISHED (Folgepaket), RELATED (z. B. bei UDP/ICMP Fehler), INVALID (Paket kann nicht zugeordnet werden) \[Referenz: firewall\_03.pdf, S. 9\].

### **IP-Tables (Linux Kernel Modul)**

* **Tables (Tabellen):**  
  * *filter:* Standardtabelle (INPUT, FORWARD, OUTPUT).  
  * *nat:* Für Port-Forwarding und Adress-Umsetzungen (PREROUTING, POSTROUTING, OUTPUT).  
  * *mangle:* Zum gezielten Verändern von Paketen \[Referenz: firewall\_03.pdf, S. 8\].  
* **Policies:** Das Standardverhalten einer Chain, wenn keine Regel greift (ACCEPT oder DROP). "DROP" wird aus Sicherheitsgründen empfohlen (Alles verboten, was nicht explizit erlaubt ist).

### **Proxys und DMZ**

* **Proxy-Arten:**  
  * *Transparenter Proxy:* Läuft direkt am Gateway, Clients benötigen keine spezielle Konfiguration.  
  * *Reverse Proxy:* Steht vor den Webservern (z. B. in einer DMZ), liefert statische Inhalte, verbirgt die wahre IP der Server und dient oft als Load Balancer \[Referenz: firewall\_03.pdf, S. 4-5\].  
  * *SSL-Interception (Man-in-the-Middle):* Proxys müssen HTTPS aufbrechen (Zertifikate austauschen), um Inhalte zu filtern. Kostet viel Performance \[Referenz: firewall\_03.pdf, S. 4\].  
* **DMZ (Demilitarized Zone):** Separates Netzwerk zwischen LAN und Internet. Hier stehen Server, die von außen erreichbar sein müssen (Web, Mail). Wenn ein Server in der DMZ kompromittiert wird, bleibt das interne LAN geschützt \[Referenz: firewall\_03.pdf, S. 9\].

## **3\. VPN Technologien (Virtual Private Network)**

\[Referenz: vpn\_02.pdf\]

### **Verbindungsarten und Einsatzgebiete**

* **Remote Access VPN:** Ein "Teleworker" greift via Internet von zu Hause auf das Firmennetz zu.  
* **Site-to-Site VPN:** Verbindet zwei Firmenstandorte miteinander (Kostenersparnis gegenüber Standleitungen).  
* *Strukturen:* Host-to-Host (PC zu PC), Host-to-Net (Dial-Up / Client zu Netzwerk), Net-to-Net (LAN-Interconnect) \[Referenz: vpn\_02.pdf, S. 2-5\].

### **VPN Protokolle**

* **PPTP:** Veraltet und unsicher (RC4 Algorithmus, knackbar).  
* **L2TP:** Reines Transportprotokoll (Layer 2). Besitzt *keine* eigene Verschlüsselung, wird daher meist mit IPSec kombiniert.  
* **OpenVPN:** Nutzt TLS/SSL und Port 1194 (TCP/UDP). Modi: Routing (Layer 3, eigenes Subnetz) oder Bridging (Layer 2, simuliert ein LAN, nutzt TAP-Device, skaliert schlechter) \[Referenz: vpn\_02.pdf, S. 6-7\].  
* **GRE (Generic Routing Encapsulation):** Kann Multicast/Broadcast tunneln, bietet aber *keine* Verschlüsselung. Wird oft in IPSec "eingepackt" \[Referenz: vpn\_02.pdf, S. 7-8\].

### **IPSec (Layer 3\)**

* **SAs (Security Associations):** Definiert Parameter für die Verschlüsselung in eine Richtung (Simplex). Wird durch Ziel-IP, Security Protocol Identifier und SPI identifiziert.  
* **Modi:**  
  * *Transport Mode:* Verschlüsselt nur die Nutzdaten (Payload). IP-Header bleibt lesbar.  
  * *Tunnel Mode:* Das gesamte Original-IP-Paket wird verschlüsselt und in ein neues Paket gepackt.  
* **Header-Typen:**  
  * **AH (Authentication Header):** Sorgt für Integrität und Authentizität, bietet aber **keine Verschlüsselung**.  
  * **ESP (Encapsulating Security Payload):** Bietet Authentisierung, Integrität UND **Verschlüsselung** der Daten \[Referenz: vpn\_02.pdf, S. 11\].

## **4\. WAN Technologien (Wide Area Network)**

\[Referenz: WAN\_01.pdf\]

### **WAN vs. LAN & Grundbegriffe**

* **Unterschiede:** WANs decken große geografische Gebiete ab, werden von ISPs verwaltet und sind gebührenpflichtig. LANs sind lokal, eigentümergeführt und nach Anschaffung kostenlos \[Referenz: WAN\_01.pdf, S. 2\].  
* **Komponenten:**  
  * *DTE (Data Terminal Equipment):* Kunden-Equipment (z.B. der Kundenrouter).  
  * *DCE (Data Communications Equipment):* Provider-Equipment (z.B. das Modem).  
  * *Demarcation Point:* Der physische Übergabepunkt (Verantwortungsgrenze zwischen Kunde und ISP).  
  * *Local Loop (Letzte Meile):* Kabelverbindung vom Kunden zur ersten Vermittlungsstelle \[Referenz: WAN\_01.pdf, S. 6\].

### **Topologien und Vermittlungsarten**

* **Topologien:** Point-to-Point, Hub-and-Spoke, Fully Meshed (am ausfallsichersten, aber am teuersten), Partially Meshed \[Referenz: WAN\_01.pdf, S. 3-4\].  
* **Kommunikationstypen:**  
  * *Circuit-Switched (Leitungsvermittelt):* Dedizierte Verbindung wird aufgebaut (wie beim Telefon, z.B. ISDN).  
  * *Packet-Switched (Paketvermittelt):* Daten werden zerteilt und dynamisch geroutet (z.B. Ethernet, MPLS, Frame Relay). Billiger und flexibler \[Referenz: WAN\_01.pdf, S. 6-7\].

### **Konnektivitätsoptionen**

* **Moderne Technologien:** Ethernet WAN (Metro E), **MPLS** (Nutzt Labels anstatt IPs fürs Routing, sehr performant) \[Referenz: WAN\_01.pdf, S. 9\].  
* **Internetbasiert:** Breitband (ADSL ist asymmetrisch, SDSL symmetrisch), Kabel (DOCSIS, geteilte Bandbreite), Glasfaser (FTTx). Drahtlos: Mobilfunk, Satellit, WiMAX \[Referenz: WAN\_01.pdf, S. 10-11\].  
* **ISP-Verbindungen:** \* *Single-homed:* 1 Verbindung zu 1 ISP.  
  * *Dual-homed:* 2 Verbindungen zu 1 ISP.  
  * *Multihomed:* 1 Verbindung zu je 2 ISPs.  
  * *Dual-multihomed:* 2 Verbindungen zu je 2 ISPs (Höchste Redundanz) \[Referenz: WAN\_01.pdf, S. 11-13\].