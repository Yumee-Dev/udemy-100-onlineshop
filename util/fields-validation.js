function userCredentialsAreValid(email, confirmEmail, password) {
    return (
        email &&
        confirmEmail &&
        password &&
        password.trim().length >= 6 &&
        email === confirmEmail &&
        email.includes('@')
    );
}

module.exports = {
    userCredentialsAreValid: userCredentialsAreValid
};