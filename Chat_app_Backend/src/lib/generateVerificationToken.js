export const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
    // This will generate a random 6 digit number as a string
}