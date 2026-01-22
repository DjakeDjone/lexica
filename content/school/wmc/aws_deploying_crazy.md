# Todo App ECS Deployment Protocol

**Author:** Benjamin Friedl\
**Date:** 2026-01-20

---

## Overview

This protocol documents the deployment of a Todo application to AWS using:

- **RDS PostgreSQL** for the database
- **ECS Fargate** for container orchestration
- **Application Load Balancer** for traffic distribution
- **ECR** for container image storage

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Internet                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Application Load Balancer (todo-alb)                      │
│                 todo-alb-462279294.us-east-1.elb.amazonaws.com               │
│                         Port 80 (Frontend) │ Port 8080 (Backend)             │
└─────────────────────────────────────────────────────────────────────────────┘
                          │                              │
                          ▼                              ▼
┌────────────────────────────────────┐  ┌────────────────────────────────────┐
│     ECS Service: Frontend          │  │     ECS Service: Backend           │
│     (todo-frontend-service)        │  │     (todo-backend-service)         │
│     Image: todo-frontend:latest    │  │     Image: todo-backend:latest     │
│     Port: 80 (nginx)               │  │     Port: 8080 (Spring Boot)       │
└────────────────────────────────────┘  └────────────────────────────────────┘
                                                         │
                                                         ▼
                                        ┌────────────────────────────────────┐
                                        │     RDS PostgreSQL                 │
                                        │     (todo-postgres)                │
                                        │     Port: 5432                     │
                                        └────────────────────────────────────┘
```

---

## Step 1: Prerequisites

### 1.1 AWS CLI Installation

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
unzip -o /tmp/awscliv2.zip -d /tmp
/tmp/aws/install --install-dir ~/.local/aws-cli --bin-dir ~/.local/bin --update
```

### 1.2 AWS Credentials Configuration

Created `~/.aws/credentials` with AWS Academy session credentials:

```ini
[default]
aws_access_key_id=ASIAZQ3DSWD24RAUZVNJ
aws_secret_access_key=<secret>
aws_session_token=<token>
```

Created `~/.aws/config`:

```ini
[default]
region=us-east-1
output=json
```

### 1.3 Verify Identity

```bash
aws sts get-caller-identity
```

Result: Connected as `user4607900=Benjamin.Friedl@htlstp.at` in account
`654654484725`

---

## Step 2: EC2 Instance (Pre-existing)

An EC2 instance was already available for SSH access to RDS:

| Property    | Value               |
| ----------- | ------------------- |
| Instance ID | i-0c89e8f9df1b19a90 |
| Name        | webserver           |
| Public IP   | 44.223.41.167       |
| Key Pair    | labsuser.pem        |

SSH Access:

```bash
ssh -i labsuser.pem ec2-user@44.223.41.167
```

---

## Step 3: Security Groups

### 3.1 Create EC2-RDS Security Group

```bash
aws ec2 create-security-group \
  --group-name ec2-rds \
  --description "Security group for EC2 and RDS connectivity" \
  --vpc-id vpc-073140ca74888ae74
```

Result: `sg-06210763fac9a6886`

### 3.2 Add Inbound Rules to EC2-RDS

```bash
# PostgreSQL (self-referencing for RDS access)
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 \
  --protocol tcp --port 5432 --source-group sg-06210763fac9a6886

# SSH access
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

# HTTP for ECS tasks
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 \
  --protocol tcp --port 8080 --cidr 0.0.0.0/0
```

### 3.3 Create ALB Security Group

```bash
aws ec2 create-security-group \
  --group-name alb-sg \
  --description "Security group for Todo ALB" \
  --vpc-id vpc-073140ca74888ae74
```

Result: `sg-04a09f89ee4523965`

### 3.4 Add Inbound Rules to ALB

