# DSAI 2. Test

## Stoff

- Regression/Klassifikation
- Bäume wie die halt funktionieren(Gini)
- Forests(wie?)
- GradientBoosting(wie?)
- train-test-split
- Cross Validation
- tuning
- stratification
- preprocessing
- Evaluierung(mse, accuracy, precision, recall)

## Theorie

### Gewichten

| 1 | 2 | 3
| -- | - | -
| 7 | 5 | 6
| 0 | 3 | 4

#### Accuracy

$$
\text{accuracy} = \frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}
$$

Bei dem Beispiel:
$$
\text{accuracy} = \frac{7 + 3}{7 + 3 + 5 + 6} = \frac{10}{21} \approx 0.476
$$

#### Precision

$$
\text{precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}
$$
Bei dem Beispiel:
$$
\text{precision} = \frac{7}{7 + 5} = \frac{7}{12} \approx 0.583
$$

#### Recall

$$
\text{recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}
$$
Bei dem Beispiel:
$$
\text{recall} = \frac{7}{7 + 6} = \frac{7}{13} \approx 0.538
$$
