# User Authentication System

A Node.js and MongoDB based REST API for managing users and their cards.
The system allows:

Users to create cards by selecting a Card Type (virtual/physical) and Card Provider (e.g., Visa, MasterCard).

Enforces business rules:

A user cannot have more than 3 virtual cards.

A user cannot have more than 4 physical cards.

Provides APIs to create, list, and delete cards.

Includes webhook support to notify external services when a new card is created.

API documentation can be generated using Swagger (OpenAPI) for easy testing and integration.

---

## Deployment

- To clone this project

```bash
  git clone https://github.com/ShreyashSalian/user-card-mangement.git
```

- Go to the folder user-authenication

```bash
  cd card-mangement
```

- Initialize Git (If Required)

```bash
  git init
```

- Install NPM Packages

```bash
  npm install
```

- Setup Environment Variables,
  PORT=5000,
  MONGODB_URI=your_mongodb_connection_string,
  ACCESS_TOKEN=your_jwt_access_secret,
  REFRESH_TOKEN=your_jwt_refresh_secret,

- Build the Project (Compile TypeScript). Compiles .ts files to .js inside the dist/ directory.

```bash
  npm run build
```

- Run the compiled version:

```bash
  npm run start
```

- Run Unit Tests
