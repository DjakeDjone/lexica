---
title: Diplomarbeit zum Thema "Time Series Databases"
description: 
---

## Table of Contents

1. Introduction (**3P**)  
   1. Why Time-Series Databases? (1P)  
   2. Use Cases of Time-Series Databases (2P)  
2. Overview of Popular Time-Series Databases (**7P**)  
   1. Comparison (3P)  
   2. InfluxDB (1P)  
   3. TimescaleDB (Deep Dive) (2P)  
   4. Prometheus (0.5P)  
   5. OpenTSDB (0.5P)  
3. How Time-Series Databases Work (**2P**)  
   1. Data Ingestion (0.5P)  
   2. Data Storage (0.5P)  
   3. Querying Mechanisms (1P)  
4. TS & Cloud (**2P**)  
   1. Advantages/Disadvantages of Cloud Hosting  
   2. Hybrid  
5. Optimization Techniques for Time-Series Databases (**25P**)  
   1. Compression Techniques (5P)  
   2. Indexing Techniques (5P)  
   3. Partitioning Techniques (5P)  
   4. Data Retention Strategies (5P)  
   5. Advantages of Low-Level Languages for TSDBs (5P)  
6. Performance Measurement Overview (**1P**)  
7. Benchmarking and Evaluation of Time-Series Databases (**5P**)  
   1. Benchmarking Methodology (2P)  
   2. Benchmarking Results (3P)  
8. Discussion of Benchmark Results (**2P**)  
9. TS & AI/Machine Learning (**3P**)  
10. Conclusion & Usage in our project (**1P**)

# Introduction

The amounts of data increase exponentially. Along the most used
databases are Oracle and Mysql. Those databases are great at storing
large amounts of data. What they leak in is the ability to select huge
amounts of data over a long time period. Time series databases fill this 
gap. They are optimized to store and query large amounts of data over a long
time period.

## Why Time-Series Databases?

Conventional databases like Postgres are commonly used to handle large amounts of user data such as chats, accounts, and relationships. For even larger datasets, No-SQL databases like MongoDB are often horizontally scaled to accommodate nearly unlimited growth.

However, consider a scenario where logs are collected, stored and analyzed.

- 1000 sensors
- every 1 second a new observation

> one year has $31536000$ seconds

$$
\text{1000} * 31536000 = 31536000000
$$

That are 31 billion observations, for just one year.


## What are time series databases?

Time series databases are databases that are specialized and optimized
for time stamps and data in a big time frame. For example, TimescaleDB,
a Postgres extension, is able to improve performance to up to 350 times
faster queries, 44% faster ingests, and 95% storage savings with
time-series data.

## What is time series data?

Time-series data are a sequence of successive points in time. This could
be any record with a time stamp. Common examples are as follows.

-   IOT sensors

-   stock marked information

-   logs, error rates or request counts

-   weather patterns/climate data

-   sales or demand forecasting

# Comparison of the most popular time series databases

::: {#tab:placeholder}
      Name          Description       Pros   Cons
  ------------- -------------------- ------ ------
    InfluxDB                                
   TimescaleDB   Postgres extension         
     RaimaDB                                
      Redis                                 

  : Caption
:::

## TimescaleDB

Timescale is a Postgres extension. It benefits from the feature-rich and
well-tested features of Postgres.

TODO: other tsdbs

## Evaluating performance

Time-serious databases can be measured in various aspects:

### Storage Efficiency

Time-series data is often highly compressible as values tend to repeat.
The right compression algorithm can save over 90% of storage costs

**compression methods:**

-   **delta encoding**: stores just the difference (delta), this makes
    this compression method highly efficient if the data repeats often

-   

### Query Performance

$$Time for operations/count of operations$$

# NOTES: (TODO: remove this)

\- https://www.youtube.com/watch?v=69Tzh_0lHJ8
