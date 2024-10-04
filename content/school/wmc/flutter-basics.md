# Flutter Basics

## Syntax

### Class Declaration

```dart
class MyClass {
    // class members
    late String name; // late = initialized later
    int age = 0; // initialized immediately
}
```

### Array Streaming

```dart
void main() {
  List<int> list = [1, 2, 3, 4, 5];
  list.forEach(print); // 1 2 3 4 5
  list.reversed.forEach(print); // 5 4 3 2 1
  list.map((e) => e * 2).forEach(print); // 2 4 6 8 10
}

```

### Functions with default values

```dart
void calcArea({int length = 5, int width = 6}) {
  print(length * width);
}
```

### Operators

```dart
void main() {
    a = 5 ~/ 2; // =2
    b = 3 | 2; // =3 (OR Binary)
    c = 3 ^ 2; // =1 (XOR Binary)
    d = 3 & 2; // =2 (AND Binary)
}
```

## Widgets

Widgets sind die grundlegenden Bausteine einer Flutter-App. Jede UI-Komponente ist ein Widget. Widgets können sich selbst aktualisieren, wenn sich ihre Daten ändern.

### Stateless Widget

Ein Stateless Widget ist ein Widget, dessen Inhalt nicht verändert werden kann. Es wird verwendet, wenn der Inhalt des Widgets nicht von externen Faktoren abhängt.

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text('Hello World'),
    );
  }
}
```

### Singelton

Wenn Sie eine Klasse erstellen, die nur eine Instanz haben soll, können Sie das Singleton-Muster verwenden.

```dart
class Singleton {
  static Singleton? _instance;

  factory Singleton() {
    if (_instance == null) {
      _instance = Singleton._internal();
    }
    return _instance!;
  }

  Singleton._internal();
}
```

### Future

Ein Future ist ein Objekt, das einen Wert zurückgibt, der in Zukunft verfügbar sein wird. Es wird verwendet, wenn eine Funktion asynchron ist und einen Wert zurückgibt, der in Zukunft verfügbar sein wird.

```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Hello World';
}
```

### Stream

Ein Stream ist eine Sequenz von Ereignissen, die in Zukunft auftreten können. Es wird verwendet, wenn eine Funktion asynchron ist und eine Sequenz von Werten zurückgibt, die in Zukunft verfügbar sein werden.

```dart
Stream<int> countDown(int from) async* {
  for (int i = from; i >= 0; i--) {
    yield i;
  }
}
```

## Navigation

- **Navigator.push()**: Navigiert zu einer neuen Seite.
- **Navigator.pop()**: Schließt die aktuelle Seite und kehrt zur vorherigen Seite zurück.

```dart
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);
```

## State Management

State Management ist ein wichtiger Aspekt der Flutter-Entwicklung. Es ermöglicht Ihnen, den Zustand Ihrer App zu verwalten und zu aktualisieren.

### Provider

Provider ist eine einfache und effektive Möglichkeit, den Zustand Ihrer App zu verwalten. Es ermöglicht Ihnen, Daten zwischen Widgets zu teilen, ohne den Zustand jedes einzelnen Widgets manuell zu verwalten.

```dart
class Counter with ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}
```

---
---

## Routing

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => Counter(),
      child: MaterialApp(
        home: MyHomePage(),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => MyHomePage(),
        '/second': (context) => SecondPage(),
      },
    );
  }
}

```
