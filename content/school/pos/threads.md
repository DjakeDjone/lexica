# Threads - Wiederholung

## Why do we need threads?

>
> Deadlock => jeden Thread wartet auf den anderen
>
> Race Condition => mehrere Threads greifen auf die gleiche Ressource zu
>

## Threads in Java

- synchronized Methods/Blocks
- ReetrantLock
- Semaphores
- CountdownLatch

## Thread Pools

- FixedThreadPool
- CachedThreadPool
- ScheduledThreadPool
- SingleThreadPool

## Thread Communication

- wait/notify
- BlockingQueue
- Future

## Thread Safety

- Immutable Objects (keine Änderung möglich)
- Volatile (kein Caching)
- Atomic Classes (jede Operation ist atomar=unzerlegbar)
- ThreadLocal (jeder Thread hat eigene Instanz)

## Example: Producer/Consumer

```java
public class ProducerConsumer {
    public static void main(String[] args) {
        // BlockingQueue for thread communication
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);
        Thread producer = new Thread(new Producer(queue));
        Thread consumer = new Thread(new Consumer(queue));
        producer.start();
        consumer.start();
    }
}
```

```java
public class Producer implements Runnable {
    private final BlockingQueue<Integer> queue;
    public Producer(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                queue.put(i);
                System.out.println("Produced: " + i);
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

```java
public class Consumer implements Runnable {
    private final BlockingQueue<Integer> queue;
    public Consumer(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                System.out.println("Consumed: " + queue.take());
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## ExecutorService

- wird verwendet um Threads zu verwalten
- ThreadPool wird automatisch erstellt
- kann Tasks ausführen

```java
public class ExecutorServiceExample {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer();

        try (ExecutorService executor = Executors.newFixedThreadPool(10)) {
            IntStream.range(0, 10).forEach(i -> executor.submit(() -> sb.append((char) ('A' + i))));
        }

        System.out.println(sb);
    }
}
```
