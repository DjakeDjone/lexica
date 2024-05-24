# Garuda Linux

## update system

```bash
sudo pacman -Syu ## would be by normal arch
sudo garuda-update
```

## install

```bash
sudo pacman -S <package>
```

## uninstall

```bash
sudo pacman -R <package>
```

## update

```bash
sudo pacman -Syu
```

## search

To search for a package in the repositories:

```bash
pacman -Ss <package>
```

## list installed packages

```bash
pacman -Q
```

## list orphaned packages

To list orphaned(unnecessary) packages:

```bash
pacman -Qdt
```