```bash
# Frontend port
aws ec2 authorize-security-group-ingress --group-id sg-04a09f89ee4523965 \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# Backend port
aws ec2 authorize-security-group-ingress --group-id sg-04a09f89ee4523965 \
  --protocol tcp --port 8080 --cidr 0.0.0.0/0
```

### 3.5 Allow ALB to access ECS

```bash
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 \
  --protocol tcp --port 8080 --source-group sg-04a09f89ee4523965
```

### 3.6 Update EC2 Instance Security Groups

```bash
aws ec2 modify-instance-attribute --instance-id i-0c89e8f9df1b19a90 \
  --groups sg-06210763fac9a6886 sg-0212c3909137ac868
```

---

## Step 4: RDS PostgreSQL Database

### 4.1 Create DB Subnet Group

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name todo-rds-subnet-group \
  --db-subnet-group-description "Subnet group for Todo RDS" \
  --subnet-ids subnet-0ed3b1a7f851dee19 subnet-0582afbe56ccfac01
```

### 4.2 Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier todo-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15 \
  --master-username todo_user \
  --master-user-password secret123 \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-06210763fac9a6886 \
  --db-subnet-group-name todo-rds-subnet-group \
  --no-publicly-accessible \
  --db-name postgres
```

### 4.3 RDS Result

| Property   | Value                                                    |
| ---------- | -------------------------------------------------------- |
| Identifier | todo-postgres                                            |
| Engine     | PostgreSQL 15.14                                         |
| Class      | db.t3.micro                                              |
| Endpoint   | `todo-postgres.c7yw08ia8xxu.us-east-1.rds.amazonaws.com` |
| Port       | 5432                                                     |
| Username   | todo_user                                                |

---

## Step 5: Backend Deployment

### 5.1 Create Multi-Stage Dockerfile

Updated `todo-backend/Dockerfile` for building without local Maven:

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-23-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q

# Runtime stage
FROM bellsoft/liberica-openjdk-alpine:23
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
```

### 5.2 Build and Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 654654484725.dkr.ecr.us-east-1.amazonaws.com

# Build
cd todo-backend
docker build -t todo-backend:latest .

# Tag and Push
docker tag todo-backend:latest 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest
docker push 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest
```

### 5.3 Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name todo-cluster
```

### 5.4 Register Task Definition

Created `task-definition.json` with environment variables for RDS connection:

```json
{
    "family": "todo-backend-task",
    "networkMode": "awsvpc",
    "taskRoleArn": "arn:aws:iam::654654484725:role/LabRole",
    "executionRoleArn": "arn:aws:iam::654654484725:role/LabRole",
    "containerDefinitions": [{
        "name": "todo-backend",
        "image": "654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest",
        "portMappings": [{ "containerPort": 8080 }],
        "environment": [
            {
                "name": "SPRING_DATASOURCE_URL",
                "value": "jdbc:postgresql://todo-postgres.c7yw08ia8xxu.us-east-1.rds.amazonaws.com:5432/postgres"
            },
            { "name": "SPRING_DATASOURCE_USERNAME", "value": "todo_user" },
            { "name": "SPRING_DATASOURCE_PASSWORD", "value": "secret123" }
        ]
    }],
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512"
}
```

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

## Step 6: Load Balancer Setup

### 6.1 Create Backend Target Group

```bash
aws elbv2 create-target-group \
  --name todo-backend-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-073140ca74888ae74 \
  --target-type ip \
  --health-check-path /actuator/health
```

Result:
`arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-backend-tg/a783ed022bc277be`

### 6.2 Create Application Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name todo-alb \
  --subnets subnet-0ed3b1a7f851dee19 subnet-0582afbe56ccfac01 subnet-0ba943fb29703b278 \
  --security-groups sg-04a09f89ee4523965 \
  --scheme internet-facing \
  --type application
```

### 6.3 Create Backend Listener (Port 8080)

```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:654654484725:loadbalancer/app/todo-alb/c6d91e6fb0cddd74 \
  --protocol HTTP \
  --port 8080 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-backend-tg/a783ed022bc277be
```

