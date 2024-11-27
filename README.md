# Apps Analytics

RESTful API for application installations analytics.

## Description

This is a Back-end application designed to provide analytics data on application installations for marketing and analytics team. It includes features such as installation statistics by app, geographical distribution, device model analysis, and more. Built with **NestJS**, it utilizes **PostgreSQL** for data storage and Swagger for API documentation. 


## Technologies Used

* Node.js
* Nest.js
* TypeScript
* TypeOrm
* PostgreSQL
* Docker

## Installation

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/project-name.git
   
2. Install dependencies:
    
    ```bash
    cd apps-analytics
    npm install
    
3. (Optional) If using Docker:
    
    ```bash
    docker-compose up --build

4. Run application:
    
    ```bash
    npm start

## Database

This project uses **PostgreSQL** as the database. Ensure **PostgreSQL** is installed and running before proceeding.
Configure the following environment variables in a `.env` file located in the root of the project:

Example `.env` file:

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_SYNCHRONIZE=true
```

## Testing 

This project includes **unit tests** to ensure the application modules work as expected. See details below how to run tests.

### Unit tests

To run unit tests, use the following command:

```
npm run tests
```

### Test coverage

To generate a coverage report, use:

```
npm run test:cov
```

The report will be available in the `coverage` directory.

## API Documentation

API documentation is automatically generated by Swagger at /api endpoint.
