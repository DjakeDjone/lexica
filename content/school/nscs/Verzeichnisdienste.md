# Verzeichnisdienste

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