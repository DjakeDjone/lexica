# Beschreibende Statistik - Statistische Kenngrößen

### Arithmetisches Mittel (=Mittelwert ~ mean)

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$

oder in python code:

```python
number_list = [x1, x2, x3, ..., xn]
mean = sum(number_list) / len(number_list)
```

### Geometrisches Mittel

$$\tilde{x} = \sqrt[n]{\prod_{i=1}^{n} x_i}$$

oder in python code:

```python
import numpy as np
data = [x1, x2, x3, ..., xn]
geometric_mean = np.exp(np.mean(np.log(data)))
```

### Interquartilsabstand
