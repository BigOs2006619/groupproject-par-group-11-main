document.getElementById("dog-owner-information").addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    // First name field
    // Get the value from the first name input and remove leading/trailing spaces
    const firstname = document.getElementById("firstname").value.trim();
    clearError("firstname");
    if (!isNotEmpty(firstname)) {
        showError("firstname", "First name is required.");
        valid = false;
    } else if (!isAlphaOnly(firstname)) {
        showError("firstname", "First name must contain alphabetic characters only.");
        valid = false;
    } else if (!isValidLength(firstname, 2, 50)) {
        showError("firstname", "First name must be between 2 and 50 characters.");
        valid = false;
    }

    // Last name field
    // Get the value from the last name input and remove leading/trailing spaces
    const lastname = document.getElementById("lastname").value.trim();
    clearError("lastname");
    if (!isNotEmpty(lastname)) {
        showError("lastname", "Last name is required.");
        valid = false;
    } else if (!isAlphaOnly(lastname)) {
        showError("lastname", "Last name must contain alphabetic characters only.");
        valid = false;
    } else if (!isValidLength(lastname, 2, 50)) {
        showError("lastname", "Last name must be between 2 and 50 characters.");
        valid = false;
    }

    // Mobile number field
    // Get the value from the mobile number input and remove leading/trailing spaces
    const mobile = document.getElementById("mobile").value.trim();
    clearError("mobile");
    if (!isNotEmpty(mobile)) {
        showError("mobile", "Mobile number is required.");
        valid = false;
    } else if (!isValidAustralianMobile(mobile)) {
        showError("mobile", "Mobile number must be 10 digits and start with 04 or +61.");
        valid = false;
    }   else if (!isValidLength(mobile, 10, 15)) {
        showError("mobile", "Mobile number must be between 10 and 15 characters.");
        valid = false;
    }
    
    // Street field
    // Get the value from the street input and remove leading/trailing spaces
    const street = document.getElementById("street").value.trim();
    clearError("street");
    if (!isNotEmpty(street)) {
        showError("street", "Street is required.");
        valid = false;
    } else if (!isValidLength(street, 2, 100)) {
        showError("street", "Street must be between 2 and 100 characters.");
        valid = false;
    }
    
    // Suburb field
    // Get the value from the suburb input and remove leading/trailing spaces
    const suburb = document.getElementById("suburb").value.trim();
    clearError("suburb");
    if (!isNotEmpty(suburb)) {
        showError("suburb", "Suburb is required.");
        valid = false;
    } else if (!isAlphaOnly(suburb)) {
        showError("suburb", "Suburb must contain alphabetic characters only.");
        valid = false;
    } else if (!isValidLength(suburb, 2, 50)) {
        showError("suburb", "Suburb must be between 2 and 50 characters.");
        valid = false;
    }

    // Postcode field
    // Get the value from the postcode input and remove leading/trailing spaces
    const postcode = document.getElementById("postcode").value.trim();
    clearError("postcode");
    if (!isNotEmpty(postcode)) {
        showError("postcode", "Postcode is required.");
        valid = false;
    } else if (!isValidPostcode(postcode)) {
        showError("postcode", "Postcode must be 4 digits.");
        valid = false;
    }

    // State field
    // Get the value from the state input and remove leading/trailing spaces
    const state = document.getElementById("state").value.trim();
    clearError("state");
    if (!isNotEmpty(state)) {
        showError("state", "State is required.");
        valid = false;
    } else if (!isValidAusState(state)) {
        showError("state", "State must be VIC, NSW, QLD, SA, WA, TAS, ACT or NT.");
        valid = false;
    }

    // Email field
    // Get the value from the email input and remove leading/trailing spaces
    const email = document.getElementById("email").value.trim();
    clearError("email");
    if (!isNotEmpty(email)) {
        showError("email", "Email is required.");
        valid = false;
    } else if (!isValidEmail(email)) {
        showError("email", "Email must be in a valid format.");
        valid = false;
    }

    // Password field
    // Get the value from the password input and remove leading/trailing spaces
    const password = document.getElementById("password").value.trim();
    clearError("password");
    if (!isNotEmpty(password)) {
        showError("password", "Password is required.");
        valid = false;
    } else if (!isValidLength(password, 8, 50)) {
        showError("password", "Password must be between 8 and 50 characters.");
        valid = false;
    } else if (!isValidStrongPassword(password)) {
        showError("password", "Password must include uppercase, lowercase, number, and special character.");
        valid = false;
    }

    // Confirm password field
    // Get the value from the confirm password input and remove leading/trailing spaces
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    clearError("confirm-password");
    if (!isNotEmpty(confirmPassword)) {
        showError("confirm-password", "Confirm password is required.");
        valid = false;
    } else if (!isValidConfirmPassword(password, confirmPassword)) {
        showError("confirm-password", "Passwords do not match.");
        valid = false;
    }

    // If all validations pass, submit the form
    if (valid) {
        event.target.submit();
    }
});