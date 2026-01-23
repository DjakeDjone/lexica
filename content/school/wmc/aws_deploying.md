# AWS Todo App Deployment Protocol

## 1. Prerequisites

**Install AWS CLI:**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
unzip -o /tmp/awscliv2.zip -d /tmp
/tmp/aws/install --install-dir ~/.local/aws-cli --bin-dir ~/.local/bin --update
```

**Configure Credentials (`~/.aws/credentials`):**

```ini
[default]
aws_access_key_id=ASIAZQ3DSWD24RAUZVNJ
aws_secret_access_key=<secret>
aws_session_token=<token>
```

**Configure Config (`~/.aws/config`):**

```ini
[default]
region=us-east-1
output=json
```

**Verify Identity:**

```bash
aws sts get-caller-identity
```

## 2. Infrastructure & Security Groups

**Create EC2-RDS SG:**

```bash
aws ec2 create-security-group --group-name ec2-rds --description "SG for EC2 and RDS" --vpc-id vpc-073140ca74888ae74
# ID: sg-06210763fac9a6886
```

**Add Rules (Postgres, SSH, HTTP):**

```bash
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 --protocol tcp --port 5432 --source-group sg-06210763fac9a6886
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 --protocol tcp --port 8080 --cidr 0.0.0.0/0
```

**Create ALB SG:**

```bash
aws ec2 create-security-group --group-name alb-sg --description "SG for Todo ALB" --vpc-id vpc-073140ca74888ae74
# ID: sg-04a09f89ee4523965
```

**Add Rules (Frontend :80, Backend :8080):**

```bash
aws ec2 authorize-security-group-ingress --group-id sg-04a09f89ee4523965 --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-04a09f89ee4523965 --protocol tcp --port 8080 --cidr 0.0.0.0/0
```

**Allow ALB to access ECS:**

```bash
aws ec2 authorize-security-group-ingress --group-id sg-06210763fac9a6886 --protocol tcp --port 8080 --source-group sg-04a09f89ee4523965
```

## 3. RDS PostgreSQL

**Create Subnet Group:**

```bash
aws rds create-db-subnet-group --db-subnet-group-name todo-rds-subnet-group --db-subnet-group-description "Todo RDS Subnet" --subnet-ids subnet-0ed3b1a7f851dee19 subnet-0582afbe56ccfac01
```

**Create RDS Instance:**

```bash
aws rds create-db-instance --db-instance-identifier todo-postgres --db-instance-class db.t3.micro --engine postgres --engine-version 15 --master-username todo_user --master-user-password secret123 --allocated-storage 20 --vpc-security-group-ids sg-06210763fac9a6886 --db-subnet-group-name todo-rds-subnet-group --no-publicly-accessible --db-name postgres
```

_Endpoint: `todo-postgres.c7yw08ia8xxu.us-east-1.rds.amazonaws.com`_

## 4. Backend Deployment

**Build & Push:**

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 654654484725.dkr.ecr.us-east-1.amazonaws.com
cd todo-backend && docker build -t todo-backend:latest .
docker tag todo-backend:latest 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest
docker push 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-backend:latest
```

**Create Cluster:**

```bash
aws ecs create-cluster --cluster-name todo-cluster
```

**Register Task (`task-definition.json` required):**

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

## 5. Load Balancer & Backend Service

**Create Target Group:**

```bash
aws elbv2 create-target-group --name todo-backend-tg --protocol HTTP --port 8080 --vpc-id vpc-073140ca74888ae74 --target-type ip --health-check-path /actuator/health
# ARN: arn:aws:elasticloadbalancing:us-east-1:654654484725:targetgroup/todo-backend-tg/a783ed022bc277be
```

**Create ALB:**

```bash
aws elbv2 create-load-balancer --name todo-alb --subnets subnet-0ed3b1a7f851dee19 subnet-0582afbe56ccfac01 subnet-0ba943fb29703b278 --security-groups sg-04a09f89ee4523965 --scheme internet-facing --type application
```

**Create Backend Listener (8080):**

```bash
aws elbv2 create-listener --load-balancer-arn <ALB_ARN> --protocol HTTP --port 8080 --default-actions Type=forward,TargetGroupArn=<TG_ARN>
```

**Create Backend Service:**

```bash
aws ecs create-service --cluster todo-cluster --service-name todo-backend-service --task-definition todo-backend-task:1 --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-0ed3b1a7f851dee19,subnet-0582afbe56ccfac01],securityGroups=[sg-06210763fac9a6886,sg-04a09f89ee4523965],assignPublicIp=ENABLED}" --load-balancers "targetGroupArn=<TG_ARN>,containerName=todo-backend,containerPort=8080"
```

## 6. Frontend Deployment

**Update `environment.ts` with ALB URL.**

**Build & Push:**

```bash
cd todo-frontend && docker build -t todo-frontend:latest .
docker tag todo-frontend:latest 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-frontend:latest
docker push 654654484725.dkr.ecr.us-east-1.amazonaws.com/todo-frontend:latest
```

**Register Task:**

```bash
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json
```

**Create Target Group & Listener (80):**

```bash
aws elbv2 create-target-group --name todo-frontend-tg --protocol HTTP --port 80 --vpc-id vpc-073140ca74888ae74 --target-type ip --health-check-path /
aws elbv2 create-listener --load-balancer-arn <ALB_ARN> --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=<FRONTEND_TG_ARN>
```

**Create Frontend Service:**

```bash
aws ecs create-service --cluster todo-cluster --service-name todo-frontend-service --task-definition todo-frontend-task:1 --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-0ed3b1a7f851dee19,subnet-0582afbe56ccfac01],securityGroups=[sg-04a09f89ee4523965],assignPublicIp=ENABLED}" --load-balancers "targetGroupArn=<FRONTEND_TG_ARN>,containerName=todo-frontend,containerPort=80"
```

## 7. Verification

- frontend: <http://todo-alb-462279294.us-east-1.elb.amazonaws.com/>
- backend: <http://todo-alb-462279294.us-east-1.elb.amazonaws.com:8080/>
