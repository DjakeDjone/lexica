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