### 6.4 Create Backend ECS Service

```bash
aws ecs create-service \
  --cluster todo-cluster \
  --service-name todo-backend-service \
  --task-definition todo-backend-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0ed3b1a7f851dee19,subnet-0582afbe56ccfac01],securityGroups=[sg-06210763fac9a6886,sg-04a09f89ee4523965],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-backend-tg/a783ed022bc277be,containerName=todo-backend,containerPort=8080"
```

---

## Step 7: Frontend Deployment

### 7.1 Update Environment Configuration

Updated `todo-frontend/src/environments/environment.ts`:

```typescript
export const environment = {
    baseUrl:
        "http://todo-alb-462279294.us-east-1.elb.amazonaws.com:8080/api/todos",
};
```

### 7.2 Build and Push Frontend

```bash
cd todo-frontend
docker build -t todo-frontend:latest .
docker tag todo-frontend:latest 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-frontend:latest
docker push 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-frontend:latest
```

### 7.3 Register Frontend Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json
```

### 7.4 Create Frontend Target Group

```bash
aws elbv2 create-target-group \
  --name todo-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-073140ca74888ae74 \
  --target-type ip \
  --health-check-path /
```

### 7.5 Create Frontend Listener (Port 80)

```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:654654484725:loadbalancer/app/todo-alb/c6d91e6fb0cddd74 \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-frontend-tg/7d596ebf9785598f
```

### 7.6 Create Frontend ECS Service

```bash
aws ecs create-service \
  --cluster todo-cluster \
  --service-name todo-frontend-service \
  --task-definition todo-frontend-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0ed3b1a7f851dee19,subnet-0582afbe56ccfac01],securityGroups=[sg-04a09f89ee4523965],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-frontend-tg/7d596ebf9785598f,containerName=todo-frontend,containerPort=80"
```

---

## Step 8: Verification

### 8.1 Backend Health Check

```bash
curl http://todo-alb-462279294.us-east-1.elb.amazonaws.com:8080/actuator/health
```

**Result:** `{"status":"UP"}`

### 8.2 Frontend Access

```bash
curl -s -o /dev/null -w "%{http_code}" http://todo-alb-462279294.us-east-1.elb.amazonaws.com/
```

**Result:** `200`

---

## Access URLs

| Service          | URL                                                                        |
| ---------------- | -------------------------------------------------------------------------- |
| **Frontend**     | <http://todo-alb-462279294.us-east-1.elb.amazonaws.com>                      |
| **Backend API**  | <http://todo-alb-462279294.us-east-1.elb.amazonaws.com:8080>                 |
| **Health Check** | <http://todo-alb-462279294.us-east-1.elb.amazonaws.com:8080/actuator/health> |

---

## Resource Summary

| Resource Type            | Name                  | ID/ARN                                                  |
| ------------------------ | --------------------- | ------------------------------------------------------- |
| VPC                      | default               | vpc-073140ca74888ae74                                   |
| EC2 Instance             | webserver             | i-0c89e8f9df1b19a90                                     |
| RDS Instance             | todo-postgres         | todo-postgres.c7yw08ia8xxu.us-east-1.rds.amazonaws.com  |
| ECS Cluster              | todo-cluster          | arn:aws:ecs:us-east-1:654654484725:cluster/todo-cluster |
| Backend Service          | todo-backend-service  | Running (1/1)                                           |
| Frontend Service         | todo-frontend-service | Running (1/1)                                           |
| ALB                      | todo-alb              | todo-alb-462279294.us-east-1.elb.amazonaws.com          |
| Security Group (EC2/RDS) | ec2-rds               | sg-06210763fac9a6886                                    |
| Security Group (ALB)     | alb-sg                | sg-04a09f89ee4523965                                    |

---

## Remaining TODO

As per the original readme.md:

- [ ] Fix security groups (destination can also be a security group for better
      security)
