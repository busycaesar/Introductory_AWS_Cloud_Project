# Fragments

## Description

This is a microservice for storing fragments, leveraging AWS services. This service can be integrated with all the IoT devices in the industry using which the devices can store, retrieve, and/or manage a variety of fragments using the APIs. The type of fragments this microservice can store are text/plain, text/markdown, text/html, text/csv, application/json, image/png, image/jpeg, image/webp, image/avif or image/gif type. This would help various devices, store the reports in all the above forms. The authorized users would later be able to access the fragments they stored upon authenticating using valid credentials along with the functionality to be able to convert the type of those fragments into the supported type.

## Tech Stack

<img src="https://skillicons.dev/icons?i=nodejs,express,jest,docker,aws,githubactions,dynamodb" />

## List of APIs

**Note**: All the requests should have the authorization token in the Header. 

### GET 
1. `/v1/fragments`: Get an array of fragments stored by the user.
2. `/v1/fragments/:id`: Get the fragment stored using its id.
3. `/v1/fragments/:id.ext`: Get the fragment stored using its id converted in the required and supported type.
4. `/v1/fragments/:id/info`: Get the metadata of the fragmented using its id.

### POST
1. `/v1/fragments`: Store a new fragment.
- **Requirements**: The header should have a Content Type property, the value of which would be the type of the fragment the user intends to store.
- **Returns**: Once the fragment is stored successfully, this request returns a location property in the response. This property includes a URL which can be used to access the stored fragment.

### PUT
1. `/v1/fragments/:id`: Update an existing fragment.

*Note: Type of the fragment cannot be updated once its created.*

### DELETE
1. `/v1/fragments/:id`: Update an existing fragment.

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
