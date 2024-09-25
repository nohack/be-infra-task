# Readme

The focus of this task is to wire the api's, database using docker and docker compose.

### Starting the Application

To start the application, use the following commands:

```bash
docker compose down
docker compose up -d --build
```

Check if all containers started successfully:

```bash
docker ps
```

If any container is in restart mode, it is mostly due to **Postgres** not starting before the service containers. In this case, run:

```bash
docker compose restart
```

> **Note:** Ideally, the lifecycle of the database should be independent of the application to avoid such issues.

---

### Users API

- **Create a User:**

  ```bash
  curl -v http://localhost:3000/users -H "Content-Type: application/json" -d '{ "firstName": "Doe", "lastName": "Doe"}'
  ```

- **Get All Users:**

  ```bash
  curl -v http://localhost:3000/users
  ```

- **Get a User by ID:**

  ```bash
  curl -v http://localhost:3000/users/:userID
  ```

- **Delete a User:**

  ```bash
  curl -v -XDELETE http://localhost:3000/users/:userID
  ```

---

### Orders API

- **Create an Order:**

  ```bash
  curl -v http://localhost:4000/orders -H "Content-Type: application/json" -d '{ "isCancelled": false}'
  ```

- **Get All Orders:**

  ```bash
  curl -v http://localhost:4000/orders
  ```

- **Get an Order by ID:**

  ```bash
  curl -v http://localhost:4000/orders/:orderId
  ```

- **Delete an Order:**

  ```bash
  curl -v -XDELETE http://localhost:4000/orders/:orderId
  ```

---

### Products API

- **Create a Product:**

  ```bash
  curl -v http://localhost:5000/products -H "Content-Type: application/json" -d '{ "productName": "Doe", "quantity": 10}'
  ```

- **Get All Products:**

  ```bash
  curl -v http://localhost:5000/products
  ```

- **Get a Product by ID:**

  ```bash
  curl -v http://localhost:5000/products/:productId
  ```

- **Delete a Product:**

  ```bash
  curl -v -XDELETE http://localhost:5000/products/:productId
  ```

---

### **Assumption**

- Focus was to operationalize the different services as per the task expectation and ensure api's work.
- Did not focus on improving app logic, handling error conditions etc
- Committed the env files and used credentials in docker compose just for this task. No secrets should be pushed or be a part of source code.