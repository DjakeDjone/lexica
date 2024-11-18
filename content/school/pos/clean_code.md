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
