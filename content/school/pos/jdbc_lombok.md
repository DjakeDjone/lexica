# Lombok

Avoids writing boilerplate code

## Features

- Getter and Setter
- Constructor
- Equals and HashCode
- ToString
- Builder

### Example

```java
@AllArgsContructor @Getter @Setter @ToString
@RequiredArgsConstructor
public class Student {
    @NonNull private int id; // getId(), setId()
    private String name; // getName(), setName()
    private String email; // getEmail(), setEmail()
}
```

### @Builder

For better readability;

```java
@Builder
public class Student {
    private int id;
    private String name;
    private String email;
}

Student student = Student.builder()
    .id(1)
    .name("John")
    .email("john@doe.at")
```

### @SneakyThrows

Wraps checked exceptions in unchecked exceptions

```java
@SneakyThrows
public void read() {
    throw new IOException("File not found");
    // Will be wrapped in UncheckedIOException
}
```
