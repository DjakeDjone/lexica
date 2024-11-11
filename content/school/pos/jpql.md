# JPQL

## Layered Architecture

- Domain Model
- Repository
- Service
- Controller

### Domain Model

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String email;
}
```

### Repository

The repository is an abstraction of the database. It provides CRUD operations.

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByName(String name);
}
```

### Service

The service is the business logic. It can use multiple repositories. It can also use other services.

```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Student> findByName(String name) {
        return studentRepository.findByName(name);
    }
}
```

### Controller

The controller is the entry point of the application. It handles HTTP requests.

```java
@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;
    
    @GetMapping("/students")
    public List<Student> findByName(@RequestParam String name) {
        return studentService.findByName(name);
    }
}
```

## JPQL Synthax

### Selecting objects

```java
public OptionalDouble getAvgSpeed(Runner runner,EntityManager em) {
    var q = em.createQuery("""
        SELECT sum(km)*60/sum(r.minutes) as min FROM Run r WHERE true""", runner)
    ...
}
```

## Pre-Remove

```java
@PreRemove
@PreUpdate
@PrePersist
public void beforeAnyChange() {
    System.out.println("Before any change");
}

@PostRemove
@PostUpdate
@PostPersist
public void afterAnyChange() {
    System.out.println("After any change");
}
```

## Selects

### new Objects

```java
public List<Runner> getRunners(EntityManager em) {
    var q = em.createQuery("""
        SELECT new Runner(r.name, sum(km)*60/sum(r.minutes)) FROM Run r WHERE true GROUP BY r.name""", Runner.class)
    ...
}
```

## Embeddable

Embeddable classes are used to group fields together.

```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String zip;
}
```

### @EmbeddaedId

```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String zip;
}

@Entity
public class Person {
    @EmbeddedId
    private Address address;
    private String name;
}
```

## Inheritance

There are three types of inheritance in JPA:

- Single Table
- Joined
- Table Per Class

### Single Table

In single table inheritance, all the classes are stored in the same table.

### Joined

In joined inheritance, each class is stored in its own table.

### Table Per Class

In table per class inheritance, each class is stored in its own table.

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
}
