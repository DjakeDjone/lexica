# Flutter Advanced

## Stateful vs. Stateless Widgets

Ein Stateful Widget ist ein Widget, dessen Inhalt sich ändern kann. Es wird verwendet, wenn der Inhalt des Widgets von externen Faktoren abhängt.

```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  int counter = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          Text('Counter: $counter'),
          ElevatedButton(
            onPressed: () {
              setState(() {
                counter++;
              });
            },
            child: Text('Increment'),
          ),
        ],
      ),
    );
  }
}
```

### Refresher

Wenn Sie ein Widget aktualisieren möchten, verwenden Sie die `setState`-Methode. Diese Methode informiert das Framework, dass sich der interne Zustand des Widgets geändert hat und das Widget neu gezeichnet werden muss.

Falls der Zustand des Widgets von externen Faktoren abhängt, können Sie die `didUpdateWidget`-Methode überschreiben, um auf Änderungen zu reagieren.

```dart
class MyWidget extends StatefulWidget {
  final int value;

  MyWidget({required this.value});

  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  int counter = 0;

  @override
  void didUpdateWidget(covariant MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      setState(() {
        counter = widget.value;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          Text('Counter: $counter'),
          ElevatedButton(
            onPressed: () {
              setState(() {
                counter++;
              });
            },
            child: Text('Increment'),
          ),
        ],
      ),
    );
  }
}
```
