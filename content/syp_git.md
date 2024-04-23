# SYP Gitschtahler

## Themen

- [ ] [CI](#ci)
- [ ] [Continious Integration](#continious-integration)

## CI

**Ziele**:

- Verbesserung der Softwarequalität
- Beschleunigung der Entwicklung

**Anforderungen**:
- Gemeinsame Codebasis
- Automatisierter Build
- Kontinuierliche Testentwicklung
- Jede(r) commitet mindestens einmal täglich
- Continuous Integration Server
- Sofortige Problembehebung
- Jeder Commit auf mainline triggert Build und Test
- Tests in einem Production "Klon": Deploying Area nachempfunden
- jeder kann sehen was passiert

**CI Tooling**:

- Build management tool (maven/gradle)
- CI Server (Jenkins, Bamboo, Travis CI, GitLab CI, GitHub Actions)

## Continious Integration

**Ideen**:

- Alle EntwicklerInnen arbeiten an einem Strang
- gemeinsame Sicht auf Code
- Änderungen werden schnell übernommen
- hohe u. automatisierte Testabdeckung

## Gitlab Pipelines

**Bestehen aus**:
- Jobs: WAS tun
- Stages: WANN tun

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