# Ubuntu Commands

## Update and Upgrade

`-y` automatically confirms the prompts.

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Software

```bash
sudo apt install <package-name>
```

## Remove Software

```bash
sudo apt remove <package-name>
```

## Search for Software

```bash
apt search <package-name>
```

## Clean Up

```bash
sudo apt autoremove -y
sudo apt clean
```

## Check Disk Space

```bash
df -h
```

## Check Memory Usage

```bash
free -h
```

## Reboot System

```bash
sudo reboot
```

## Shutdown System

```bash
sudo shutdown now
```

## View System Information

```bash
uname -a
```

## View Running Processes

```bash
top
```

or
```bash
htop
```

## Change File Permissions

```bash
chmod <permissions> <file-or-directory>
```

e.g., `chmod 755 script.sh`

Number codes:

- `7` = read, write, execute
- `6` = read, write
- `5` = read, execute
- `4` = read only
- `3` = write, execute
- `2` = write only
- `1` = execute only
- `0` = no permissions

## Change File Ownership

```bash
sudo chown <user>:<group> <file-or-directory>
```

e.g., `sudo chown benjamin-f:benjamin-f myfile.txt`

## View Network Configuration

```bash
ifconfig
```

or
```bash
ip a
```

## Ping a Host

```bash
ping <hostname-or-ip>
```
e.g., `ping google.com`

## Train (sl)

```bash
sudo apt install sl
sl
```

## Install fish shell

```bash
sudo apt install fish
chsh -s /usr/bin/fish
```

## Install oh-my-fish

```bash
curl -L https://get.oh-my.fish | fish
omf install <theme-name>
```