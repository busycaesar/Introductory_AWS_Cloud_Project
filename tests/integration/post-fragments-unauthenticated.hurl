# Integration Test: POST Fragment with unauthenticated credentials
# test/integration/post-fragments-unauthenticated.hurl

# POST Fragment

# Make a POST request to the correct url to store the fragment
POST http://localhost:8080/v1/fragments
# - Pass the content-type
Content-Type: text/plain
# - Include authorization header
[BasicAuth]
djshah11@myseneca.ca:ps1
# - Include body with fragment data
`This is a fragment!`

# Test POST Response

# Make sure it returns the expected values
# - Status code 401
HTTP 401
