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

Ein Paketfilter kontrolliert den Netzwerkverkehr anhand von Regeln auf Paketebene (z. B. Quelle, Ziel, Protokoll und Port). Je nach definierter Richtlinie werden Pakete erlaubt, verworfen oder protokolliert. Dadurch kann unerwünschter Verkehr blockiert und der Zugriff auf Dienste gezielt eingeschränkt werden.

`iptables` ist unter Linux ein Werkzeug zur Konfiguration der Netfilter-Firewall im Kernel. Regeln werden in Ketten (z. B. `INPUT`, `OUTPUT`, `FORWARD`) organisiert und der Reihe nach ausgewertet. Typische Aktionen sind `ACCEPT`, `DROP`, `REJECT` oder `LOG`. Damit lassen sich Host-Firewalls aufbauen, um nur bestimmte Clients, Protokolle oder Paketgrößen zuzulassen.

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

Webmin ist danach erreichbar unter: <https://10.139.0.125:10000>

Das Anmeldeproblem wurde durch das Aendern des Webmin-Passworts behoben:

![alt text](/images/firewall_webmin_password_change.png)

### Erlauben Sie Pings nur von einem Client

- Action to take: Allow
- From: eigene IP-Adresse, auslesbar mit `ip addr show`, bei mir `172.17.0.105`
- Protocol: ICMP

![alt text](/images/firewall_ping_allow_rule.png)
![alt text](/images/firewall_ping_allow_verify.png)

Danach alle anderen Pings blockieren:

![alt text](/images/firewall_ping_block_rule.png)
Wichtig: `Apply Configuration` ausfuehren.

![alt text](/images/firewall_apply_config.png)

Jetzt werden externe Pings geblockt, aber die eigenen Pings funktionieren weiterhin:

![alt text](/images/firewall_ping_test_result.png)

### Lassen Sie sich die aktuelle Konfiguration anzeigen

Anzeige in der Shell:

```bash
sudo iptables -L -n -v
```

![alt text](/images/firewall_current_config.png)
### Loggen Sie diese Pakete (Prefix Possible DoS Attack!) und verwerfen Sie sie danach:

#### mehr als 10 Pings pro Minute

In Webmin war die gewünschte Regel in dieser Form nicht direkt umsetzbar. Daher wurde sie per `iptables` in der Shell ergänzt:

```bash
sudo iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 10/minute --limit-burst 10 -j ACCEPT
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j LOG --log-prefix "Possible DoS Attack! "
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

Ergebnis: Bis zu 10 Echo-Requests pro Minute werden akzeptiert, darüber hinaus werden sie mit Prefix `Possible DoS Attack!` geloggt und verworfen.


#### Pings mit mehr als 100 Byte Größe

- Create Rule
- Action to take: Log and Drop
- From: Any
- extra options: Packet length größer als 100 Byte (`-m length --length 101:65535`)
![alt text](/images/firewall_dos_log_drop_rule.png)
![alt text](/images/firewall_dos_rule_config.png)

Jetzt werden Pings mit mehr als 100 Byte geloggt und danach verworfen.

Test:
```bash
ping -s 101 10.139.0.125
```

![alt text](/images/firewall_dos_test_result.png)

Relevante Logs anzeigen:

```bash
sudo tail -f /var/log/syslog | grep "Possible DoS Attack"
```

### Ergebnis

Die Firewall-Regeln wurden erfolgreich umgesetzt und getestet:

- Zugriff auf Webmin ist auf den gewünschten Client eingeschränkt.
- ICMP ist nur für den erlaubten Client möglich.
- Auffällige ICMP-Pakete (zu hohe Rate bzw. zu große Paketgröße) werden geloggt und verworfen.

Damit wurde die Angriffsfläche reduziert und eine bessere Nachvollziehbarkeit durch Logging erreicht.
