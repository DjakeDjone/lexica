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
    private String name;
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


