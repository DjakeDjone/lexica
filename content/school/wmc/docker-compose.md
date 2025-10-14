# Docker compose

## Docker vs Docker compose

- Docker: tool to create, deploy, and run containers
- Docker compose: tool to define and manage multi-container Docker applications using a YAML file (`docker-compose.yml`)

## Important commands

- `docker compose up` - Start containers (add `-d` to run in background)
- `docker compose down` - Stop containers (add `-v` to remove volumes -> data loss)
- `docker compose ps` - List containers
- `docker compose logs -f` - View logs (add `--tail 100` to see last 100 lines)
- `docker compose exec <service> <command>` - Run command in a running container (e.g., `docker compose exec web bash` to open a bash shell in the `web` service)
- `docker compose build` - Build or rebuild services
- `docker compose pull` - Pulls images for services defined in the `docker-compose.yml` file
- `docker compose restart` - Restart services
- `docker compose stop` - Stop services without removing them
- `docker compose rm` - Remove stopped service containers

## Config

```yaml
services:
    database:
        image: mongo:noble
        container_name: mongodb
        volumes:
            - todo-db-data:/data/db
        healthcheck:
            test: ["CMD]", "mongo", "--eval", "db.adminCommand('ping')"]
            interval: 10s
            timeout: 5s
            retries: 5
        ports:
            - "27017:27017"
        networks:
            - todo-network
        restart: unless-stopped
    web:
        build: .
        container_name: todo-web
        volumes:
            - ./:/app
        ports:
            - "3000:3000"
        depends_on:
            database:
                condition: service_healthy
        environment:
            - MONGODB_URI=mongodb://database:27017/todo-app
        networks:
            - todo-network
        restart: unless-stopped
```

### Volumes

#### Volume types

- Bind mount: local file or directory mounted into a container (e.g., `- ./:/app`)
- Named volume: managed by Docker, can be reused across containers (e.g., `- todo-db-data:/data/db`)
- Anonymous volume: created when a container is created, deleted when the container is removed (e.g., `- /app/node_modules`)
