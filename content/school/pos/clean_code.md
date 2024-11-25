# Clean Code

## S.O.L.I.D Principles

- **Single Responsibility Principle**: Eine Klasse sollte nur eine Aufgabe haben.
- **Open/Closed Principle**: Eine Klasse sollte offen für Erweiterungen, aber geschlossen für Änderungen sein.
- **Liskov Substitution Principle**: Objekte einer Klasse sollten durch Objekte einer Subklasse ersetzbar sein.
- **Interface Segregation Principle**: Interfaces sollten spezifisch für die Klassen sein, die sie implementieren.
- **Dependency Inversion Principle**: Klassen sollten von abstrakten Klassen oder Interfaces abhängen, nicht von konkreten Klassen.

> `Regression Testing` ist wichtig, um sicherzustellen, dass Änderungen keine unerwünschten Nebenwirkungen haben.

### SRP: Single Responsibility Principle

- Eine Klasse sollte nur eine Aufgabe haben.

```java
// Bad
class GameReulst {
    public void saveGameResult() {
        // Code to save game result
    }
    
    public void sendEmail() {
        // Code to send email
    }
}
```

### OCP: Open/Closed Principle

- Eine Klasse sollte offen für Erweiterungen, aber geschlossen für Änderungen sein.

#### Drawbacks

- **Code Duplication**: Wenn die gleiche Funktionalität in mehreren Klassen vorhanden ist.
- **Code Smell**: Wenn der Code schlecht strukturiert ist.
- **Code Complexity**: Wenn der Code schwer zu verstehen ist.

### LSP: Liskov Substitution Principle

- Objekte einer Klasse sollten durch Objekte einer Subklasse ersetzbar sein. z.B. `Square` ist eine `Shape`.

### Interface Segregation Principle

- Interfaces sollten spezifisch für die Klassen sein, die sie implementieren.

```java
// Bad
interface Worker {
    void work();
    void eat();
}

// Good
interface Worker {
    void work();
}

interface Eater {
    void eat();
}
```

### DIP: Dependency Inversion Principle

- Klassen sollten von abstrakten Klassen oder Interfaces abhängen, nicht von konkreten Klassen.

```java
// Bad
class Game {
    private GameResult gameResult;
    
    public Game() {
        gameResult = new GameResult();
    }
}

// Good
class Game {
    private GameResult gameResult;
    
    public Game(GameResult gameResult) {
        this.gameResult = gameResult;
    }
}
```

---

## Software Patterns

- **Singleton Pattern**: Eine Klasse sollte nur eine Instanz haben.
- **Factory Pattern**: Eine Klasse sollte die Instanz einer anderen Klasse erstellen.
- **Proxy Pattern**: Eine Klasse sollte die Kontrolle über eine andere Klasse haben.
- **Observer Pattern**: Eine Klasse sollte über Änderungen in einer anderen Klasse informiert werden.
- **Strategy Pattern**: Eine Klasse sollte eine von mehreren Algorithmen verwenden können. z.B: eine Klasse `Sort` kann `BubbleSort`, `QuickSort`, `MergeSort` verwenden.
- **Decorator Pattern**: Eine Klasse sollte die Funktionalität einer anderen Klasse erweitern können. z.B: eine Klasse `Car` kann `CarWithAC`, `CarWithMusicSystem` sein.

---

