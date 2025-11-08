# Docker Cheat Sheet für Vokabeltrainer

## Starten und Stoppen

```bash
# Alles starten (baut Images bei Bedarf)
docker-compose up

# Mit Rebuild erzwingen
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d

# Stoppen
docker-compose down

# Stoppen und Volumes (Datenbank) löschen
docker-compose down -v
```

## Logs anzeigen

```bash
# Alle Logs
docker-compose logs

# Logs folgen (live)
docker-compose logs -f

# Logs von einem Service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f nginx
```

## Container-Management

```bash
# Status aller Container
docker-compose ps

# In einen Container einsteigen
docker-compose exec backend sh
docker-compose exec postgres psql -U nodepg -d postgres

# Container neu starten
docker-compose restart backend
docker-compose restart frontend

# Nur bestimmte Services starten
docker-compose up postgres backend
```

## Troubleshooting

```bash
# Container neu bauen (bei Problemen)
docker-compose build --no-cache

# Alle gestoppten Container entfernen
docker container prune

# Alle ungenutzten Images entfernen
docker image prune -a

# Alles aufräumen (Vorsicht!)
docker system prune -a --volumes

# Netzwerk-Probleme debuggen
docker network inspect vokabeltrainer_vokabeltrainer-network

# Port-Belegung prüfen
sudo netstat -tulpn | grep :80
```

## Datenbank

```bash
# In die Datenbank verbinden
docker-compose exec postgres psql -U nodepg -d postgres

# SQL-Queries ausführen
docker-compose exec postgres psql -U nodepg -d postgres -c "SELECT * FROM wmc.fcUser;"

# Backup erstellen
docker-compose exec postgres pg_dump -U nodepg postgres > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U nodepg postgres
```

## Entwicklung

```bash
# Backend neu starten nach Code-Änderungen
docker-compose restart backend

# Frontend neu starten
docker-compose restart frontend

# Nur Backend und Datenbank starten (ohne Frontend)
docker-compose up postgres backend
```
 