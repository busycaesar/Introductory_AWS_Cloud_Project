// src/routes/api/get.js

// Getting a list of fragments for the current user!
module.exports = (req, res) => {
	res.status(200).json({
		status: 'Okay!',
		fragments: [],
	});
};
