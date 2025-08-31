##📋 Prerequisites
-Java 17 or higher
-Node.js 18 or higher
-MySQL 8.0 or higher
-Maven 3.6 or higher
Git

#🚀 Installation1. Clone the Repositorybashgit clone https://github.com/yourusername/university-course-management.git
cd university-course-management

2. Backend SetupConfigure Database
Create a MySQL database:

sqlCREATE DATABASE course_management;
Update database configuration in course-managment/src/main/resources/application.yml:

yamlspring:
  datasource:
    url: jdbc:mysql://localhost:3307/course_management?createDatabaseIfNotExist=true
    username: your_username
    password: your_passwordRun the Backendbashcd course-managment
mvn clean install
mvn spring-boot:runThe backend will start on http://localhost:8080

3. Frontend SetupInstall Dependenciesbashcd frontend
npm installConfigure EnvironmentCreate a .env.local file in the frontend directory:
envNEXT_PUBLIC_API_URL=http://localhost:8080/apiRun the Frontendbashnpm run devThe frontend will start on http://localhost:3000

4. Default Login CredentialsUpon first run, a default admin account is created:

Email: admin@university.edu
Password: admin123
