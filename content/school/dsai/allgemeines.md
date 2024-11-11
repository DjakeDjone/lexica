# DSAI

## Allgemeines

## Grundlegende Mathematik

### Mean

Der Mittelwert ist der Durchschnittswert einer Liste von Zahlen.

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$

```python
def mean(numbers):
    return sum(numbers) / len(numbers)
```

### Median

Der Median ist der Wert, der in der Mitte einer Liste von Zahlen steht, wenn diese sortiert ist.

$$\text{median} = \begin{cases} \frac{x_{n/2-1} + x_{n/2}}{2} & \text{if } n \text{ is even} \\ x_{n/2} & \text{if } n \text{ is odd} \end{cases}$$

```python
def median(numbers):
    numbers.sort()
    n = len(numbers)
    if n % 2 == 0:
        return (numbers[n//2 - 1] + numbers[n//2]) / 2
    else:
        return numbers[n//2]
```

### Mode

Der Modus ist der Wert, der in einer Liste von Zahlen am häufigsten vorkommt.

$$\text{mode} = \text{argmax}_{x \in X} \text{count}(x)$$

```python
def mode(numbers):
    return max(set(numbers), key=numbers.count)
```

### variance

Die Varianz ist ein Maß für die Streuung der Werte einer Liste von Zahlen. Er ist definiert als der Durchschnitt der quadrierten Abweichungen vom Mittelwert.

$$\text{variance} = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})^2$$

```python
def variance(numbers):
    m = mean(numbers)
    return sum((x - m) ** 2 for x in numbers) / len(numbers)
```

### Standardabweichung/Standard Deviation

Die Standardabweichung ist die Quadratwurzel der Varianz.

$$\sigma = \sqrt{\text{variance}}$$

```python
def std_dev(numbers):
    return variance(numbers) ** 0.5
```
