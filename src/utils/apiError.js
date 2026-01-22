class apiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ) {
        super(message);
        this.statuscode = statuscode;
        this.data = null;
        this.message = message;
        this.errors = errors;
        this.statck = statck;

        if (statck) {
            this.statck = statck
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { apiError };