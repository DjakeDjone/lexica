# NSCS 2. Test

## Teststoff 2. Test

- OSPF
- ACL's
- Troubleshooting

## OSPF

- [OSPF](https://lexica.fri3dl.dev/school/nscs/ospf)

## ACL's

ACL's sind eine Möglichkeit, den Datenverkehr in einem Netzwerk zu steuern. Sie können verwendet werden, um den Zugriff auf bestimmte Ressourcen zu gewähren oder zu verweigern. ACL's können auf Routern und Switches konfiguriert werden.

Sobald eine ACL konfiguriert ist werden automatisch alle Pakete, die nicht in der ACL definiert sind, verworfen. Dies wird als **implicit deny** bezeichnet. Um den Zugriff auf bestimmte Ressourcen zu gewähren, müssen Sie eine Regel in der ACL definieren, die den Zugriff erlaubt. Diese Regel wird als **permit** bezeichnet.

> ACL's arbeiten auf Layer **3 und Layer 4** des OSI-Modells.

### ACL's Beispiel

```bash
no ip access-list extended allow_intern
ip access-list extended allow_intern
remark DNS
permit udp any any eq 53 ## erlaubt DNS-Anfragen
permit tcp any any eq 53 
remark Web
permit tcp any any eq 80 ## erlaubt HTTP
permit tcp any any eq 443 ## erlaubt HTTPS
remark local ftp
permit tcp any host 36.7.12.131 eq 21 ## erlaubt FTP. Die IP-Adresse ist die des FTP-Servers
permit tcp any host 36.7.12.131 eq 20
remark dhcp
permit udp host 0.0.0.0 any eq 67

interface f0/0
ip access-group allow_intern in
```

Es gibt:

- **Standard ACL's**: Diese ACL's arbeiten auf Layer 3 des OSI-Modells und können nur die Quell-IP-Adresse eines Pakets überprüfen. Sie werden normalerweise verwendet, um den Zugriff auf bestimmte IP-Adressen zu gewähren oder zu verweigern.
- **Erweiterte ACL's**: Diese ACL's arbeiten auf Layer 4 des OSI-Modells und können sowohl die Quell- als auch die Ziel-IP-Adresse eines Pakets überprüfen. Sie können auch den Protokolltyp (z.B. TCP, UDP) und die Portnummer überprüfen. Erweiterte ACL's sind flexibler als Standard ACL's und ermöglichen eine genauere Steuerung des Datenverkehrs.
- **Named ACL's**: Diese ACL's sind benannt und können sowohl Standard- als auch erweiterte ACL's sein. Sie ermöglichen eine einfachere Verwaltung von ACL's, da sie einen Namen anstelle einer Nummer verwenden.
