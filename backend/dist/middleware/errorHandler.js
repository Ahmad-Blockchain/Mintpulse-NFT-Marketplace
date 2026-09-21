export function errorHandler(err, _req, res, _next) {
    console.error("");
    console.error("=================================");
    console.error("Server Error");
    console.error("=================================");
    console.error(err);
    console.error("");
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
}
//# sourceMappingURL=errorHandler.js.map