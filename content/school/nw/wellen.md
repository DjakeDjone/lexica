# Wellen

Eine zeitliche und räumlich periodische Ausbreitung von Schwingungen.

**Erklärung:** Eine Welle ist eine periodische(wiederkehrende) Bewegung, die sich in einem Medium ausbreitet. Die Ausbreitung erfolgt durch die Übertragung von Energie, nicht von Materie.

## Welle vs. Schwingung

Eine Schwingung ist eine periodische Bewegung, die sich nicht ausbreitet. Eine Welle ist eine periodische Bewegung, die sich ausbreitet.

Bsp. Pendel (Schwingung) vs. Wasserwelle (Welle)

## Arten von Wellen

### Transversalwellen

Schwingungsrichtung senkrecht zur Ausbreitungsrichtung. (zB. Licht)

### Longitudinalwellen

Schwingungsrichtung parallel zur Ausbreitungsrichtung. (zB. Schall)

## Wellengleichung

$$
y(x,t) = A \cdot \sin(k \cdot x - \omega \cdot t + \varphi)
$$

- $y(x,t)$: Auslenkung
- $A$: Amplitude
- $k$: Wellenzahl
- $x$: Ort
- $\omega$: Kreisfrequenz
- $t$: Zeit
- $\varphi$: Phasenwinkel

## Schwebung

Wenn zwei Wellen mit leicht unterschiedlichen Frequenzen aufeinandertreffen, entsteht eine Schwebung. Die Amplitude der Schwebung ist die Differenz der beiden Frequenzen.

## Ausbreitungsgeschwindigkeit

$$
v = \lambda \cdot f
$$

- $v$: Geschwindigkeit (m/s)
- $\lambda$: Wellenlänge (m)
- $f$: Frequenz (Hz)

---

## Schallwellen

ca. 340 m/s in Luft (~= 1235 km/h)

Helium hat bei der gleichen Temperatur eine deutlich höhere Ausbreitungsgeschwindigkeit als Luft. Desshalb ist bei gleicher Frequenz (Stimmbänder gleich lang) die Schallgeschwindigkeit in Helium höher als in Luft. (Kürzere Wellenlänge)

> ## Hörbereich
>
> 16 Hz - 20 kHz

- **Schalldruck**: Druckunterschiede in der Luft, die durch Schallwellen entstehen.
- **Schallintensität**: Energie, die pro Zeiteinheit durch eine Fläche hindurchtritt. (W/m²)
- **Schallpegel**: Maß für die Lautstärke eines Schalls. (dB)

### Phon

Phon ist im Gegensatz zu Dezibel ein Maß für die Lautstärke, das sich an der Empfindung des **menschlichen Gehörs** orientiert.

Bei 1kHz entspricht 1 Phon 1 Dezibel. Bei anderen Frequenzen kann das Verhältnis abweichen, da das menschliche Gehör bei verschiedenen Frequenzen unterschiedlich empfindlich ist.

### Dopplereffekt

Die Frequenz einer Welle ändert sich, wenn sich die Quelle oder der Beobachter bewegt. Zum Beispiel wenn ein Rettungswagen mit Sirene an uns vorbeifährt. Die Frequenz ist höher, wenn sich die Quelle auf uns zu bewegt und tiefer, wenn sie sich von uns wegbewegt.

Grund: Die Wellenberge kommen schneller aufeinander zu, wenn sich die Quelle auf uns zu bewegt und langsamer, wenn sie sich von uns wegbewegt.

## Überschall

Ein Flugzeug fliegt mit einer Geschwindigkeit, die größer ist als die Schallgeschwindigkeit. Dadurch entsteht ein Überschallknall. Dieser entsteht, wenn die Schallwellen, die das Flugzeug erzeugt, sich nicht mehr vor dem Flugzeug ausbreiten können. Die Wellenberge überholen sich und erzeugen einen lauten Knall.

## Musik

- **Tonhöhe**: Die Frequenz eines Tons bestimmt die Tonhöhe.
- **Klang**: Ton mit Obertönen (Obertonreihe)
- **Knall**:  kurzer, intensiver Schall
- **Geräusch**: nicht harmonische Klänge oder Töne ohne Zusammenhang
- **Lautstärke**: Die Amplitude eines Tons bestimmt die Lautstärke.

### Obertonreihe

Bsp.:

`C` 128 Hz

Wenn ein Klavier die Taste `C` anschlägt, dann schwingt die Saite mit 128 Hz. Die Obertöne sind dann 256 Hz (Oktave), 384 Hz (Quinte), 512 Hz (Oktave), 640 Hz (Terz), usw.

Manche Sänger können Obertöne singen, indem sie die Resonanzfrequenz ihres Mundraums so einstellen, dass die Obertöne lauter als der Grundton werden.

### Schallpegel

Der Schallpegel ist ein Maß für die Lautstärke eines Schalls. Er wird in Dezibel (dB) angegeben.

$$
L = 10 \cdot \log_{10} \left( \frac{I}{I_0} \right)
$$

- $L$: Schallpegel (dB)
- $I$: Schallintensität (W/m²)
- $I_0$: Schallempfindungsschwelle (ca. $10^{-12}$ W/m²)

**Rechenbeispiel:**

Ein Schall hat eine Intensität von $10^{-6}$ W/m². Wie laut ist der Schall in dB? (Hinweis: die Schallempfindungsschwelle beträgt $10^{-12}$ W/m²)

$$
L = 10 \cdot \log_{10} \left( \frac{10^{-6}}{10^{-12}} \right) = 10 \cdot \log_{10} \left( 10^6 \right) = 10 \cdot 6 = 60 \text{ dB}
$$

### Schalldruckpegel

Der Schalldruckpegel ist ein Maß für die Lautstärke eines Schalls. Er wird in Dezibel (dB) angegeben. Im Gegensatz zum Schallpegel wird der Schalldruckpegel in Bezug auf den Schalldruckschwelle angegeben.

$$
L_p = 20 \cdot \log_{10} \left( \frac{p}{p_0} \right)
$$

- $L_p$: Schalldruckpegel (dB)
- $p$: Schalldruck (Pa)
- $p_0$: Schalldruckschwelle (ca. $2 \cdot 10^{-5}$ Pa)

**Rechenbeispiel:**

Ein Schall hat einen Schalldruck von $2 \cdot 10^{-3}$ Pa. Wie laut ist der Schall in dB? (Hinweis: die Schalldruckschwelle beträgt $2 \cdot 10^{-5}$ Pa)

$$
L_p = 20 \cdot \log_{10} \left( \frac{2 \cdot 10^{-3}}{2 \cdot 10^{-5}} \right) = 20 \cdot \log_{10} \left( 100 \right) = 20 \cdot 2 = 40 \text{ dB}
$$
