// Validation for Blood Donation Request form

// Helper: allow clinic names with letters, numbers and common punctuation
function isValidClinicName(input) {
    return isValidLength(input, 2, 100) && /^[A-Za-z0-9\s\.\-,'&()]+$/.test(input);
}

// Helper: generic phone validator (accepts digits with optional leading +, 8-15 chars)
function isValidPhone(input) {
    return /^\+?\d{8,15}$/.test(input);
}

// Helper: required date must be today or in the future
function isDateTodayOrFuture(input) {
    const d = new Date(input);
    if (isNaN(d)) return false;
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
}

document.getElementById("blood-donation-request").addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;

    // Clinic name
    const requestingclinicname = document.getElementById("requestingclinicname").value.trim();
    clearError("requestingclinicname");
    if (!isNotEmpty(requestingclinicname)) {
        showError("requestingclinicname", "Clinic name is required.");
        valid = false;
    } else if (!isValidLength(requestingclinicname, 2, 50)) {
        showError("requestingclinicname", "Clinic name must be between 2 and 50 characters.");
        valid = false;
    }

    // Clinic email
    const clinicEmail = document.getElementById("clinic-email").value.trim();
    clearError("clinic-email");
    if (!isNotEmpty(clinicEmail)) {
        showError("clinic-email", "Clinic email is required.");
        valid = false;
    } else if (!isValidEmail(clinicEmail)) {
        showError("clinic-email", "Enter a valid email address.");
        valid = false;
    }

    // Clinic phone
    const clinicPhone = document.getElementById("clinic-phone").value.trim();
    clearError("clinic-phone");
    if (!isNotEmpty(clinicPhone)) {
        showError("clinic-phone", "Clinic phone is required.");
        valid = false;
    } else if (!isValidAustralianMobile(clinicPhone)) {
        showError("clinic-phone", "Mobile number must be 10 digits and start with 04 or +61.");
        valid = false;
    } else if (!isValidLength(clinicPhone, 10, 15)) {
        showError("clinic-phone", "Mobile number must be between 10 and 15 characters.");
        valid = false;
    }


    // Blood type
    const bloodType = document.getElementById("blood-type").value;
    clearError("blood-type");
    if (!isNotEmpty(bloodType)) {
        showError("blood-type", "Please select a blood type.");
        valid = false;
    }

    // Quantity
    const quantityEl = document.getElementById("quantity");
    const quantityVal = quantityEl.value.trim();
    clearError("quantity");
    if (!isNotEmpty(quantityVal)) {
        showError("quantity", "Quantity is required.");
        valid = false;
    } else {
        const q = Number(quantityVal);
        if (!Number.isInteger(q) || q < 1) {
            showError("quantity", "Quantity must be a positive integer (mL).");
            valid = false;
        } else if (q > 10) {
            showError("quantity", "Quantity cannot exceed 10 mL.");
            valid = false;
        }
    }

    // Urgency (radio group)
    clearError("urgency");
    const urgencySelected = document.querySelector('input[name="urgency-status"]:checked');
    if (!urgencySelected) {
        showError("urgency", "Please select an urgency level.");
        valid = false;
    }

    // Required date
    const requiredDate = document.getElementById("requireddate").value.trim();
    clearError("requireddate");
    if (!isNotEmpty(requiredDate)) {
        showError("requireddate", "Required date is required.");
        valid = false;
    } else if (!isDateTodayOrFuture(requiredDate)) {
        showError("requireddate", "Required date cannot be in the past.");
        valid = false;
    }

    // Clinical notes
    const clinicNotes = document.getElementById("clinicnotes").value.trim();
    clearError("clinicnotes");
    if (clinicNotes.length > 0) {
        const words = clinicNotes.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 500) {
            showError("clinicnotes", "Clinical notes cannot exceed 500 words.");
            valid = false;
        }
    }

    if (valid) {
        // simple alert box
        alert("Submitted!— Status: Under Review");
        event.target.submit();
    }
});