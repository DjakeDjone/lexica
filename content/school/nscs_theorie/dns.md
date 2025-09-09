# DNS

Treeförmig:
Root-Punkt -> Top Level Domain -> Second Label Domain -> Third Level Domain ...

eg.: . -> com -> wikipedia -> de :::=> de.wikipedia.org.

## Ablauf einer DNS-Abfrage

wir wollen moodle.htlstp.at aufrufen:

1. Wir fragen den lokalen DNS-Server (meistens der Router) nach der IP-Adresse von moodle.htlstp.at
2. Der lokale DNS-Server fragt den Root-Server (.) nach dem zuständigen Top-Level-Domain-Server (.at)
3. Der Root-Server antwortet mit der IP-Adresse des .at-Servers
4. Der lokale DNS-Server fragt den .at-Server nach dem zuständigen Second-Level-Domain-Server (htlstp.at)
5. Der .at-Server antwortet mit der IP-Adresse des htlstp.at-Servers
6. Der lokale DNS-Server fragt den htlstp.at-Server nach der IP-Adresse von moodle.htlstp.at
7. Der htlstp.at-Server antwortet mit der IP-Adresse von moodle.htlstp.at
8. Der lokale DNS-Server antwortet mit der IP-Adresse von moodle.htlstp.at an den Client
9. Der Client verbindet sich mit der IP-Adresse von moodle.htlstp.at
