export class ApiResponse {
    // ==========================================================
    // Success Response (200)
    // ==========================================================
    static success(res, message, data = null) {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }
    // ==========================================================
    // Created Response (201)
    // ==========================================================
    static created(res, message, data = null) {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }
    // ==========================================================
    // Error Response
    // ==========================================================
    static error(res, statusCode, message) {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
    // ==========================================================
    // Paginated Response
    // ==========================================================
    static paginated(res, message, data, page, limit, total) {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
}
//# sourceMappingURL=apiResponse.js.map