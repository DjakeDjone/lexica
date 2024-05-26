# NSCS Test 26. Mai 2024

NSCS Test 26. Mai 2024 Weixelbaum 3. Klasse
\
Stoff: Skriptum v0.8 Seite 63-81
Präsentation Anonym im Internet

## Table of contents

- [Layer 4](#layer-4)


## Layer 4

Layer 4 -> Transport Layer

### Ports

Ports sind Nummern, die einem Prozess auf einem Computer zugeordnet sind.

- 0-1023: System Ports/Well Known Ports für bekannte Dienste durch IANA
- 1024-49151: User Ports/Registered Ports für Anwendungen bei IANA registriert
- 49152-65535: Dynamic Ports -> für temporäre Verbindungen

**Well Known Ports:**

- 20: FTP Data (File Transfer Protocol)
- 22: SSH (Secure Shell)
- 53: DNS (Domain Name System)
- 80: HTTP (Hypertext Transfer Protocol)
- 443: HTTPS (Hypertext Transfer Protocol Secure)

### UDP

- User Datagram Protocol
- Verbindungslos
- Keine Bestätigung/Reihenfolge
- Verwendet für: Streaming, Voice over IP, DNS, DHCP

-------------  32 Bit -----------------
| Source Port | Destination Port |
|-------------|------------------|
| Length      | Checksum         |
| Data        |                  |

### TCP

- Transmission Control Protocol
- Verbindungsorientiert
- Sicherung durch: Sequenznummern, Prüfsummen, Zeitüberwachung...

![TCP Aufbau IMG.](/images/tcp.png)

![TCP Verbindungsaufbau](/images/tcp-aufbau.png)

Der HOST kann eine Verbindung mit dem RST Flag beenden/ablehnen.

**Datenübertragung:**

- 3-Way-Handshake
- Datenübertragung (**ACK**)
- Verbindung beenden (**FIN** SEQ=Y)

## Penetration Testing


![Penetration Testing Kriterien](/images/penetrationTesting.png)

## Phasen eines Hacking-Angriffs

1. **Reconnaissance:**
   - Informationssammlung
   - Footprinting
   - Scanning
   - Enumeration(Identifizierung von Systemen)
2. **Scanning:**
   - Identifizierung von Schwachstellen
   - Port Scanning
   - Vulnerability Scanning
3. **Gaining Access:** (Zugriff erhalten)
    - Exploitation
    - Social Engineering
    - Password Cracking
4. **Maintaining Access:** (Zugriff aufrecht erhalten für späteren Zugriff )
    - Backdoors
    - Rootkits
    - Trojans
5. **Covering Tracks:** (Spuren verwischen) 🤫
    - Log Files löschen
    - Dateien löschen
    - Systemeinträge löschen

## Reconnaissance - Informationsbeschaffung

*Auch Footprinting genannt.*

**Quellen:**

- Social Media
- Unternehmenswebseite
- Internetrecherche
- Domain- u. IP Information

**Tools:**

- Google
- Shodan
- Whois
- Social Engineering

### Google Dorking

| Operator | Beschreibung |
|----------|--------------|
| " "      | Suche nach exakten Begriffen |
| -        | Ausschluss von Begriffen |
| OR       | Suche nach einem oder mehreren Begriffen |
| AND      | Suche nach mehreren Begriffen |
| site:    | Suche auf einer bestimmten Webseite |
| intitle: | Suche im Titel |
| inurl:   | Suche in der URL |
| filetype:| Suche nach Dateityp |
| link:    | Suche nach Links |
| related: | Suche nach ähnlichen Seiten |
| info:    | Informationen über eine Webseite |
| *        | Wildcard |

### Shodan

- Suchmaschine für Geräte im Internet
- Suchen nach IP-Adressen, Ports, Betriebssystemen, etc.

### Whois

- Abfrage von Domain-Informationen
- Registrar, Nameserver, IP-Adresse, etc.

### DNS

- Domain Name System
- Übersetzung von Domainnamen in IP-Adressen
- A-Record, MX-Record, NS-Record, CNAME-Record
\

dig fragt DNS-Server nach Informationen an.
```bash
dig -t A domain.com
```

### Scanning

- **Port Scanning** -> NMAP, Masscan
- Vulnerability Scanning (Schwachstellen) -> Nessus, OpenVAS
- **Service Enumeration**/Version Detection (Dienste aufzählen) -> NMAP
- **Networ Mapping** (Netzwerkstruktur) -> NMAP, Netdiscover
- **OS Fingerprinting** (Betriebssystem) -> NMAP
\
\
**NMAP:**

```bash
nmap -sS -sV -O -A -T4 target
```

- -sS: SYN Scan
- -sP: Ping Scan (schnell)
- -sU: UDP Scan
- -sT: TCP Scan
- -sV: Version Detection
- -O: OS Detection
- -A: All/Aggressive Scan
- -T4: Timing (1-5)

**OpenVAS:**

- Open Vulnerability Assessment System
- Schwachstellen-Scanner
- Webinterface
- Funktionsweise: Port-Scan, Schwachstellen-Scan, Report

**Bewerten von Schwachstellen:**

**VCE:** (Common Vulnerabilities and Exposure)

- Identifikation u. Katalogisierung
- Koordination u. Kommunikation
- Öffentliche DB

**CVSS:** (Common Vulnerability Scoring System)

- Schwachstellenbewertung
- Basis, Temporal, Umgebung
- Score 0-10
  - 1-3: Low
  - 4-6: Medium
  - 7-8: High
  - 9-10: Critical

## OWASP Top 10

Liste der 10 häufigsten Schwachstellen in Webanwendungen.

- **Broken Access Control**
- **Cryptographic Failures** (Verschlüsselung fehlerhaft)
- **Injection** (SQL, Command Injection)
- **Insecure Design** (unsicheres Design)
- **Security Misconfiguration** (unsichere Konfiguration)
- **Vulnerable Components** (verwundbare Komponenten)
- **Identification and Authentication Failures** (Identifikation u. Authentifizierung)
- **Software and Data Integrity Failures** (Integrität von Software u. Daten)
- **Security Logging and Monitoring Failures** (Logging u. Monitoring)
- **Server-Side Request Forgery** (SSRF) (Serverseitige Anfragenfälschung)

## Anonymität im Internet

- **Proxy Server**
- **VPN**
- **TOR** (The Onion Router)
- **I2P** (Invisible Internet Project)
- **Freenet**

## Proxy Server

- Zwischenstation
- Verbergen der IP-Adresse
- Anonymität
- Zugriff auf gesperrte Seiten

## VPN

- Virtuelles privates Netzwerk
- Verschlüsselung
- Anonymität
- Zugriff auf gesperrte Seiten
- Verbindung zu Firmennetzwerken

### Proxy vs. VPN

| Proxy | VPN |
|-------|-----|
| Verbergen der IP-Adresse | Verschlüsselung |
| Anonymität | Anonymität |
| Zugriff auf gesperrte Seiten | Zugriff auf gesperrte Seiten |
| | Verbindung zu Firmennetzwerken |

## TOR

- The Onion Router
- Anonymität
- Verschlüsselung
- Zugriff auf das Darknet
- Onion-Adressen
- Exit Nodes

## Darknet

- Verborgener Teil des Internets
- Zugriff über spezielle Software
- Anonymität
- Illegale Aktivitäten
- viele Websiten von FBI um Nutzer zu fangen
