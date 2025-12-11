# NSCS Wunschprüfung

## Der Test

- Wofür steht SOA und was bedeuten diese Kennzahlen?
- Wofür steht DN und RDN? A: Distinguished Name und Relative Distinguished Name

## DNS Eintrag

### SOA - Start of Authority

- Primary Nameserver
- Responsible Person
- Serial Number
- Refresh Time
- Retry Time
- Expire Time
- Minimum TTL

Example:

```
example.com. IN SOA ns1.example.com. admin.example.com. (
2024062601 ; Serial Number
7200       ; Refresh Time
3600       ; Retry Time
1209600    ; Expire Time
3600       ; Minimum TTL
)
```
