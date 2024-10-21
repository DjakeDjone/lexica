# Plotting

## Introduction

In this section, we will learn how to plot data using Python. We will use the `matplotlib` library to create plots.

Plotting is a useful tool for visualizing data. It allows us to see trends and patterns in the data that may not be immediately apparent from the raw data.

## Plotting a Line Graph

To plot a line graph, we can use the `plot` function from the `matplotlib.pyplot` module. The `plot` function takes two arguments: the x-coordinates and the y-coordinates of the data points.

```python
import matplotlib.pyplot as plt

# Data
x = [1, 2, 3, 4, 5]
y = [2, 3, 5, 7, 11]

# Plot
plt.plot(x, y)
plt.show()
```

### Customizing the Plot

We can customize the plot by adding labels, titles, and legends. We can also change the color, line style, and marker style of the plot.

```python
import matplotlib.pyplot as plt

# Data
x = [1, 2, 3, 4, 5]
y = [2, 3, 5, 7, 11]

# Plot
plt.plot(x, y, color='red', linestyle='dashed', marker='o', label='data')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Line Graph')
plt.legend()
plt.show()
```
# Plotting

## Introduction

In this section, we will learn how to plot data using Python. We will use the `matplotlib` library to create plots.

Plotting is a useful tool for visualizing data. It allows us to see trends and patterns in the data that may not be immediately apparent from the raw data.

## Plotting a Line Graph

To plot a line graph, we can use the `plot` function from the `matplotlib.pyplot` module. The `plot` function takes two arguments: the x-coordinates and the y-coordinates of the data points.

```python
import matplotlib.pyplot as plt

# Data
x = [1, 2, 3, 4, 5]
y = [2, 3, 5, 7, 11]

# Plot
plt.plot(x, y)
plt.show()
```

### Boxplot

Visualisiert 5 Werte:

- Minimum
- 1. Quartil
- Median
- 3. Quartil
- Maximum

```python
import matplotlib.pyplot as plt

# Data
data = [1, 2, 3, 4, 5]

# Plot
plt.boxplot(data)
plt.show()
```
