# Fragments

## Following are the scripts to run this code.

```bash
npm run lint
```

This command will lint all the JS files within the src directory and its subdirectories. This script is a way to check the codebase for potential issue, it enforces the coding standards and maintain the code quality.

```bash
npm start
```

This command will simply start the server.

```bash
npm run dev
```

This command set the LOG_LEVEL to debug and starts the server in the development mode. It also uses nodemon which makes sure to restart the server whenever there is any update in any file or subfile under the directory src.

```bash
npm run debug
```

This command also sets the LOG_LEVEL to debug and starts the server in the debugging mode. It will stops at all the breaking points according to the assigned conditions.
