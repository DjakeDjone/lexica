# DSAI Test 20.02.2025

## Convolution

### Was macht Convolution?

Convolution kombiniert viele Filter. Ein Filter ist eine kleine Matrix, die über das Bild geschoben wird, um Merkmale zu extrahieren. Es hilft dabei, wichtige Informationen aus Bildern zu erkennen, wie Kanten, Formen und Texturen.

### Was lernt Convolution?

Convolution lernt die tunable Weights der Filter.

### Warum existieren 1x1 Convolutions?

1x1 Convolution sieht in die tiefe eines Bildes, um die Anzahl der Kanäle zu reduzieren oder zu erhöhen, ohne die räumlichen Dimensionen zu verändern. Es ermöglicht die Kombination von Informationen aus verschiedenen Kanälen und hilft dabei, die Rechenkosten zu reduzieren.

Einfach erklärt: 1x1 Convolution ist ein Filter, der nur mehrere Kanäle kombiniert, ohne die Größe des Bildes zu verändern.

## Wie funktioniert Transfer Learning?

Die Weights eines vortrainierten Modells werden eingefroren und als Ausgangspunkt für ein neues Modell verwendet, das auf einer neuen Aufgabe trainiert wird. Es ermöglicht die Nutzung von bereits gelernten Merkmalen und beschleunigt den Lernprozess.

```python
model = Sequential()
# Laden des vortrainierten VGG16-Modells ohne die Top-Schichten
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Einfrieren der vortrainierten Weights
model.add(base_model)
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dense(10, activation='softmax'))  # Neue Klassifikationsschicht
```

## Transformer

### 1. Tokenizen

Text wird zu Zahlen umgewandelt (integer)

einfaches encoding ist einfach die Position des Buchstabens im Alphabet, z.B. a=1, b=2, c=3, ...

### 2. Embedding

quasi One-Hot-Encoding mit Matrixmultiplikation

Output ist ein Vektor für jeden Token

### 3. Positional Encoding

Warum: Transformer haben keine eingebaute Reihenfolge, daher müssen wir die Position der Tokens im Satz angeben.

Beispiel:

"Der grüne Piranya fraß den gelben Piranya."

Ohne Positional Encoding könnte der Transformer die beiden Piranyas nicht unterscheiden, da sie das gleiche Wort sind. Mit Positional Encoding kann der Transformer erkennen, dass der erste Piranya grün und der zweite gelb ist.

### Attention

Warum: Um die Beziehung zwischen verschiedenen Tokens zu verstehen, unabhängig von ihrer Position im Satz.

Beispiel:
"Der grüne Piranya fraß den gelben Piranya."
Der Transformer kann durch Attention erkennen, dass der erste Piranya das Subjekt ist und der zweite Piranya das Objekt, auch wenn sie weit voneinander entfernt sind.

#### Warum gehen 4 Pfeile von Positional Encoding weg?

- 3 Pfeile wegen Key, Query und Value
- 1 Pfeil wegen Residual Connection

> Residual Connection: Eine Verbindung, die die Ausgabe einer Schicht direkt zur nächsten Schicht weiterleitet, um den Informationsfluss zu verbessern und das Problem des vanishing gradient zu reduzieren. Einfach erklärt: Es ist wie eine Abkürzung, die es ermöglicht, dass Informationen schneller durch das Netzwerk fließen.

## Fragen

### What is the main advantage of Max Pooling in a CNN?

It reduces the spatial dimensions of the input, which helps to decrease the computational cost and also helps to make the model more robust to small translations in the input.
