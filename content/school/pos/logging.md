# Logging in Java

## Logging vs System.out.println()

## Logback (Logging Framework)

### Setup

- Add dependencies

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.6</version>
</dependency>
```

- Create a logback.xml file in the resources folder

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            <!--
            Bsp: 12:34:56.789 [main] DEBUG com.example.Main - Hello World 
             -->
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```
