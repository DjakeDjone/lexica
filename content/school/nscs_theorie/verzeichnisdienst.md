# Verzeichnisdienste

Ein Verzeichnisdienst speichert Informationen in einer hierarchischen, baumartigen Struktur.

## Vorteile von Verzeichnisdiensten

- Teile der Struktur können von <mark>von verschiedenen Administratoren</mark> verwaltet werden (dezentral)
- Unternehmensstrukturen können <mark>abgebildet</mark> werden (z.B. Abteilungen, Standorte)
- Verteilung der Struktur auf <mark>mehreren verschiedenen Servern</mark> (Replikation)
- die <mark>Suche</mark> nach Einträgen ist sehr effizient, weil nur relevante Teile des Baumes durchsucht werden müssen
-Da LDAP auf X.500 basiert, werden hier objektorientierte Datenmodelle verwendet, welche die Realität
abbilden können. (Abteilungsobjekt, Unternehmensobjekt)

## X.500 DAP -> LDAP

X.500 ist ein Standard für Verzeichnisdienste, der das Directory Access Protocol (DAP) verwendet.
Da X.500 jedoch zu Ressourcenintensiv ist, wurde LDAP (Lightweight Directory Access Protocol) entwickelt, um eine leichtere und effizientere Alternative zu bieten.
LDAP ist im Wesentlichen eine vereinfachte Version von DAP und ermöglicht den Zugriff auf Verzeichnisdienste über das Internet.

## LDAP-Struktur

LDAP verwendet eine hierarchische Struktur, die aus Einträgen besteht. Jeder Eintrag hat ein Distinguished Name (DN), der seinen eindeutigen Pfad im Verzeichnis angibt.
Einträge bestehen aus Attributen, die Informationen über das Objekt enthalten, wie z.B. Name, E-Mail-Adresse oder Telefonnummer.

Beispiel für einen DN:

```
uid=jdoe,ou=users,dc=example,dc=com
```

Beispiel für eine Hirarchie:

```
dc=com
    |-- dc=example
          |
          |-- ou=users
          |      |
          |      |-- uid=jdoe
          |      |-- uid=asmith
          |
          |-- ou=groups
                 |
                 |-- cn=admins
                 |-- cn=users   
```

## Anwendungsgebiete von LDAP im Netzwerk

- **Verwaltung** von **Benutzern**, Gruppen und Rechn ern (passwd, groups, hosts)
- Verwaltung von **IP-Diensten** (services)
- Zuordnung von Protokollen (protocols)
- RPV-Zuordung (rpc)
- NIS Informationen (netgroup)
- Boot Informationen (MAC-Addresse und boot Parameter)
- Mountpoints für das Dateisystem zur Verwendung des "Automount" Dienstes
- Verwaltung von Mail-Aliasen
- Verwaltung der DNS Zonendateien
- Verwaltung der DHCP-Server Informationen
- Authentifizierung von Benutzen beim Squid und Apache

## Aufbau des LDAP Datenmodelle

LDAP verwendet ein objektorientiertes Datenmodell, das auf Klassen und Attributen basiert, ähnlich wie in der objektorientierten Programmierung.

- **Verzeichniseintrag**: Ein Verzeichniseintrag repräsentiert ein <mark>Objekt</mark> im Verzeichnis, z.B. einen Benutzer oder eine Gruppe.
  - besteht aus <mark>Attributen</mark>, die Informationen über das Objekt enthalten.
  - <mark>**Distinguished Name (DN)**</mark>: Ein eindeutiger Bezeichner für jeden Eintrag im Verzeichnis, der seinen Pfad in der Hierarchie angibt.
- Durch die verschiedenen Objekte entsteht so nach und nach eine <mark>Baumstruktur</mark>.
  - **Objekttypen**:
    - **Container**: Objekte, die weitere Objekte beinhalten können (z.B. `ou` = Organizational Unit, `dc`, `o`).
    - **Blätter (Leaves)**: Objekte zur Verwaltung von Ressourcen (z.B. Benutzer `uid`, Gruppen `cn`).
    - *Besonderheit:* Im Gegensatz zu Active Directory können in LDAP auch unterhalb von Blattobjekten weitere Objekte erzeugt werden.

## Objektklassen und Attribute

Jedes Objekt im LDAP gehört einer oder mehreren **Objektklassen** an (z.B. `inetOrgPerson`, `posixAccount`).

- **Funktion der Objektklasse**: Sie legt fest, welche Attribute für ein Objekt verwendet werden dürfen.
  - **MUST**: Attribute, die zwingend vorhanden sein müssen.
  - **MAY**: Attribute, die optional vergeben werden können.
- **Vererbung**: Klassen können von anderen Klassen abgeleitet werden und deren Attribute erben.
- **Polymorphie**: Ein Eintrag kann mehreren Klassen angehören (Mehrfachvererbung), wobei `top` meist die Basisklasse bildet.
- **Attribut-Eigenschaften**: Attribute können einzelwertig (single-value) sein oder mehrere Werte annehmen (multi-value).

## Verwaltung der Namen (DN vs. RDN)

Um Objekte eindeutig zu identifizieren, nutzt LDAP ein Namensschema, das dem eines Dateisystems ähnelt.

- **RDN (Relative Distinguished Name)**:
  - Der relative Name eines Eintrags, eindeutig auf seiner Ebene (ähnlich einem Dateinamen).
  - Setzt sich oft aus dem "Common Name" (`cn`) zusammen.
  - Kann aus mehreren Attributen bestehen, verbunden durch ein `+` (z.B. `cn=Name+uid=123`), um Eindeutigkeit zu garantieren.
- **DN (Distinguished Name)**:
  - Der absolute Pfad zum Objekt durch den gesamten Baum (ähnlich dem absoluten Pfad im Dateisystem).
  - Beispiel: `cn=Peter Müller,ou=MKTG,ou=Firma`.

## Schema

Das Schema definiert das Regelwerk des Verzeichnisdienstes. Es wird textorientiert in `*.schema` Dateien verwaltet.

**Ein Schema definiert:**
1. Verwendete Attributtypen
2. Verwendete Objektklassen
3. Filter- und Matching-Regeln
4. Rechte (ACLs)

Wichtige Standard-Schemata sind z.B. `core.schema` (Grundlagen), `inetorgperson.schema` (Benutzerverwaltung) oder `samba.schema` (Windows-Netzwerk-Kompatibilität).

## LDIF (LDAP Data Interchange Format)

LDIF ist ein textbasiertes Standardformat (Key-Value Pairs) für den Import, Export und die Manipulation von Daten im LDAP.

**Einsatzmöglichkeiten:**
- **Hinzufügen (add)**: Definition von DN, Objektklassen und Attributen.
- **Ändern (modify)**: Nutzung von `changetype: modify` mit Unterschlüsseln wie `add`, `replace` oder `delete`.
- **Löschen (delete)**: Entfernen ganzer Einträge oder spezifischer Attribute.

**Beispiel für das Ändern einer Mail-Adresse:**
```ldif
dn: uid=sbrown20,ou=People,dc=example,dc=com
changetype: modify
replace: mail
mail: sbrown2@example.com