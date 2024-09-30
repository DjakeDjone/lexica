# JDBC

## Persistence XML

Datei in `src/main/resources/META-INF/persistence.xml` anlegen.

```xml

<persistence-unit name="live">
    <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
    <class>live.student</class> <!-- Klasse die persistiert(gespeichert) werden soll -->
    <properties>
        <property name="hibernate.connection.driver_class" value="com.mysql.cj.jdbc.Driver"/> <!-- Treiber -->
        <property name="hibernate.connection.url" value="jdbc:mysql://localhost:3306/live"/> <!-- URL (can be in-memory) -->
        <property name="hibernate.connection.username" value="root"/> <!-- username -->
        <property name="hibernate.connection.password" value="root"/> <!-- password -->
        <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL5Dialect"/>
        <property name="hibernate.hbm2ddl.auto" value="update"/> <!-- update means it will create table if not exist -->
        <property name="hibernate.show_sql" value="true"/> <!-- show sql query in console -->
        <property name="hibernate.format_sql" value="true"/> <!-- format sql query in console -->
    </properties>
</persistence-unit>

```

### Entity Klasse

Die Klasse die persistiert werden soll, muss mit `@Entity` annotiert werden.

```java

@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
     Column(name = "nick",
            nullable = false,
            length = 50, // max length, longer strings will be truncated
            unique = true);
    private String nickname;
    private String email;
}

```

```java

public class StudentApp {
    public static void main(String[] args) {
        
        try (EntityManagerFactory emf = Persistence.createEntityManagerFactory("live");
                EntityManager em = emf.createEntityManager()) {

            em.getTransaction().begin();
            Student student = new Student();
            student.setName("John Doe");
            student.setEmail("doe@mail.com");
            em.persist(student);
            em.getTransaction().commit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

## in-memory Datenbank vs. persistente Datenbank

- in-memory Datenbank: Daten werden nur im Arbeitsspeicher gespeichert und gehen verloren, wenn das Programm beendet wird.
- persistente Datenbank: Daten werden auf der Festplatte gespeichert und bleiben erhalten, auch wenn das Programm beendet wird.

### setup

Um eine in-memory Datenbank zu verwenden, muss die `persistence.xml` Datei angepasst werden. Die URL muss auf `jdbc:h2:mem:test` gesetzt werden.

```xml

<property name="hibernate.connection.url" value="jdbc:h2:mem:test"/>

```

Alternativ kann auch eine persistente Datenbank verwendet werden. Dazu muss die URL auf `jdbc:h2:~/test` gesetzt werden.

```xml
<property name="hibernate.connection.url" value="jdbc:h2:~/test"/>
```

## Relationships

- OneToOne `@OneToOne`
- OneToMany `@OneToMany`
- ManyToOne `@ManyToOne`
- ManyToMany `@ManyToMany`

```java
@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String email;
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;
    @OneToMany
    private List<Course> courses;
    @ManyToOne
    private University university;
    @ManyToMany
    private List<Professor> professors;

}
```

```java
@Getter
@Setter
@Entity
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String street;
    private String city;
    private String zip;
}
```

```java
@Getter
@Setter
@Entity
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String street;
    private String city;
    private String zip;
}
```

## Persistenz

- `em.persist()`: Objekt in die Datenbank speichern
- `em.find()`: Objekt aus der Datenbank laden
- `em.merge()`: Objekt in der Datenbank aktualisieren
- `em.remove()`: Objekt aus der Datenbank löschen

```java

public class StudentApp {
    public static void main(String[] args) {
        
        try (EntityManagerFactory emf = Persistence.createEntityManagerFactory("live");
                EntityManager em = emf.createEntityManager()) {

            em.getTransaction().begin();
            Student student = new Student();
            student.setName("John Doe");
            student.setEmail("doe.john@mail.com");
            em.persist(student); // write to database
            em.getTransaction().commit(); 
        }
    }
}
    
```

> ### Transient
>
> Ein Objekt ist transient, wenn es nicht in der Datenbank gespeichert ist.

### Persistenz und Relationships

```java

public class StudentApp {
    public static void main(String[] args) {
        
        try (EntityManagerFactory emf = Persistence.createEntityManagerFactory("live");
                EntityManager em = emf.createEntityManager()) {

            em.getTransaction().begin();
            Student student = new Student();
            student.setName("John Doe");
            student.setEmail("john@doe.com");

            Address address = new Address();
            address.setStreet("Main Street");
            address.setCity("New York");
            address.setZip("10001");

            student.setAddress(address); // relationship
            em.persist(student); // write to database
            em.getTransaction().commit();
            em.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
    
```
