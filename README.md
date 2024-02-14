# Fragments

## Description

This is microservice for storing fragments. It provides a list of APIs which can be used to store/retrive/manager the fragments. However, to use those APIs an authorization token will be needed to be passed in the header of the request. This authorization token will be provided by the AWS Cognito upon authenticating the user information. To register an account, setup <a href="https://github.com/busycaesar/Fragments-UI">Fragments-UI</a> which is officially the frontend for this microservice. All the instructions to setup the frontend is provided there.

## Tech Stack

Node.js, Express.js, Jest, AWS Cognito, AWS EC2 Instance

## List of APIs

### Note: All the requests should have the authorization token in the Header. 

### GET 
1. /v1/fragments: This request returns an array of fragments stored by the user.

### POST
1. /v1/fragments: This request is used to store a new fragment.
Requirements: The header should have a Content Type property, the value of which would be the type of the fragment the user intends to store.
Promise: Once the fragment is stored successfully, this request returns a location property in the response. This property includes a URL which can be used to access the stored fragment.

## How to run the project

To set up this project, follow the below steps:

1. Clone this repository.
2. Make sure you have Node installed in the device.
3. Open this project in any code editor and start the terminal.
4. In the terminal type the following. This will install all the dependencies of the project.

```bash
npm install
```

5. Following are few commands which can be used run the test cases.

```bash
npm run lint
```

This command will check for any linting errors throught the project. This prevents any potential error from happening and makes sure that there is a consistency throught the project.

```bash
npm test:watch
```

This command runs runs all the test cases in a development mode. It keeps rerunning the test cases everytime there is a change in any of the file.

```bash
npm test
```

This command runs all the test cases once and displays the result.

```bash
npm coverage
```

This command displays the percentage of code being tested from each file. The ideal percentage should be between 80% - 100%. In other words, atleast 80% lines of code from each file should be tested.

6. Finally, following are the scripts to run this code.

```bash
npm run dev
```

This command will start the server in the development environment. It uses nodemon which restarts the server everytime there is some change in any of the file.

```bash
npm start
```

This command will simply start the server. To view any change in the file, the server needs to be restarted manually.

```bash
npm run debug
```

This command starts the server in the debugging mode. It sets the LOG_LEVEL to debug stops at all the breaking points as per the assigned conditions.
