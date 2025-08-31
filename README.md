
***

# University Course Management

A robust application to manage university courses and user accounts, featuring a Java/Spring backend and Next.js frontend.

## 📋 Prerequisites

- **Java 17 or higher**
- **Node.js 18 or higher**
- **MySQL 8.0 or higher**
- **Maven 3.6 or higher**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/university-course-management.git
cd university-course-management
```

### 2. Backend Setup

#### Configure Database


Update database configuration in `course-managment/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/course_management?createDatabaseIfNotExist=true
    username: your_username
    password: your_password
```

Create and start a MySQL container (adjust credentials as needed):
```bash
docker run -d -p 3307:3306 --name mysql-course-mgmt -e MYSQL_ROOT_PASSWORD=root123 mysql
docker start mysql-course-mgmt
docker exec -it mysql-course-mgmt mysql -uroot -proot123
```



#### Run the Backend

```bash
cd course-managment
./mvnw clean install
./mvnw spring-boot:run
```
The backend will start on [http://localhost:8080](http://localhost:8080).

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### Run the Frontend

```bash
npm run dev
```
The frontend will start on [http://localhost:3000](http://localhost:3000)

## 4. Default Login Credentials

Upon first run, a default admin account is created:

- **Email:** [admin@university.edu](mailto:admin@university.edu)
- **Password:** `admin123`

***
