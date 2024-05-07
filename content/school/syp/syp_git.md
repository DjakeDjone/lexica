# SYP Gitschtahler

## Stoff

Allgemein Stoff für den 2ten Test sind die Foliensätze 02 (Software Architektur), 04 (CI/CD) komplett sowie der Foliensatz 05 (Entwurfsprinzipien) bis Seite 15 (inkl.) also Information Hiding
Hinweis: sie müssen/sollen die Gitlab pipeline Syntax nicht auswendig lernen, aber sollten gegebene pipeline Files "verstehen" also z.B den Unterschied zwischen Jobs und Stages.

## Themen

- [ ] [Software Architektur](#software-architektur)
- [ ] [SW Architektur Entwurf Prinzipien](#sw-architektur-entwurf-prinzipien)
- [ ] [CI](#ci)
- [ ] [Test A Klasse](#test-a-klasse)

## Software Architektur

**3 Ziele der Softwarearchitektur:**

- Gliederung in *überschaubare Einheiten*:
  - *Kontrollierbarkeit* der Komplexität

- Festlegen einer *zweckmäßigen Lösungsstruktur*:
  - Strukturen sind schwer änderbar
  - großer **Einfluss** auf **Effizienz u. Wartbarkeit**

- Hirarchische *Organisation der Komponenten*:
  - Miller sagte ein Mensch kann max. 7+/-2 Informationen im Kurzzeitgedächnis merken
  - Hirarchien ab 7+/-2 werden ineffizient
  - bietet Möglichkeit der Abstraktion

**Entwicklungsrichtung:**

- **Top-Down**: (standard, z.B. **Wasserfallmodell**)
  - von **allgemein** zu **spezifisch**
  - **Vorteil**: **Übersichtlichkeit**
  - **Nachteil**: **Detailtiefe** wird **vernachlässigt**

- **Bottom-Up**:
  - von **spezifisch** zu **allgemein**
  - **Vorteil**: **Detailtiefe** wird **berücksichtigt**
  - **Nachteil**: **Übersichtlichkeit** wird **vernachlässigt**

- **Outside-in**: (z.B. **Agile Entwicklung**)
  - **Oberfläche zuerst** (UI), dann **darunterliegende Schichten**

- **Inside-out**:
  - **Kern** zuerst, dann **darüberliegende Schichten**

**In der Praxis**:

- Kombination der Ansätze
- Oft aus Bequemlichkeit nicht **konsequent** umgesetzt

```text
Begriffe:
# System: Einheit aus Komponenten
# Komponente: Einheit aus Modulen
# Modul: Einheit aus Klassen
# Schnittstelle: definiert Kommunikation
# Entwurf: Planung der Softwarearchitektur
# Architektur: Strukturierung des Entwurfs
```

**4 Perspektiven der Softwarearchitektur:**

- **Systemperspektive**: Wie System in Umgebung eingebettet ist u. mit dieser interagiert
- **Statistische Perspektive**: Strukturierung des Systems in Komponenten
- **Dynamische Perspektive**: Verhalten des Systems zur Laufzeit
- **Verteilungsperspektive**: Verteilung der Komponenten auf Infrastruktur

## SW Architektur Entwurf Prinzipien

**SW Architektur ist gut wenn**:

- <mark>funktionale:</mark> Anforderungen: **Was** ein System leisten soll
- <mark>nicht funktionale:</mark> Anforderungen: **Wie** ein System leisten soll

**Modularisierung**:

- **Zerlegung** in **Module** (Klassen, Pakete, Komponenten)
- **hoch**, wenn Komponenten
    - verändert u.
    - weiterentwickelt werden können

**Modularten:**

- **Funktionale Module**: gruppiert Berechnungen, die *logisch zusammengehören*
- **Datenobjekt Module**: Datenkapselfunktionen, Schnittstelle zu Daten
- **Datentypmodule**: Definition von Datentypen (z.B. Klassen, JS Typs)

**Kohäsion**:

- **Grad**, in dem **Elemente** eines **Moduls** zusammengehören
- **Hoch**, wenn Elemente
    - **zusammengehören** u.
    - **gemeinsames Ziel** verfolgen
- Wieso? **Wartbarkeit**, **Erweiterbarkeit**, **Testbarkeit**
- **LCOM**: Anzahl der Methodenpaare, die keine gemeinsamen Attribute verwenden

**LCOM Berechnung**:

- **LCOM** = **Anzahl** der **Methodenpaare** - **Anzahl** der **gemeinsamen Attribute**
- **LCOM** = **0**, wenn **keine** gemeinsamen Attribute
- **LCOM** = **1**, wenn **alle** Attribute **gemeinsam** verwendet werden
- **Wenn LCOM > 0**: **Modul** sollte **aufgeteilt** werden

**Kopplung**:

Wieso geringe Kopplung? **Flexibilität**, **Wiederverwendbarkeit**, **Robustheit**

**Information Hiding**:

- **Verbergen** von **Implementierungsdetails**
- **Vorteile**: **Änderungen** in **Implementierung** haben **keine Auswirkungen** auf **andere Module**
- Implementierung: getter/setter, private Methoden, Interfaces

## CI

**Ziele**:

Grundidee: Vermeidung des `Works on my machine`-Syndroms

- Verbesserung der Softwarequalität
- Beschleunigung der Entwicklung

**Anforderungen**:

- **Gemeinsame Codebasis**: Jeder commitet auf mainline
- **Automatisierter Build**: Jeder commit triggert Build
- **Kontinuierliche Testentwicklung**: Jeder commit triggert Tests
- **Jede(r) commitet mindestens einmal täglich**

xxxxxxxxxxxxxxxxxxxxxxxxxx

- **Continuous Integration Server**: Automatisierung der Prozesse
- **Sofortige Problembehebung**
- Tests in einem Production "Klon": Deploying Area nachempfunden
- jeder kann sehen was passiert

**CI Tooling**:

- **Build management tool** (maven/gradle)
- **CI Server** (Jenkins, Bamboo, Travis CI, GitLab CI, GitHub Actions)

**Gitlab CI**:

- **.gitlab-ci.yml**-Datei im Projektverzeichnis
- **Artifacts**: Dateien, die zwischen Jobs geteilt werden
- **Merge Requests**: kann fehlschlagen, wenn CI nicht erfolgreich (z.B. Tests fehlschlagen, Codequalität nicht gegeben)

**Gitlab Pipeline**:

- **Jobs**: Was tun; werden von Runner ausgeführt; können parallel laufen; job failed -> pipeline failed
- **Stages**: Wann tun; Jobs werden in Stages gruppiert; Jobs einer Stage laufen nacheinander

**Gitlab Runner**:

- **Bauen/Testen/Deployen** von Projekten
- Self-Managed oder Shared
- **Tags**: Runner können mit Tags versehen werden, um Jobs zu filtern
- **Executor**: Shell, Docker, Kubernetes

**Sample**

```yaml
image: maven:latest

variables: # Umgebungsvariablen !Dürfen keine Passwörter enthalten!
    MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository" # Definiert Maven Repository

rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_COMMIT_BRANCH == "main"' # Wenn request von main
    - when: always # Wann tun (immer)

cache: # Cache: Zwischenspeicher für optimierte Builds
    paths:
        - .m2/repository # Maven Repository
        - target/ # Kompilierte Dateien

build: # Job
    stage: build # Stages: Wann tun
    script:
        - mvn compile
        - env | grep MAVEN # Ausgabe der Umgebungsvariablen

test: # Job
    stage: test # Stages: Wann tun
    script:
        - mvn test

```

**Code Quality**:

- **Lesbarkeit**: Code soll leicht verständlich sein
- **Wartbarkeit**: Code soll leicht änderbar sein
- **Testbarkeit**: Code soll leicht testbar sein



## Test A Klasse

SYP Fragen beim Test der anderen Klasse:

1. Wofür steht der Begriff "CI" und was ist der Hauptzweck von CI?

    A: Continous Intigration, Verbesserung der Softwarequalität und Beschleunigung der Entwicklung

2. Dan und Bob unterhalten sich, Bob ärgert sich darüber, dass sein Fix nicht ausgespielt wurde, weil Dan das Review nicht positiv abgeschlossen hat, pbwohl der Build auf Bobs Rechner lokal funktioniert hat. Welche Gründe könnte es geben?(nenne mindestens 3)

    **A: Unterschiedliche Umgebungen, Unterschiedliche Konfigurationen, Unterschiedliche Abhängigkeiten**

3. Anna und Franz wollen für ihr Java Projekt CI einführen, gemeinsam erstellen sie eine CHeckliste, was alles benötigt wird um CI sinnvoll zu implementieren?

    A: **Gitlab CI yaml file, tests, Gitlab, häufig commiten**

4.Ordne wahr falsch zu (plus1 pro richtige antw. -1 pro falsch beantwortet)

5.nenne 2 gründe, warum gitlab pipelines (und auch andere build server) auf docker setzen, um die build jobs durchzuführen
    A: **Isolation** und **Reproduzierbarkeit**

6.nenne die 3 hauptziele des softwareentwurfs
    A: **Funktionalität, Zuverlässigkeit, Effizienz**
