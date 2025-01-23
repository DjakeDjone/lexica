# Design Patterns

- **Singleton**
- **Proxy**
- **Strategy**: Definiert eine Familie von Algorithmen, kapselt sie und macht sie austauschbar.
- **Decorator**: Erweitert die Funktionalität einer Klasse, ohne die Klasse selbst zu ändern. z.B. durch Vererbung oder Komposition.
- **Observer**: Definiert eine Abhängigkeit zwischen Objekten, sodass Änderungen an einem Objekt den anderen Objekten mitgeteilt werden.
- **Builder**: Trennt die Konstruktion eines komplexen Objekts von seiner Repräsentation. z.B. AutoBuilder mit verschiedenen Implementierungen.
- **Factory**: Erzeugt Objekte, ohne den genauen Typ und die genaue Implementierung zu kennen. z.B. EmailFactory mit verschiedenen Implementierungen.
- **Adapter**: Ähnlich wie Proxy-Pattern, aber mit anderem Ziel. Adapter-Pattern passt die Schnittstelle eines Objekts an eine andere Schnittstelle an, sodass zwei unabhängige Schnittstellen zusammenarbeiten können.
- **Visitor**:

## Singleton

Jede Klasse kann nur ein einziges Objekt haben. Das Singleton-Pattern stellt sicher, dass nur eine Instanz einer Klasse existiert und bietet einen globalen Zugriffspunkt zu dieser Instanz.

```python
class Singleton:
    __instance = None

    @staticmethod
    def get_instance():
        if Singleton.__instance is None:
            Singleton()
        return Singleton.__instance

    def __init__(self):
        if Singleton.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            Singleton.__instance = self
```

## Proxy

Das Proxy-Pattern stellt ein Objekt bereit, das als Platzhalter für ein anderes Objekt fungiert. Es ermöglicht die Kontrolle des Zugriffs auf das Originalobjekt, indem es die Methoden des Originalobjekts aufruft.

```python
class RealSubject:
    def request(self):
        print("RealSubject: Handling request.")

class Proxy:
    def __init__(self, real_subject):
        self._real_subject = real_subject

    def request(self):
        if self.check_access():
            self._real_subject.request()
            self.log_access()

    def check_access(self):
        print("Proxy: Checking access prior to firing a real request.")
        return True

    def log_access(self):
        print("Proxy: Logging the time of request.")
```

## Visitor

Das Visitor-Pattern ermöglicht es, eine neue Operation zu einer Klasse hinzuzufügen, ohne die Klasse selbst zu ändern. Es trennt die Operation von der Klasse, auf die sie angewendet wird.

Beispiel Shape:

```java
interface Shape {
    void calculateArea();
}

class Circle implements Shape {
    @Override
    public void calculateArea() {
        System.out.println("Calculating area of Circle.");
    }
}

class Rectangle implements Shape {
    @Override
    public void calculateArea() {
        System.out.println("Calculating area of Rectangle.");
    }
}

class AreaVisitor {
    public void visit(Circle circle) {
        circle.calculateArea();
    }

    public void visit(Rectangle rectangle) {
        rectangle.calculateArea();
    }
}
```
