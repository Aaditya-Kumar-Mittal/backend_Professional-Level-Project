class ApiResponse {
  constructor(statusCdde, data, message = "Success") {
    this.statusCode = statusCdde; // HTTP status code for the response
    this.data = data; // The main data payload of the response
    this.message = message; // A message describing the response
    this.success = statusCdde < 400; // Indicates whether the operation was successful
  }
}

export { ApiResponse };
