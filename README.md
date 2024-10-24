# site-affichage-gql

<p style='color: red;'>This is a work in progress</p>

## Getting Started

### Prerequisites

- Bun.js 1.1.x
- MySQL

### Installation

1. Clone the repository
2. Install dependencies

```bash
bun install
```

3. Create a `.env` file in the root directory and add the following variables:

```bash
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database_name>
JWT_SECRET=<your-secret-key>
```

4. Run the server

```bash
bun dev
```

5. Open your browser and navigate to `http://localhost:3000/graphql`
