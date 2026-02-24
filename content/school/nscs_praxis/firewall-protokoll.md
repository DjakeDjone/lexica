---
title: Firewall und Application Gateway
generateTableOfContents: false
protocolAbgabedatum: 23.02.2026
protocolAbgabetermin: 23.02.2026
protocolAufgabenNr: 3
protocolDescription: "In diesem Protokoll werden die Ergebnisse der Firewall-Analyse präsentiert, einschließlich der identifizierten Schwachstellen, der durchgeführten Tests und der empfohlenen Maßnahmen zur Verbesserung der Sicherheit."
protocolGruppe: "1"
protocolKlasse: 5AHIF
protocolName: Benjamin Friedl
tags: []
---

## Firewall iptables

### Beschreiben Sie die Funktion von Paketfiltern (allgemein) und iptables (speziell)

TODO

### Installieren Sie webmin. (Konfigurieren Sie die Firewall, dass nur ein PC auf webmin zugreifen kann)

```bash
sudo apt update
```

<https://webmin.com/download/>

```bash
curl -o webmin-setup-repo.sh https://raw.githubusercontent.com/webmin/webmin/master/webmin-setup-repo.sh
sudo sh webmin-setup-repo.sh
```

```bash
sudo apt-get install webmin --install-recommends
```

![alt text](/images/firewall_webmin_install.png)

url: <https://10.139.0.125:10000>

I fixed that by changing the webmin password:

![alt text](/images/firewall_webmin_password_change.png)

### Erlauben Sie Pings nur von einem Client

- Action to take: Allow
- From: eigene IP-Adresse, auslesbar mit `ip addr show`, bei mir `172.17.0.105.51052`
- Protocol: ICMP

![alt text](/images/firewall_ping_allow_rule.png)
![alt text](/images/firewall_ping_allow_verify.png)

----> jetzt alle anderen Pings blockieren:

![alt text](/images/firewall_ping_block_rule.png)
WICHTIG: apply configuration

![alt text](/images/firewall_apply_config.png)

Jetzt werden externe Pings geblockt, aber die eigenen Pings funktionieren weiterhin:

![alt text](/images/firewall_ping_test_result.png)

### Lassen Sie sich die aktuelle Konfiguration anzeigen

![alt text](/images/firewall_current_config.png)

### Loggen Sie diese Pakete (Prefix Possible DoS Attack!) und verwerfen Sie sie danach:

#### mehr als 10 Pings pro Minute

geht nicht, da die Option `--limit` im Webmin nur mit below verfügbar ist, aber nicht mit above.


#### Pings mit mehr als 100 Byte Größe

- Create Rule
- Action to take: Log and Drop
- From: Any
- extra options: Rate limit: above 100Byte (`-m length --length 100:65535`)
![alt text](/images/firewall_dos_log_drop_rule.png)
![alt text](/images/firewall_dos_rule_config.png)

jetzt werden die Pings mit mehr als 100 Byte Größe geloggt und danach verworfen:

testen:
```bash
ping -s 101 10.139.0.125
```

![alt text](/images/firewall_dos_test_result.png)

show relevant logs:

```bash
sudo tail -f /var/log/syslog | grep "Possible DoS Attack"
```
