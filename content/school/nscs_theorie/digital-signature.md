# Digitale Signaturen

Digitale Signaturen gewährleisten:

- die Authentizität (Absender ist wirklich der, der er vorgibt zu sein)
- die Integrität (Inhalt wurde nicht verändert)
- die Vertraulichkeit (Inhalt ist nur für den Empfänger lesbar)

## Funktionsweise

1. **Hashwert** wird aus dem Klartext (Nachricht) gebildet
2. Hashwert wird mit dem **privaten** Schlüssel des Absenders **verschlüsselt** (Signatur)
3. Nachricht und Signatur werden an den Empfänger gesendet
4. Empfänger bildet aus der Nachricht den **Hashwert**
5. Empfänger **entschlüsselt** die Signatur mit dem **öffentlichen** Schlüssel des Absenders
6. Empfänger vergleicht die beiden Hashwerte
7. Stimmen die Hashwerte überein, ist die Nachricht authentisch und unverändert

## Hirarchische Signatur

::mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
::

## Digitale Signatur "löschen"

Ist der private Schlüssel kompromittiert, so muss die digitale Signatur "gelöscht" werden. Dies geschieht durch das Veröffentlichen einer sogenannten **Widerrufsliste** (Certificate Revocation List, CRL). Diese Liste enthält alle Zertifikate, die nicht mehr gültig sind.

Die CRL wird von der Zertifizierungsstelle (CA) signiert und regelmäßig aktualisiert. Clients, die ein Zertifikat überprüfen, sollten auch die CRL konsultieren, um sicherzustellen, dass das Zertifikat nicht widerrufen wurde.
