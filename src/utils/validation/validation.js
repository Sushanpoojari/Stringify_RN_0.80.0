export function validate(valueToBeValidated, extraProps) {
    const {
        isEmail = false,
        isPassword = false,
        maxLength = 0,
        minLength = 0,
    } = extraProps;

    // Email Validation
    if (isEmail) {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(valueToBeValidated)) {
            return { isValid: false, message: "Invalid email format." };
        }
    }

    // Password Validation
    if (isPassword) {
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(valueToBeValidated)) {
            return { 
                isValid: false, 
                message: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
            };
        }
    }

    // Min Length Validation
    if (minLength > 0 && String(valueToBeValidated).length < minLength) {
        return {
            isValid: false,
            message: `Minimum length should be ${minLength} characters.`,
        };
    }

    // Max Length Validation
    if (maxLength > 0 && String(valueToBeValidated).length > maxLength) {
        return {
            isValid: false,
            message: `Maximum length should be ${maxLength} characters.`,
        };
    }

    return { isValid: true, message: "Validation passed." };
}
