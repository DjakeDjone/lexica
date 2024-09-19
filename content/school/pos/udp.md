# UDP in Java

Pro: Performant and Low Latency
Con: Unreliable, No Guarantee of Delivery

## Client

```java

private void printTime() {
    try (DatagramSocket socket = new DatagramSocket()) {
        //empty request is enough
        DatagramPacket request = new DatagramPacket(new byte[1], 1, InetAddress.getByName("time.nist.gov"), 13);
        socket.send(request);

        // get response
        byte[] buffer = new byte[1024];
        DatagramPacket response = new DatagramPacket(buffer, buffer.length);
        socket.receive(response);
        System.out.println(new String(response.getData(), 0, response.getLength()));
    } catch (IOException e) {
        e.printStackTrace();
    }
}

```

## Server

This example is a simple, not multi-threaded server that listens on port 13 and sends the current time to the client.

```java

private void run() {
    try (DatagramSocket socket = new DatagramSocket(13)) {
        while (true) {
            // receive request
            byte[] buffer = new byte[1024];
            DatagramPacket request = new DatagramPacket(buffer, buffer.length);
            socket.receive(request);

            // send response
            String time = new Date().toString();
            byte[] data = time.getBytes();
            DatagramPacket response = new DatagramPacket(data, data.length, request.getAddress(), request.getPort());
            socket.send(response);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}

```

To run this multi-threaded, you can create a new thread for each request. Problem: The server can be easily overloaded with too many requests. A better solution is to use a thread pool. (See [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html))

```java

private void run() {
    ExecutorService pool = Executors.newFixedThreadPool(10); // 10 threads
    try (DatagramSocket socket = new DatagramSocket(13)) {
        while (true) {
            // receive request
            byte[] buffer = new byte[1024];
            DatagramPacket request = new DatagramPacket(buffer, buffer.length);
            socket.receive(request);

            // send response
            // will block until a thread is available
            pool.submit(new TimeTask(socket, request));
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
