# Numpy

## Commands

### linspace

linespace calculates evenly spaced numbers over a specified interval.

```python
import numpy as np
np.linspace(0, 10, 5) # 0, 2.5, 5, 7.5, 10
```

### arange

arange returns evenly spaced values within a given interval.

```python
import numpy as np
np.arange(0, 10, 2) # 0, 2, 4, 6, 8
```

### reshape

reshape gives a new shape to an array without changing its data.

```python
import numpy as np
np.arange(0, 10, 2).reshape(1, 5) # [[0, 2, 4, 6, 8]]
```

### Slicing

```python
import numpy as np
matrix = np.arange(1, 10).reshape(3, 3) # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
matrix = 2**matrix # [[2, 4, 8], [16, 32, 64], [128, 256, 512]]
matrix[0] # [2, 4, 8]
matrix[0, 1] # 4
```

### Conditional selection/Boolean indexing

```python

import numpy as np
matrix = np.arange(1, 10).reshape(3, 3) # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

print(matrix > 5) # [[False, False, False], [False, False, True], [True, True, True]]
print(matrix[matrix > 5]) # [6, 7, 8, 9]
```

### Operations

```python

import numpy as np
matrix = np.arange(1, 10).reshape(3, 3) # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

print(matrix + matrix) # [[ 2,  4,  6], [ 8, 10, 12], [14, 16, 18]]
print(matrix - matrix) # [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
print(matrix * matrix) # [[ 1,  4,  9], [16, 25, 36], [49, 64, 81]]
print(matrix / matrix) # [[1., 1., 1.], [1., 1., 1.], [1., 1., 1.]]
print(matrix ** 2) # [[ 1,  4,  9], [16, 25, 36], [49, 64, 81]]
```

### argmax

```python
import numpy as np

matrix = np.arange(1, 10).reshape(3, 3) # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(matrix.argmax()) # 8
```

