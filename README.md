# Fragments

## Description

This is microservice for storing fragments. It provides a list of APIs which can be used to store/retrive/manager the fragments. However, to use those APIs an authorization token will be needed to be passed in the header of the request. This authorization token will be provided by the AWS Cognito upon authenticating the user information. To register an account, setup <a href="https://github.com/busycaesar/Fragments-UI" target="_blank">`Fragments-UI`</a> which is officially the frontend for this microservice. All the instructions to setup the frontend is provided there.

## Tech Stack

Node.js, Express.js, Jest, AWS Cognito, AWS EC2 Instance

## List of APIs

### Note: All the requests should have the authorization token in the Header. 

### GET 
1. `/v1/fragments`: Get an array of fragments stored by the user.

### POST
1. `/v1/fragments`: Store a new fragment.
Requirements: The header should have a Content Type property, the value of which would be the type of the fragment the user intends to store.
Promise: Once the fragment is stored successfully, this request returns a location property in the response. This property includes a URL which can be used to access the stored fragment.

## How to run the project

Clone this repository and install all the dependencies using `npm install`.

Start the server in development mode (Server restarts automatically whenever any file in the server is modified and saved)

```bash
npm run dev
```

Start the server in production mode

```bash
npm start
```

Start the server in production mode and print the debug logs. 

```bash
npm run debug
```

## Test Scripts

Following are the scripts for testing the project:

Run lint tests

```bash
npm run lint
```

Run tests. By default it runs all the tests mentioned in the test/ directory. To run the tests of a specific file, the name of the file can be passed as an argument with the command.

```bash
npm test
```

Run tests in development mode (The command is reexecuted whenever any test case is modified and saved). By default it runs all the tests mentioned in the test/ directory. To run the tests of a specific file, the name of the file can be passed as an argument with the command.

```bash
npm test:watch
```

Check the coverage of tests

```bash
npm coverage
```
