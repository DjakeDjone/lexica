# PKI

Ausgangsdokument: [Moodle PKI und Vertrauensmodelle](https://moodle.htlstp.ac.at/pluginfile.php/32436/mod_resource/content/2/PKI_und_Vertrauensmodelle_v1.pdf)

## Digitale Signaturen

Ziel: **Authentizität** und **Integrität** sicherstellen

> Digitale Signaturen dienen nicht der Geheimhaltung

### Funktionsweise

![digitale signatur](/images/digital_signature.png)

Digitale Signaturen verwenden asymmetrische Kryptographie:

1. Der **Absender** erstellt eine Nachricht (z.B. ein Dokument)
2. Der **Absender** <mark>erzeugt einen Hash-Wert</mark> der Nachricht (z.B. mit SHA-256)
3. Der **Absender** <mark>verschlüsselt den Hash-Wert</mark> mit seinem privaten Schlüssel (Signieren)
4. Der **Absender** sendet die Nachricht und die digitale Signatur an den **Empfänger**
5. Der **Empfänger** erhält die Nachricht und die digitale Signatur
6. Der **Empfänger** <mark>erzeugt einen Hash-Wert</mark> der empfangenen Nachricht
7. Der **Empfänger** <mark>entschlüsselt die digitale Signatur</mark> mit dem öffentlichen Schlüssel des Absenders (Verifizieren)
8. Der **Empfänger** <mark>vergleicht den entschlüsselten Hash-Wert mit dem selbst erzeugten Hash-Wert</mark>
9. Wenn die Hash-Werte übereinstimmen, ist die Nachricht authentisch und unverändert

## Zertifikate

Problemstellung: Woher weiß der Empfänger, dass der öffentliche Schlüssel wirklich zum Absender gehört?

-> Lösung: **Zertifikate** von vertrauenswürdigen Dritten (Certificate Authorities, CAs)

CA's können z.B. sein:

- Let's Encrypt
- a-trust (Österreichische CA, staatsnahe)

### X.509 Standard für digitale Zertifikate

Ein X.509-Zertifikat enthält:

- den Namen des **Eigentümers** des Zertifikats
- den **öffentlichen Schlüssel** des Eigentümers (public Key)
- den Namen der CA
- Eine digitale Signatur der CA (diese Signatur muss am Gerät/im Browser vorinstalliert sein)
- Gültigkeitszeitraum
- Verwendungszweck

## PKI - Public Key Infrastructure

![A flowchart diagram illustrating the workflow of Public Key Infrastructure (PKI). The diagram connects five main entities using directional arrows to show the exchange of data and certificates:](/images/pki-diagram.png)

### Bestandteile einer PKI

- **Zertifizierungsstelle (CA)**: stellt digitale Zertifikate aus und verwaltet diese
- **Registrierungsstelle (RA)**: überprüft die Identität von Antragstellern, bevor Zertifikate ausgestellt werden
- **Zertifikatsperrliste (CRL)**: Liste von Zertifikaten, die vor Ablaufdatum widerrufen wurden. Alternativ könnte auch eine White-List verwendet werden.
- **Verzeichnisdienste**: ein durchsuchbares Verzeichnis, in dem Zertifikate und CRLs zu  den Usern/Maschinen gespeichert werden (z.B. LDAP)
- **Dokumentation**: Richtlinien und Verfahren zur Verwaltung der PKI
- **Certificate Policies (CP)**: das Anforderungsprofil für Zertifikate, wichtig für die Vertrauenskette
- **Certification Practice Statement (CPS)**: beschreibt die Konkrete Umsetzung der CP

### Zertifizierungspfad/Validierungspfad

Ein Zertifizierungspfad ist eine Kette von Zertifikaten, die von einer vertrauenswürdigen Root-CA bis zum Endbenutzerzertifikat reicht.

**Beispiel hierarchisch:**

1. Root-CA (z.B. Let's Encrypt)
2. Intermediate-CA (z.B. Let's Encrypt Intermediate CA), signiert von der Root-CA
3. Endbenutzerzertifikat (z.B. www.example.com), signiert von der Intermediate-CA

> **Wichtig ist, dass dem Root-CA-Zertifikat vertraut wird (z.B. durch vorinstallierte Zertifikate im Browser oder Betriebssystem).**

### Vertrauensmodelle

- **Hierarchisches Modell**: eine Root-CA, die Intermediate-CAs signiert, die wiederum Endbenutzerzertifikate signieren
- **Cross-Zertifizierung**: mehrere CAs vertrauen einander und signieren gegenseitig ihre Zertifikate. Anwendungsfall war die CA "Let's Encrypt" vor der weiten Verbreitung, damit Browser und Betriebssysteme dem Zertifikat vertrauen.
- **Web of Trust**: dezentralisiertes Modell, bei dem Benutzer gegenseitig ihre Schlüssel signieren (z.B. PGP)

<!-- TODO: image -->
![Infografik mit dem Titel "Web of Trust", die ein Netzwerkdiagramm von Vertrauensbeziehungen zeigt. Im Zentrum steht ein Knoten "ROOT CA / TRUST ANCHOR", von dem aus breite grüne Pfeile ("Transitive Trust") zu den Knoten "Alice" und "Bob" führen. Weitere Personen-Knoten sind "Dave", "Charlie", "Eve" und "Diams". Pfeile unterschiedlicher Farbe und Art verbinden diese Knoten, erklärt durch eine Legende am unteren Rand: Grüne Pfeile bedeuten "Direct" (Direktes Vertrauen), gelbe Pfeile "Indirect" (Indirektes Vertrauen) und rote Pfeile "Untrusted" (Nicht vertrauenswürdig). Die Pfeile sind oft mit Texten wie "Signs Key" (mit Schloss-Symbol) oder "Trusts" versehen. Zum Beispiel signiert Alice Daves Schlüssel, und Bob signiert Charlies Schlüssel. Das Diagramm illustriert, wie Vertrauen von einer zentralen Autorität ausgeht und sich direkt oder transitiv über verschiedene Teilnehmer im Netzwerk verbreitet, während einige Beziehungen als nicht vertrauenswürdig gekennzeichnet sind.](/images/web-of-trust.png)

## Implementierungen

- **Microsoft**: Windows Server (Zertifikatsdienst) enthalten eine CA-Lösung
- **Linux**: OpenSSL, EJBCA, Dogtag
- **Dogtag Certificate System**: Open-Source-PKI-Lösung, die von Red Hat entwickelt wurde. Bietet eine umfassende Suite von PKI-Diensten, einschließlich CA, RA, OCSP und mehr.
