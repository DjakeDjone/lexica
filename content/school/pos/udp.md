# UDP in Java

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
