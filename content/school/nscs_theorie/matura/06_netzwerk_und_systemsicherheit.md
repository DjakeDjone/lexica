# Netzwerk- und Systemsicherheit

## Firewall/Proxy

<https://lexica.fri3dl.dev/school/nscs_theorie/firewall_proxy>

## Pentesting

Nessus/OpenVAS

- 1 - **Reconnaissance**: Informationsbeschaffung
- 2 - **Scanning**: Identifizierung von Schwachstellen
- 3 - **Gaining Access**: Zugriff erhalten
- 4 - **Maintaining Access**: Zugriff aufrecht erhalten
- 5 - **Covering Tracks**: Spuren verwischen

Vorgangsweise

- Netzwerkzugang
- sonstige Kommunikation
- physischer Zugang
- Social Engineering

## Applikationssicherheit (OWASP Top 10)

# OWASP Top 10 (2025)

1. **Broken Access Control**: z.B. broken/missing Auth check 
2. **Security Misconfiguration**: z.B. firebase allow all
3. **Software Supply Chain Failures**: z.B. npm packages
4. **Cryptographic Failures**: z.B. legacy hash algorithm
5. **Injection**: z.B. SQL injection
6. **Insecure Design**: z.B. unsichere reset-password frage
7. **Authentication Failures**: z.B. kein JWT-expire
8. **Software or Data Integrity Failures**: z.B. digital signuature von update nicht überprüfen
9. **Security Logging & Alerting Failures**: z.B. kein logging für API failures
10.  **Mishandling of Exceptional Conditions**: z.B. keine Exception handling
