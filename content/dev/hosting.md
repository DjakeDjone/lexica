# Hosting on Linux

## Start your server

useful:

- [screen](/dev/linux-screen) to keep your server running in the background

## Nginx

Create a new configuration file in `/etc/nginx/sites-enabled/`:

### Generate ssl certificate via certbot

to automatically generate and renew ssl certificates, use certbot:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Restart Nginx

first test the configuration:

```bash
sudo nginx -t
```

```bash
sudo systemctl restart nginx
```

## Issues / Troubleshooting

### SSL_ERROR_NO_CYPHER_OVERLAP

```text
An error occurred during a connection to api.search.fri3dl.dev. Cannot communicate securely with peer: no common encryption algorithm(s).

Error code: SSL_ERROR_NO_CYPHER_OVERLAP

    The page you are trying to view cannot be shown because the authenticity of the received data could not be verified.
    Please contact the website owners to inform them of this problem.
```

This happens when certbot is not up to date.
Update certbot:

```bash
sudo apt update
sudo apt install --only-upgrade certbot
sudo certbot update_symlinks
```

Then renew the certificates:

```bash
sudo certbot renew
```
