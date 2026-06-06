# Netzwerktechnologie

## Ethernet/WLAN




## Switching/Spanning Tree/Etherchannel

## VLAN

### Warum VLANs?

- schnellere Änderungen
- LAN-Struktur unabhängig von physischer Verkabelung
- Sicherheit: Trennung von sensiblen Daten
- Broadcast-Domänen: Begrenzung von Broadcasts auf VLANs
- Flexibilität: Geräte können in verschiedenen VLANs sein, unabhängig von Standort

### Trunk-Verbindung

![Ethernet Frame mit VLAN-Tag](/images/ethernet-frame_vlntag.png)

- Präambel: **7 Byte**; für Synchronisation
- SFD: **1 Byte**; Start Frame Delimiter markiert Ende der Präambel
- Ziel-MAC: **6 Byte**; Empfängeradresse
- Quell-MAC: **6 Byte**; Absenderadresse
- VLAN-Tag: **4 Byte**; enthält VLAN-ID und Priorität
- EtherType: **2 Byte**; gibt Protokolltyp an (z.B. IPv4, IPv6)
- Payload: **46-1500 Byte**; Nutzdaten
- FCS: **4 Byte**; Frame Check Sequence für Fehlererkennung

### InterVLAN-Routing

- Router-on-a-Stick: Ein Router mit einer einzigen physischen Schnittstelle, die in mehrere Subinterfaces unterteilt ist, um den Verkehr zwischen VLANs zu routen.
- Layer 3 Switch: Ein Switch, der auch Routing-Funktionen unterstützt, ermöglicht die Kommunikation zwischen VLANs ohne die Notwendigkeit eines externen Routers.
