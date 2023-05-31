# School Intranet App

This is a school intranet app that allows teachers to create and manage classes and students.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

## Installation

1. Clone the repository

```sh
git clone https://github.com/LaulauChau/school-intranet-app.git
```

2. Install dependencies

```sh
pnpm install
```

3. Create a `.env` file in the root directory and add the following environment variables

```sh
VITE_MONGODB_URL=<your mongodb url>
```

4. Run the app

```sh
pnpm dev
```

The Express server will be running on port 3000 and the Vite server will be running on port 3001.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
