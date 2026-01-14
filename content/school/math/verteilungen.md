# Verteilungen

## Geometrische Verteilung

X... Anzahl der Wiederholungen bis A zum 1. Mal eintritt **gleichbleibende Wahrscheinlichkeit p**

> Ziehen **MIT** Zurücklegen

$$
P(X = k) = (1 - p)^{k - 1} \cdot p
$$
$$
E(X) = \frac{1}{p}
$$

- $p$: Wahrscheinlichkeit, dass A eintritt
- $k$: Anzahl der Wiederholungen bis A zum 1. Mal eintritt

## Hypergeometrische Verteilung

X... Anzahl der Elemente *in der Stichprobe*, die das Merkaml A aufweisen

> Ziehen **ohne** Zurücklegen

$$
P(X = k) = \frac{\binom{M}{k} \cdot \binom{N - M}{n - k}}{\binom{N}{n}}
$$

$$
E(X) = n \cdot \frac{M}{N}
$$

- $M$: günstige (Anzahl mit Merkmal A)
- $N$: alle (Gesamtanzahl)
- $n$: Versuche (Stichprobenumfang)
- $k$: wie viele (Anzahl mit Merkmal A in der Stichprobe)

## Binomialverteilung

X... Anzahl der Erfolge in n unabhängigen Bernoulli-Versuchen

> Ziehen **MIT** Zurücklegen

$$
P(X = k) = \binom{n}{k} \cdot p^k \cdot (1 - p)^{n - k}
$$
$$
E(X) = n \cdot p
$$

- $n$: Anzahl der Versuche
- $k$: Anzahl der Erfolge
- $p$: Wahrscheinlichkeit für Erfolg bei einem Versuch

## Poissonverteilung

X... Eintrittshäufigkeit eines Ereignisses in einem Raum- oder Zeitintervall.

Die Poissonverteilung ist **NUR** vom Durchnittswert λ (E(X)) abhängig, mit der das Ereignis üblicherweise pro Intervall auftritt.

$$
P(X = k) = \frac{\mu^k}{k!} \cdot e^{-\lambda}
$$
$$
E(X) = \mu
$$

- $k$: Anzahl der Ereignisse im Intervall
- $\mu$: Durchschnittliche Anzahl der Ereignisse pro Intervall
