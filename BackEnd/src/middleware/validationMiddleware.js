const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorList = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));

        return res.status(400).json({
            success: false,
            message: errorList[0].message, // headline error for simple frontend display
            errors: errorList,
        });
    }

    next();
};

module.exports = validate;
