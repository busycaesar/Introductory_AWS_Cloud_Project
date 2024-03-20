# Integration Test: POST Fragment with unsupported content type
# test/integration/post-fragments-unsupported-type.hurl

# POST Fragment

# Make a POST request to the correct url to store the fragment
POST http://localhost:8080/v1/fragments
# - Pass the content-type
Content-Type: text/css
# - Include authorization header
[BasicAuth]
user1@email.com:ps1
# - Include body with fragment data
```
.h1 {
  "font-weight":"bold"
}
```

# Test POST Response

# Make sure it returns the expected values
# - Status code 415
HTTP 415
