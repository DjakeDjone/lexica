# Python + Nixos

```nix
# python
pkgs.python312
pkgs.python312Packages.conda
```

## Init conda

```bash
conda init
```

## Create env

```bash
conda create -n env_name python=3.12
```

## Activate env

```bash
conda activate env_name
```

## Install package

```bash
conda install package_name
```

### sample

```bash
conda install numpy
```

## Setup for DSAI (Data Science and AI)

```bash
conda install -c pytorch-nightly -c conda-forge jupyter scikit-learn seaborn python-graphviz pytorch torchvision scikit-image
```
