
***

# University Course Management

A robust application to manage university courses and user accounts, featuring a Java/Spring backend and Next.js frontend.

## 📋 Prerequisites

- **Java 17 or higher**
- **Node.js 18 or higher**
- **MySQL 8.0 or higher**
- **Maven 3.6 or higher**
- **Docker Desktop installed**
- **Git**

### Installation

## 1. **Clone the Repository**
```bash
git clone https://github.com/weerawi/University-Course-Management-System.git
cd University-Course-Management-System
```

## 2.. **Start All Services with Docker Compose**
```bash
bashdocker-compose up --build -d
```
 
The backend will start on [http://localhost:8080](http://localhost:8080).
 
The frontend will start on [http://localhost:3000](http://localhost:3000)

## 3. Default Login Credentials

Upon first run, a default admin account is created:

- **Email:** [admin@university.edu](mailto:admin@university.edu)
- **Password:** `admin123`

***
 
## 🔌 API Endpoints

**Base URL:**  
```
http://localhost:8080/api
```

### 🔐 Authentication

| Method | Endpoint        | Description            | Access  |
|--------|----------------|------------------------|---------| 
| POST   | /auth/login    | Login with credentials | Public  |

### 👥 User Management

| Method | Endpoint           | Description              | Access         |
|--------|--------------------|--------------------------|----------------|
| GET    | /users             | Get all users            | Admin          |
| GET    | /users/{id}        | Get user by ID           | Admin/Self     |
| POST   | /users             | Create new user          | Admin          |
| PUT    | /users/{id}        | Update user details      | Admin/Self     |
| DELETE | /users/{id}        | Delete user              | Admin          |
| GET    | /users/profile     | Get current profile      | Authenticated  |
| PUT    | /users/{id}/password | Update password       | Admin/Self     |

*Query Parameters:*  
- `?role={ROLE}` — Filter users by role  
- `?unassigned=true&role=STUDENT` — Get unassigned student users

### 📚 Course Management

| Method | Endpoint                  | Description           | Access             |
|--------|---------------------------|-----------------------|--------------------|
| GET    | /courses                  | Get all courses       | Authenticated      |
| GET    | /courses/{id}             | Get course by ID      | Authenticated      |
| POST   | /courses                  | Create new course     | Admin              |
| PUT    | /courses/{id}             | Update course         | Admin              |
| DELETE | /courses/{id}             | Delete course         | Admin              |
| GET    | /courses/{id}/students    | Get enrolled students | Admin/Instructor   |

### 🎓 Student Management

| Method | Endpoint                       | Description            | Access               |
|--------|--------------------------------|------------------------|----------------------|
| GET    | /students                      | Get all students       | Admin/Instructor     |
| GET    | /students/{id}                 | Get student by ID      | Admin/Instructor/Self|
| POST   | /students                      | Create student profile | Admin                |
| PUT    | /students/{id}                 | Update student         | Admin                |
| DELETE | /students/{id}                 | Delete student         | Admin                |
| POST   | /students/enroll/{courseId}    | Enroll in course       | Student              |
| DELETE | /students/drop/{courseId}      | Drop course            | Student              |
| GET    | /students/{id}/courses         | Get enrolled courses   | Admin/Instructor/Self|
| GET    | /students/me                   | Get current profile    | Student              |

### 📊 Results Management

| Method | Endpoint                         | Description           | Access           |
|--------|----------------------------------|-----------------------|------------------|
| GET    | /results                         | Get all results       | Admin            |
| GET    | /results/{id}                    | Get result by ID      | Admin/Student    |
| POST   | /results                         | Create new result     | Instructor/Admin |
| PUT    | /results/{id}                    | Update result         | Instructor/Admin |
| DELETE | /results/{id}                    | Delete result         | Instructor/Admin |
| GET    | /results/student/{studentId}     | Get student's results | Student/Admin    |
| GET    | /results/course/{courseId}       | Get course results    | Instructor/Admin |
| GET    | /results/instructor              | Get instructor result | Instructor       |

### 📈 Dashboard Statistics

| Method | Endpoint           | Description             | Access     |
|--------|--------------------|-------------------------|------------|
| GET    | /dashboard/admin   | Admin dashboard stats   | Admin      |
| GET    | /dashboard/student | Student dashboard stats | Student    |
| GET    | /dashboard/instructor | Instructor dashboard stats | Instructor | 

***

## 🛠️ Manual Installation & Setup

### Backend Setup

1. **Navigate to the Backend Directory:**
   ```bash
   cd course-management
   ```

2. **Configure Database Connection:**
   - Edit `src/main/resources/application.yml` and update with your MySQL credentials:
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3307/course_management?createDatabaseIfNotExist=true
         username: your_mysql_username
         password: your_mysql_password
     ```

3. **Build and Run the Backend:**
   - Using Maven Wrapper (Recommended):
     ```bash
     ./mvnw clean install
     ./mvnw spring-boot:run
     ```
   - Or, with Maven installed:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```
   - The backend will be available at [http://localhost:8080](http://localhost:8080).

***

### Frontend Setup

1. **Navigate to Frontend Directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Endpoint:**
   - Create a `.env.local` file:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8080/api
     ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   - The frontend runs at [http://localhost:3000](http://localhost:3000).

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

***

### ⚙️ Configuration Details

**Backend (`application.yml`):**
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/course_management}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root123}

jwt:
  secret: ${JWT_SECRET:your-secret-key-here}
  expiration: ${JWT_EXPIRATION:86400000}

server:
  port: ${SERVER_PORT:8080}
```

**Frontend (`.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
 
***
