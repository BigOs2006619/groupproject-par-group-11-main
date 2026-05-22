// Valdiation for Dog Donor Form


// Function to confirm if the form is not empty
function isNotEmpty(input) {
   return input.length > 0;
}
 // function to confirm if the form is only alphabetical characters and spaces
function isAlphaOnly(input) {
    return /^[A-Za-z\s]+$/.test(input);
}
// Function to validate the length of the input
function isValidLength(input, min, max) {
    return input.length >= min && input.length <= max;
}

// Function clear error message for a specific field
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + "-error");
    if (errorElement) {        errorElement.textContent = "";
    }}

    // Function to show error message for a specific field
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "-error");
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Function to validate First Name and can only be Alphabetical characters
function isValidFirstName(input) {
    return isValidLength(input, 2, 250) && isAlphaOnly(input);
}

//Function to validate Last Name and can only be Alphabetical characters
function isValidLastName(input) {
    return isValidLength(input, 2, 250) && isAlphaOnly(input);
}

//Function to validate Australian Mobile Number, can only be 10 Digits and must start with 04 or +61
function isValidAustralianMobile(input) {
    return /^(04|\+614)\d{8}$/.test(input);
}

//Function to validate Email Address, must be valid email format
function isValidEmail(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

// FUnction to validate Street
function isValidStreet(input) {
    return isValidLength(input, 2, 250);
}

// Function to validate suburb and can only be Alphabetical characters
function isValidSuburb(input) {
    return isValidLength(input, 2, 250) && isAlphaOnly(input);
}

// Function to validate State, can only be VIC, NSW, QLD, SA, WA, TAS, ACT or NT
function isValidAusState(input) {
    return /^(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)$/.test(input);
}

// Function to validate Postcode, can only be 4 Digits
function isValidPostcode(input) {
    return /^\d{4}$/.test(input);
}


// Function for a strong password, must be a minimum minimum 8 characters; must include uppercase, lowercase, number, and special character
function isValidStrongPassword(input) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input);
}

// Function to validate confirm password, must match password
function isValidConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
}

// ─── Active Nav Highlighting ──────────────────────────────────────────────────
(function setActiveNav() {
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf("/") + 1);
    if (!currentPage) return;
    document.querySelectorAll(".header-nav nav ul li a").forEach(function (link) {
        const href = link.getAttribute("href") || "";
        const linkPage = href.replace(/^.*\//, "");
        if (linkPage && linkPage === currentPage) {
            link.classList.add("active");
        }
    });
})();









