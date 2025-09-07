# Basics

## ISO/OSI Schichtenmodell

- Application
- Presentation
- Session
- Transport
- Network
- Data Link
- Physical

### Application

Schnittstelle zwischen Anwendungen und Netzwerk;

**Protokolle:** HTTP, FTP, SMTP..

### Presentation

Übernimmt Entschlüsselung, De/&Komprimierung,

### Session

Verbindung zwischen Endsystemen, Verwaltung von Sessions

**Protokolle:** RPC, SMB, NetBIOS..

### Transport

Verbindungsaufbau, -abbau, -steuerung, Segmentierung, Multiplexing

**Protokolle:** TCP, UDP, SCTP..

### Network

Routing von Datenpaketen, logische Adressierung

**Protokolle:** IP, ICMP, ARP..

### Data Link

Datentransfer zweier Geräte im selben Netzwerk. Zerlegt Pakete von Network Layer in Frames.
Außerdem prüft der Data Layer die Integrität der Frames und behebt Fehler.

> Der Data Link Layer ist für die physikalische Adressierung zuständig (MAC-Adressen).

**Protokolle:** Ethernet, PPP, HDLC..

### Physical

Übertragung von Bits über ein physikalisches Medium

**Protokolle:** USB, RS-232, DSL..

