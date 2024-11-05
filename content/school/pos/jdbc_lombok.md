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

### @EqualsAndHashCode

Generates equals() and hashCode() methods
Both because they are related (equals calls hashCode if objects are equal)

```java
@EqualsAndHashCode(callSuper = true)
public class Student extends Person {
    private int id;
    private String name;
    private String email;
}
```

---
---

# JDBC Relations

## Many-to-Many

```java
public class Movie {
    @ManyToMany
    private Collection<Actor> actors = new HashSet<>();
}
```

```java
public class Actor {
    @ManyToMany(mappedBy = "actors") 
    private Collection<Movie> movies = new HashSet<>();
}
```

## Persisting

Persisting is the process of storing an object in the database in a way that it can be retrieved later.

```java
public class MovieApp {
    public static void main(String[] args) {
        
        try (EntityManagerFactory emf = Persistence.createEntityManagerFactory("live");
                EntityManager em = emf.createEntityManager()) {

            em.getTransaction().begin();
            Movie movie = new Movie();
            movie.setTitle("Inception");
            em.persist(movie); // write to database
            em.getTransaction().commit();
        }
    }
}
```

## Lazy vs. Eager loading

- Lazy: Load only when needed
- Eager: Load immediately
- Default: Lazy (better performance)

```java
@ManyToMany(fetch = FetchType.LAZY)
private Collection<Actor> actors = new HashSet<>();
```

```java
@ManyToMany(fetch = FetchType.EAGER)
private Collection<Actor> actors = new HashSet<>();
```

### Equals and HashCode

**Problem:** Primary key is not available before persisting

**Solution:** Use business key

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Actor {
    @EqualsAndHashCode.Include
    private String name;
}
```

---

### Cascade/OrphanRemoval

- Cascade: Propagate operations
- OrphanRemoval: Remove orphans 

*(orphans = entities without parent)*

```java
class Movie {
    @ManyToMany(cascade = CascadeType.PERSIST)
    private Collection<Actor> actors = new HashSet<>();
}
```

```java
class Actor {
    @ManyToMany(orphanRemoval = true) // if actor is deleted, remove from movie
    private Collection<Movie> movies = new HashSet<>();
}
```

### @JoinTable

Customize join table

The sample below creates a table `movie_actor` with columns `movie_id` and `actor_id`

```java
@JoinTable(name = "movie_actor", 
    joinColumns = @JoinColumn(name = "movie_id"),
    inverseJoinColumns = @JoinColumn(name = "actor_id"))
private Collection<Actor> actors = new HashSet<>();
```
