# Docker compose

## Docker vs Docker compose

- Docker: tool to create, deploy, and run containers
- Docker compose: tool to define and manage multi-container Docker applications using a YAML file (`docker-compose.yml`)

## Important commands

- `docker compose up` - Start containers (add `-d` to run in background)
- `docker compose down` - Stop containers (add `-v` to remove volumes -> data loss)
- `docker compose ps` - List containers (add `-a` to see all containers, including stopped ones)
- `docker compose logs -f` - View logs (add `--tail 100` to see last 100 lines,`-f` to follow logs in real-time)
- `docker compose exec <service> <command>` - Run command in a running container (e.g., `docker compose exec web bash` to open a bash shell in the `web` service)
- `docker compose build` - Build or rebuild services
- `docker compose pull` - Pulls images for services defined in the `docker-compose.yml` file
- `docker compose restart` - Restart services
- `docker compose stop` - Stop services without removing them
- `docker compose rm` - Remove stopped service containers

## Config

theoretically, you can just start multiple containers with Docker commands, but Docker compose makes it easier to manage complex applications with multiple services, networks, and volumes.

Example `shell` script to start a MongoDB and a Node.js web application:

```yaml
services:
    database:
        image: mongo:noble
        container_name: mongodb
        volumes:
            - todo-db-data:/data/db
        healthcheck:
            test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
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
volumes:
    todo-db-data:
networks:
    todo-network:
        driver: bridge # default
```

### Volumes

#### Volume types

- Bind mount: local file or directory mounted into a container (e.g., `- ./:/app`)
- Named volume: managed by Docker, can be reused across containers (e.g., `- todo-db-data:/data/db`)
- Anonymous volume: created when a container is created, deleted when the container is removed (e.g., `- /app/node_modules`)

### Mounts

- `volumes`: for persistent data storage (e.g., databases)
- `binds`: for sharing code/configuration between host and container (e.g., web application code)
- `tmpfs`: for temporary data storage in memory (e.g., caching)

#### Example volume usage

say we want to persist MongoDB data and share application code between host and container:

```yaml
volumes:
    todo-db-data: # named volume for MongoDB data
services:
    database:
        volumes:
            - todo-db-data:/data/db # mount named volume to /data/db in container
    web:
        volumes:
            - ./:/app # bind mount current directory to /app in container
```

or via command line:

```bash
docker volume create todo-db-data
docker run -d -v todo-db-data:/data/db mongo:noble
```