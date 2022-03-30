function userCredentialsAreValid(email, confirmEmail, password, street, postal, city) {
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