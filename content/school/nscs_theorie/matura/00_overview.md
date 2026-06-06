- Netzwerktechnologie 
    1. Ethernet/WLAN
    2. Switching/Spanning Tree/Etherchannel
    3. VLAN
- Netzwerkdienste 
    1. Mail
    2. Verzeichnisdienste
    3. DNS
- Netzwerkplanung und Netzwerkmanagement (skipp ich 😎)
    1. IPv4 Familie (IP, ICMP, ARP) + DHCP
    2. IPv6 Familie (IP, ICMP, NDP) + DHCP
    3. Routing
    4. OSPF
- Architektur verteilter Systeme 
    1. WAN
    2. VPN
    3. Monitoring
- Entwicklung verteilter Systeme
    1. Verschlüsselung
    2. PKI/Vertrauensmodelle
    3. UDP/TCP
- Netzwerk- und Systemsicherheit
    1. Firewall/Proxy
    2. Pentesting
    3. Applikationssicherheit (OWASP Top 10)




```mermaid
mindmap
  root((Netzwerktechnologie & verteilte Systeme))
    Netzwerktechnologie
      Ethernet/WLAN
        physische & drahtlose Anbindung
      Switching / Spanning Tree / EtherChannel
        Switching verbindet Segmente
        STP verhindert Schleifen
        EtherChannel bündelt Links
      VLAN
        logische Segmentierung
        Grundlage für Sicherheit & Routing
    Netzwerkdienste
      Mail
        nutzt DNS für MX-Einträge
        benötigt TCP/IP
      Verzeichnisdienste
        zentrale Benutzer & Ressourcen
        Basis für Authentifizierung
      DNS
        Namensauflösung
        wichtig für Mail, Web & Dienste
    Netzwerkplanung & Netzwerkmanagement
      IPv4-Familie
        IP
        ICMP
        ARP
        DHCP
      IPv6-Familie
        IP
        ICMPv6
        NDP
        DHCPv6
      Routing
        verbindet Netze & VLANs
      OSPF
        dynamisches Routing
        skaliert in größeren Netzen
    Architektur verteilter Systeme
      WAN
        verbindet Standorte
      VPN
        sichere Verbindung über unsichere Netze
      Monitoring
        Überwachung von Diensten, Links & Systemen
    Entwicklung verteilter Systeme
      Verschlüsselung
        schützt Vertraulichkeit & Integrität
      PKI / Vertrauensmodelle
        Zertifikate & Identitäten
        Basis für TLS/VPN
      UDP / TCP
        Transportprotokolle
        TCP zuverlässig
        UDP schnell & verbindungslos
    Netzwerk- & Systemsicherheit
      Firewall / Proxy
        Zugriffskontrolle & Filterung
      Pentesting
        Schwachstellen finden
      Applikationssicherheit
        OWASP Top 10
        Schutz verteilter Anwendungen
```