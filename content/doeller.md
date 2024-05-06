# Döller Test 3.5.2024

## Stoff

- **Big O Notation**

## Calculating the Time Complexity

```javascript
 /**
 * Get the smallest number on an array of numbers
 * @param {Array} n array of numbers
 */
function getMin(n) {
  const array = Array.from(n);
  let min;

  array.forEach(element => {
    if(min === undefined || element < min) {
      min = element;
    }
  });
  return min;
}
```

If every line of the code needs a constant time to execute, the time complexity of the function `getMin` is 2(n) + 3.

## Asymptotic Notation

![All running complexities graphs](image.png)

Asymptotic notation is a way to describe the behavior of a function as the input size **goes to infinity**. It is used to describe the upper and lower bounds of a function.

**Examples:**

- `3n2+2n+20` is `O(n2)` because the highest power of n is 2.
- `2n+3` is `O(n)` because the highest power of n is 1.
- `3` is `O(1)` because the highest power of n is 0.

## Big-O notation and Growth rate of Functions

**O(1)** - Constant time complexity. The time it takes to run the function is constant, regardless of the input size.

```javascript
function getFirstElement(array) {
  return array[0];
}
```

**O(n)** - Linear time complexity. The time it takes to run the function is directly proportional to the input size.

```javascript
function findElement(array, element) {
  for(let i = 0; i < array.length; i++) {
    if(array[i] === element) {
      return i;
    }
  }
  return -1;
}
```

**O(n2)** - Quadratic time complexity. The time it takes to run the function is proportional to the square of the input size.

```javascript
function bubbleSort(array) {
  for(let i = 0; i < array.length; i++) {
    for(let j = 0; j < array.length - i - 1; j++) {
      if(array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}
```

**O(log n)** - Logarithmic time complexity. The time it takes to run the function grows logarithmically with the input size.

```javascript
function binarySearch(array, element) {
  let low = 0;
  let high = array.length - 1;

  while(low <= high) {
    const mid = Math.floor((low + high) / 2);
    if(array[mid] === element) {
      return mid;
    } else if(array[mid] < element) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}
```

**O(n log n)** - Linearithmic time complexity. The time it takes to run the function grows linearithmically with the input size.

```javascript
function mergeSort(array) {
  if(array.length <= 1) {
    return array;
  }

  const mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);

  return merge(mergeSort(left), mergeSort(right)); // this is O(n log n)
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while(leftIndex < left.length && rightIndex < right.length) { // this is O(n)
    if(left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
```

The time complexity of the `mergeSort` function is `O(n log n)` because the function is called recursively `log n` times, and each call has a time complexity of `O(n)`.

**O(2n)** - Exponential time complexity. The time it takes to run the function grows exponentially with the input size.

```javascript
function fibonacci(n) {
  if(n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

The time complexity of the `fibonacci` function is `O(2n)` because the function is called twice for each value of `n`.

**O(n!)** - Factorial time complexity. The time it takes to run the function grows factorially with the input size.

```javascript
function factorial(n) {
  if(n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
```

## Recursion and Time Complexity

```javascript
function factorial(n) {
  if(n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
```

The time complexity of the `factorial` function is `O(n)` because the function is called `n` times.

## Big-O: Formal Definition

![Formal Def. Img.](formal-dev.png)

The formal definition of Big-O notation is as follows:

`T(n) = O(g(n))` if and only if there exist positive constants `c` and `n0` such that `0 ≤ T(n) ≤ c * g(n)` for all `n ≥ n0`.

Erklärung:

- T(n)` ist die Funktion, die die Laufzeit des Algorithmus in Abhängigkeit von der Eingabegröße `n` beschreibt. zB. `T(n) = 2n + 3` für die Funktion `getMin` oben.
- `g(n)` ist die Funktion, die die obere Schranke für die Laufzeit des Algorithmus in Abhängigkeit von der Eingabegröße `n` darstellt.
- `c` ist eine positive Konstante, die die obere Schranke für die Laufzeit des Algorithmus festlegt.
- `n0` ist eine positive Konstante, ab der die obere Schranke für die Laufzeit des Algorithmus gilt.

## Big-O Examples

<!-- ![Sample](bigOsample.png) -->
**Claim:** $T(n) = a_kn^k + a_{k-1}n^{k-1} + ... + a_1n + a_0$ then $T(n) = O(n^k)$

**Proof:** 

## Big-O: Best, Average, and Worst Case

- **Best Case**: The minimum time complexity that an algorithm can have for a given input size.
- **Average Case**: The expected time complexity of an algorithm for a given input size, taking into account all possible inputs.
- **Worst Case**: The maximum time complexity that an algorithm can have for a given input size.

## Big-O: Space Complexity

The space complexity of an algorithm is the amount of memory space required by the algorithm to run as a function of the input size.

**Examples:**

- `O(1)` - Constant space complexity. The amount of memory space required by the algorithm is constant, regardless of the input size.
- `O(n)` - Linear space complexity. The amount of memory space required by the algorithm is directly proportional to the input size.
