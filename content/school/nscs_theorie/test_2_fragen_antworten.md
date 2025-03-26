# OSPF, ACLs und Troubleshooting (NSCS 2. Test)

## OSPF (Open Shortest Path First)

- **Metrik**: OSPF verwendet die Kosten (Cost) als Metrik, basierend auf der Bandbreite der Verbindung. Höhere Bandbreiten haben niedrigere Kosten. Das Problem von Schleifen wird durch den SPF-Algorithmus (Dijkstra) gelöst.
- **DR und BDR**: Der Designated Router (DR) und Backup Designated Router (BDR) reduzieren den OSPF-Traffic in Multiaccess-Netzwerken. Sie werden durch Wahlen basierend auf Priorität und Router-ID bestimmt.
- **LSA-Typen**: In Multi-Area-OSPF-Netzwerken gibt es verschiedene LSA-Typen, z. B. Typ 1 (Router-LSA), Typ 2 (Netzwerk-LSA) und Typ 3 (Summary-LSA).
- **Multi-Area-OSPF**: Ermöglicht die Skalierung durch Aufteilung in mehrere Bereiche (Areas). Router-Typen: Internal Router, Area Border Router (ABR), Backbone Router, Autonomous System Boundary Router (ASBR).

## ACLs (Access Control Lists)

- **Inbound/Outbound ACLs**: Inbound-ACLs filtern Traffic, bevor er den Router erreicht, während Outbound-ACLs Traffic nach der Verarbeitung filtern.
- **Best Practices**: ACLs sollten spezifisch und gut dokumentiert sein. Änderungen sollten getestet werden, um unbeabsichtigte Auswirkungen zu vermeiden.
- **Extended ACLs**: Filtern basierend auf Quell-/Ziel-IP, Protokoll und Port. Das Schlüsselwort `established` erlaubt nur Antworten auf ausgehende Verbindungen.
- **IPv6-ACLs**: Am Ende wird automatisch eine implizite Regel hinzugefügt, die allen Traffic blockiert.

## Troubleshooting

- **Methoden**:
  - Bottom-Up: Beginnt bei der physischen Schicht und arbeitet sich nach oben.
  - Top-Down: Beginnt bei der Anwendungsschicht und arbeitet sich nach unten.
  - Divide-and-Conquer: Teilt das Problem in kleinere Teile.
- **Typischer Ablauf**:
  1. Problem identifizieren.
  2. Hypothesen aufstellen.
  3. Tests durchführen.
  4. Lösung implementieren.
- **Baseline**: Drei Schritte:
  1. Normalzustand dokumentieren.
  2. Tools zur Überwachung einsetzen.
  3. Regelmäßige Updates der Baseline durchführen.

## Layer 2 Probleme

- Typische Probleme:
  1. Duplex-Mismatch.
  2. VLAN-Konfigurationsfehler.
  3. MAC-Adressenkonflikte.
