// src/response.js

module.exports.createSuccessResponse = (data) => {
	return {
		status: "Okay!",
	}
}

module.exports.createErrorResponse = (code, message) => {
}
