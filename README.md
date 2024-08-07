# Daily Tasks 

## Objective
Implement a Daily Tasks feature for managing employee tasks, demonstrating proficiency in basic CRUD operations, frontend development, and backend integration.

## Requirements
1. **CRUD Operations for Tasks:**
   - **Create**: Add a new task for an employee.
   - **Read**: Display a list of tasks for each employee.
   - **Update**: Modify task details.
   - **Delete**: Remove a task.

2. **Task Details:**
   - Each task must include a description and a time estimation (from and to times).
   - Enforce a maximum task duration of 8 hours.
   - Ensure the total duration of tasks for any given day does not exceed 8 hours.

3. **Daily Summary:**
   - Display the total hours allocated for the day.
   - Show remaining hours available for new tasks.

## Implementation Guidelines

### Frontend
- **Frameworks**: React, TypeScript
- **Styling**: Shadcn UI, Tailwind CSS

### Backend
- **Framework**: Node.js, Express
- **Database**: MySQL
- **ORM**: TypeORM
- **Validation**: Both client and server-side

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js and npm (if running without Docker).

### Steps to Run the Application

1. **Clone the repository**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Environment Configuration**
   - Backend: Create a `.env` file in the backend directory and set the following variables:
     ```sh
     DB_HOST=mysql
     DB_PORT=3306
     MySQL_USERNAME=root
     MySQL_PASSWORD=my-secret-pw
     MySQL_DATABASE_NAME=mydatabase
     JWT_SECRET=myjwtsecret
     ```

3. **Running with Docker Compose**
    ```sh
    docker-compose up --build
    ```

4. **Running Locally Without Docker**
    ```sh
    cd backend
    npm install
    npm run start
    ```

## Daily Tasks Report API Endpoints
Base URL: `http://localhost:3001`

- Create Task: `POST /tasks`
- Read Tasks: `GET /tasks?day={day}`
- Update Task: `PUT /tasks/:id`
- Delete Task: `DELETE /tasks/:id`

## License
MIT License
