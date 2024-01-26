// tests/unit/health.test.js

// request object can be used to test the response of the APIs defined by the server. It accepts the server app which has all the API routers defined and has various subfunctions which can be called to defined the method of the API call.
// Getting the request library for checking http routes!
const request = require("supertest");

// Gettiong the Express app object!
const app = require("../../src/app");

// Getting the version and author from package.json!
const { version, author } = require("../../package.json");

// To describe a bunch of tests checking the functionality of a specific unit, describe function can be called which accepts the first parameter to name the club of tests and the second one accepts a call back function which can has all the tests defined!
// Defining a bunch of tests for health check of the server!
describe("/ health check", () => {
	
	// To describe a single test in call back function of the describe function, test function can be called which accepts the same type of parameters as the describe function. The name of the test can be passed to the first parameter and the second parameter accepts the call back function which has has the logic to test the functionality of the unit.
	// Making sure that the API returns the correct status code in response.
	test("Should return HTTP 200 response!", async () =>
		const response = await request(app).get("/");
		// All the call back functions passed to the test function, should call atlest one expect function along with any of its sub function according to the requirement. The expect function accepts the parameter in the form of some value and its sub function accepts the parameter which you expect the had coded value which you expect the parameter passed to the expect function should have. The call back function can call more than on expect function. It is something similar to conditional operator. Various operators can be selected as the sub function of the expect function. If the value matches as expected, the test is passed, otherwise failed! 
		// Checking the response received by calling the function!
		expect(response.statusCode).toBe(200);
	});

	// Making sure that the client dont cache the response!
	test("Should return Cache-Control: no-cache header", async () => {
		const response = await request(app).get("/");
		// For making sure that client dont cache the response, the header in the response should have the cache-control property with the value of no-cache!
		expect(response.headers["cache-control"]).toEqual("no-cache");
	});

	// Making sure that the API returns the correct status in response!
	test("Should return status: Okay! in response", async () => {
		const response = await request(app).get("/");
		// The response should have the status property, in its body object, with value "Okay!"
		expect(response.body.status).toEqual("Okay!");
	})

	// Making sure that the API returns the correct information about the project!
	test("Should return the correct version, githubUrl and author in the response", async () => {
		const response = await request(app).get("/");
		expect(res.body.author).toEqual(author);
		expect(res.body.githubYrl.startsWith("http://github.com/")).toBe(true);
		expect(res.body.version).toEqual(version);
	});

});
