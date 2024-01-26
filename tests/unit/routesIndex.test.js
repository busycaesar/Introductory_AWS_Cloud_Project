// tests/unit/routesIndex.test.js

const request = require("supertest");

const app = require("../../src/app");

describe("Check 404 Error", () => {

	// Making sure for all unexpected path, 401 status code is being sent!
	test("Correct status code is sent", async () => {
		await request(app).get("/non-existing-path").expect(404);
	});

	// Checking the error message for all the unexpected path!
	test("Checking error object", async () => {
		const response = await request(app).get("/non-existing-path");
		const resBody = response.body;
		expect(resBody.status).toBe("Error!");
		expect(resBody.error.message).toBe("Not Found!");
		expect(resBody.error.code).toBe(404);
	});

});
