# TCP

Transmission Control Protocol (TCP)

## Overview

## Header

- source port (16 bits)
- destination port (16 bits)
- sequence number (32 bits): The sequence number is used to keep track of the order of bytes sent from the sender to the receiver. It indicates the position of the first byte of data in the current segment within the overall byte stream.
- acknowledgment number (32 bits): The acknowledgment number is used to indicate the next expected byte from the sender. It is essentially the sequence number of the next byte that the receiver expects to receive.
- data offset (4 bits): The data offset field specifies the size of the TCP header in 32-bit words. This is necessary because the header may include optional fields of variable length.
- reserved (3 bits): The reserved field is currently unused and is set to zero. It is included for future expansion of the protocol.
- flags (9 bits): The flags field contains control flags that manage the state of the connection.
    - NS (1 bit)
    - CWR (1 bit)
    - ECE (1 bit)
    - URG (1 bit)
    - ACK (1 bit)
    - PSH (1 bit)
    - RST (1 bit)
    - SYN (1 bit)
    - FIN (1 bit)
- window size (16 bits)
- checksum (16 bits)
- urgent pointer (16 bits): The urgent pointer is used when the URG flag is set. It indicates the position of the last byte of urgent data in the segment, allowing the receiver to prioritize processing of this data.
- options (variable length, optional)
- padding (variable length, optional)
- data (variable length): The data field contains the actual payload being transmitted in the TCP segment. This is the application data that is being sent from the sender to the receiver. 

## Connection Establishment

TCP uses a three-way handshake to establish a connection between a client and a server. The process involves the following steps:

1. **SYN**: The client sends a TCP segment with the SYN (synchronize) flag set to the server. This segment includes an initial sequence number (ISN) chosen by the client.
2. **SYN-ACK**: The server responds with a TCP segment that has both
    the SYN and ACK (acknowledge) flags set. The acknowledgment number is set to the client's ISN + 1, and the server also chooses its own ISN.
3. **ACK**: The client sends a final TCP segment with the ACK flag set, acknowledging the server's ISN + 1. At this point, the connection is established, and both parties can start sending data.

## Connection Termination

TCP uses a four-step process to terminate a connection, which involves the following steps:

1. **FIN from Client**: The client sends a TCP segment with the FIN (finish) flag set to the server, indicating that it has finished sending data.
2. **ACK from Server**: The server acknowledges the client's FIN by sending a TCP segment
    with the ACK flag set. This indicates that the server has received the client's request to terminate the connection.
3. **FIN from Server**: The server sends its own TCP segment with the FIN flag set, indicating that it has also finished sending data.
4. **ACK from Client**: The client acknowledges the server's FIN by sending a TCP
    segment with the ACK flag set. After this step, the connection is fully terminated.

## Reliability and Flow Control

