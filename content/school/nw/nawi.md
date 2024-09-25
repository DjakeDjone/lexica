# Schwingungen

Periodischer Vorgang, der relgelmässig wiederholt wird. Kann, muss aber nicht mit Bewegung zu tun haben. (z.B. Magnetismus).

## Periodendauer $T$ und Frequenz $f$

Die kürzeste Zeit, zwischen zwei exakt gleichen Zuständen, wird als Periodendauer $T$ bezeichnet. Die Frequenz $f$ ist die Anzahl der Schwingungen pro Sekunde.
$$f = \frac{1}{T}$$

## Winkelgeschwindigkeit $\omega$

Die Winkelgeschwindigkeit $\omega$ gibt an, wie schnell sich ein Objekt um einen bestimmten Winkel dreht. Sie wird in $s^{-1}$ gemessen.
$$\omega = 2\pi f = \frac{2\pi}{T} = \frac{\Delta \phi}{\Delta t}$$
Schwingung, Funktion y, siehe Buch.
$$
y(t)=2\sin \left( \frac{2\pi}{4} t + \frac{\pi}{6} \right)
$$
wie kommt man auf $\frac{\pi}{6}$ ?
$(ax+b)$ vs $a(x+b)$
$\frac{2\pi}{4}\left( x+\frac{1}{3} \right)$
wenn man eine abbildung hat, und $a*\sin (bx+c)+d$ ablesen muss, bedenken dass man a, b und d ablesen kann, c nicht, wenn man $a(x+b)$ nimmt, kann man den "offset" in vielfachen der schwingung sehen

## ka

Oszillator: ein schwingungsfähiges system
harmonischer Oszillator: ein Oszillator bei dem die Bewegung durch eine Sinus(Kosinus))-Funktion beschrieben werden kann.

## Federpendel

![Oszilation img.](images/oszilatoin.png)

eine Feder ist ein harmonischer Oszillator, wenn sie elastisch ist. Die **Federkonstante** gibt an, wie stark die Feder ist. <mark>Je weiter die Feder vom Gleichgewichtszustand entfernt ist, desto stärker ist die Rückstellkraft.</mark>

eine Feder ist ein harmonischer Oszillator, wenn sie elastisch ist. Die Federkonstante gibt an, wie stark die Feder ist. Je weiter die Feder vom Gleichgewichtszustand entfernt ist, desto stärker ist die Rückstellkraft.

**Formel** zur Berechnung der Frequenz $f$ eines Federpendels:

$$
f = \frac{1}{2\pi} \sqrt{\frac{k}{m}}
$$

- $f$: Frequenz (Schwingungen pro Sekunde)
- $k$: Federkonstante (N/m)
- $m$: Masse (kg)

> Erklärung: Die Frequenz $f$ ist umgekehrt proportional zur Wurzel der Masse $m$ und der Federkonstante $k$.
> d.h. je grösser die Masse oder die Federkonstante, desto kleiner die Frequenz.

## Pendel

Ein Pendel funktioniert mithilfe der Schwerkraft. Die **Pendellänge** $l$ ist die Distanz zwischen dem Aufhängepunkt und dem Schwerpunkt des Pendels. Die **Pendelmasse** $m$ ist die Masse des Pendels.

**Formel** zur Berechnung der Frequenz $f$ eines Pendels ist gleich der Frequenz eines Federpendels:

$$
f = \frac{1}{2\pi} \sqrt{\frac{g}{l}}
$$

- $f$: Frequenz (Schwingungen pro Sekunde)
- $g$: Erdbeschleunigung (m/s^2)
- $l$: Pendellänge (m)

\
**Beispiel**:
Ein Turm in Taipeh, Taiwan, besitzt ein Pendel zur Stabilisierung. Die Pendellänge beträgt 14m und das GEwicht 660 Tonnen.

Berechne die Frequenz des Pendels.

**Lösung**:

- g = 9.81 m/s^2
- l = 14m

$$
f = \frac{1}{2\pi} \sqrt{\frac{9.81}{14}} = 0.13 Hz
$$

Für die Periodendauer ergibt das: $T = \frac{1}{f} = 7.5s$

---

\
\

::question

question: "Was ist die Formel zur Berechnung der Frequenz eines Federpendels?"
answers: [
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{k}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{l}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{g}{l}}"
]
correct: 0

::

::question

question: "Was ist die Formel zur Berechnung der Frequenz eines Pendels?"
answers: [
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{k}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{m}{l}}$",
  "$f = \\frac{1}{2\\pi} \\sqrt{\\frac{g}{l}}"
]
correct: 3

::

::question

question: "Was ist die Einheit der Federkonstante?"
answers: [
  "N/m",
  "kg",
  "m/s^2",
  "Hz"
]
correct: 0

::
