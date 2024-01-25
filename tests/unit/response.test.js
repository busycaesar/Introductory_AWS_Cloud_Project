// tests/unit/response.test.js

const {createErrorResponse, createSuccessResponse } = require("../../src/response");

// Defining the set of tests!
describe("API Response", () => {

	// Writing a test for checking createErrorResponse() method!
	test("createErrorResponse()", () => {
		// Storing the response of the function!
		const errorResponse = createErrorResponse(404, "Not Found");
		
		// Checking if the response is the same as what is excepted!
		export(errorResponse).toEqual({
			status: "Error",
			error: {
				code: 404,
				message: "Not Found",
			}
		});
	});

	// Writing a test for checking createSuccessResponse() without arguments
	test("createSuccessResponse()", () => {
		// Storing the response of the function!
		const successResponse = createSuccessResponse();

		// Checking if the response is the same as what is expected!
		expect(successResponse).toEqual({
			status: "Okay!",
		});
	});

	// Writing a test for checking createSuccessResponse() with arguments!
	test("createSuccessResponse()", () => {
		const data = { a:1, b:2 },
			// Storing the response by the function after passing the data!
			successResponse = createSuccessResponse(data);
		expect(successResponse).toEqual({
			status: "Okay!",
			a: 1,
			b: 1,
		});
	});

});
