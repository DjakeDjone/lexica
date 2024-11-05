# 1. Pos Test

## Themen

- [TCP UDP Server](#tcp-udp-server)
  - [Klassen](#klassen)
  - [TCP Server](#tcp-server)
  - [Client](#client)
  - [UDP Server](#udp-server)
  - [UDP Client](#udp-client)
- [JPA](#jpa)
- [Thread Pools](#thread-pools)

## TCP UDP Server

### Klassen

- `ServerSocket` (TCP Server)
- `Socket` (TCP Client)
- `DatagramSocket` (UDP Server & Client)
- `DatagramPacket` (UDP Server & Client)
- `InetAddress` (UDP Client)

### TCP Server

```java
public class TcpServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8080)) {
            System.out.println("Server started on port 8080");
            while (true) {
                try (Socket clientSocket = serverSocket.accept()) {
                    System.out.println("Client connected");
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                         BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(clientSocket.getOutputStream()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            System.out.println("Received: " + line);
                            writer.write("Echo: " + line + "\n");
                            writer.flush();
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Client

```java
public class TcpClient {
    public static void main(String[] args) {
        try (Socket socket = new Socket("localhost", 8080);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))) {
            writer.write("Hello\n");
            writer.flush();
            System.out.println("Received: " + reader.readLine());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### UDP Server

```java
public class UdpServer {
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket(8080)) {
            System.out.println("Server started on port 8080");
ws            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            while (true) {
                socket.receive(packet);
                System.out.println("Received: " + new String(packet.getData(), 0, packet.getLength()));
                socket.send(new DatagramPacket(packet.getData(), packet.getLength(), packet.getAddress(), packet.getPort()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### UDP Client

```java
public class UdpClient {
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket();
             BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            InetAddress address = InetAddress.getByName("localhost");
            byte[] buffer = new byte[1024];
            while (true) {
                System.out.print("Message: ");
                String line = reader.readLine();
                DatagramPacket packet = new DatagramPacket(line.getBytes(), line.length(), address, 8080);
                socket.send(packet);
                socket.receive(new DatagramPacket(buffer, buffer.length));
                System.out.println("Received: " + new String(buffer, 0, buffer.length));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## JPA

### EAGER vs. LAZY

- EAGER: Lädt alle verknüpften Objekte sofort, unperformant aber einfach
- LAZY: Lädt verknüpfte Objekte erst, wenn darauf zugegriffen wird

### Beispiel

```java
@Entity
public class Person {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "person")
    // mappedBy: Name des Attributs in der verknüpften Klasse
    private List<Address> addresses;
}
```

```java
@Entity
public class Address {
    @Id
    @GeneratedValue
    private Long id;
    private String street;
    private String city;
    @ManyToOne(fetch = FetchType.EAGER)
    private Person person;
}
```

### Verwendung

```java
public class Main {
    public static void main(String[] args) {
        EntityManagerFactory factory = Persistence.createEntityManagerFactory("jpa");
        EntityManager manager = factory.createEntityManager();
        EntityTransaction transaction = manager.getTransaction();
        transaction.begin();
        Person person = new Person();
        person.setName("Max Mustermann");
        Address address = new Address();
        address.setStreet("Musterstraße 1");
        address.setCity("Musterstadt");
        address.setPerson(person);
        person.setAddresses(Collections.singletonList(address));
        manager.persist(person); // Speichert Person und Adresse
        transaction.commit();
        manager.close();
        factory.close();
    }
}
```

## Thread Pools

- `ExecutorService` verwaltet Threads
- `Executors` erzeugt `ExecutorService`-Instanzen

### Beispiel (FixedThreadPool)

```java
public class Main {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(4);
        for (int i = 0; i < 10; i++) {
            executor.submit(() -> {
                System.out.println("Thread: " + Thread.currentThread().getName());
            });
        }
        executor.shutdown();
    }
}
```
