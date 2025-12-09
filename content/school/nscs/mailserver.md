
### Fast Notes

10.139.0.111

port 10000 web admin

anmelden mit schueler/schueler credentials

#### Create Masterzone

Zone: `nscs.lan`
Name: `<name>.nscs.lan`
Masterserver: `nameserver`
mail: `admin@<name>.nscs.lan`

-> Create drücken

#### Mail Server

Mailserver Records

Mail Server `mail`
Priority: `10`

### Adressen

Add Address Records

Name: `mail`
Address: `10.139.0.<xx>` (je nach Schüler)

und dann noch ns:

Name: `ns`
Address: `10.139.0.111`

Name Server Records

Zone Name: `<name>.nscs.lan`
Name Server: `ns.<name>.nscs.lan`

#### Address Records

Name: `ns.<name>.nscs.lan`
Address: `10.139.0.111`

> Ein Blick in die Check-Bind-list lohnt sich, auch wenn dieser nur fatale Fehler finded.

#### Testen

testen auf eigener Linux machine, auf der auch der Mailserver rennen wird:

```bash
nslookup mail.<name>.nscs.lan
nslookup ns.<name>.nscs.lan
```

### Davcot 

installieren:

```bash
apt install dovcot-imapd
```

config ändern

```bash
sudo systemctl restart postfix
sudo systemctl restart dovcot
```