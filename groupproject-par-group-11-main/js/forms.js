// Registered Users
const REGISTERED_USERS = [
    "Alice Smith", "Bob Johnson", "Carol White", "David Brown", "Emma Davis"
];

// Valid Breeds
const VALID_BREEDS = [
    "Australian Shepherd", "Beagle", "Border Collie", "Boxer", "Bulldog",
    "Chihuahua", "Cocker Spaniel", "Dachshund", "Dalmatian", "Doberman Pinscher",
    "French Bulldog", "German Shepherd", "Golden Retriever", "Great Dane",
    "Greyhound", "Husky", "Jack Russell Terrier", "Labrador Retriever", "Maltese",
    "Miniature Schnauzer", "Poodle", "Pug", "Rottweiler", "Samoyed", "Shih Tzu",
    "Staffordshire Bull Terrier", "Weimaraner", "Whippet", "Yorkshire Terrier",
    "Mixed Breed / Other"
];

// Function to validate name
function validateNameField(fieldId, label, minLen, maxLen) {
    const el = document.getElementById(fieldId);
    const value = el ? el.value.trim() : "";
    clearError(fieldId);
    if (!isNotEmpty(value))
        showError(fieldId, label + " is required.");
    else if (!isAlphaOnly(value))
        showError(fieldId, label + " must contain alphabetic characters only.");
    else if (minLen !== undefined && !isValidLength(value, minLen, maxLen))
        showError(fieldId, label + " must be between " + minLen + " and " + maxLen + " characters.");
}

// Function to validate text
function validateTextField(fieldId, label, minLen, maxLen) {
    const el = document.getElementById(fieldId);
    const value = el ? el.value.trim() : "";
    clearError(fieldId);
    if (!isNotEmpty(value))
        showError(fieldId, label + " is required.");
    else if (minLen !== undefined && !isValidLength(value, minLen, maxLen))
        showError(fieldId, label + " must be between " + minLen + " and " + maxLen + " characters.");
}

// Function to validate email
function validateEmailField(fieldId, label, required) {
    const el = document.getElementById(fieldId);
    const value = el ? el.value.trim() : "";
    clearError(fieldId);
    if (required && !isNotEmpty(value))
        showError(fieldId, label + " is required.");
    else if (isNotEmpty(value) && !isValidEmail(value))
        showError(fieldId, "Please enter a valid email address (e.g. name@example.com).");
}

// Function to validate if number is an Australian number
function validatePhoneField(fieldId, label, required) {
    const el = document.getElementById(fieldId);
    const raw = el ? el.value.trim() : "";
    const normalized = raw.replace(/\s+/g, "");
    clearError(fieldId);
    if (required && !isNotEmpty(raw))
        showError(fieldId, label + " is required.");
    else if (isNotEmpty(raw) && !isValidAustralianMobile(normalized))
        showError(fieldId, label + " must be 10 digits and start with 04 or +61.");
}

// Function to validate optional texts
function validateNotesField(fieldId, label, maxChars) {
    const el = document.getElementById(fieldId);
    const value = el ? el.value.trim() : "";
    clearError(fieldId);
    if (value.length > maxChars)
        showError(fieldId, label + " cannot exceed " + maxChars + " characters.");
}

// Function to only allow numbers or + in phone number
function attachPhoneFilter(inputEl, fieldId) {
    inputEl.addEventListener("input", function () {
        const pos = inputEl.selectionStart;
        const cleaned = inputEl.value.replace(/(?!^\+)[^\d]/g, "");
        if (inputEl.value !== cleaned) {
            inputEl.value = cleaned;
            inputEl.setSelectionRange(Math.max(0, pos - 1), Math.max(0, pos - 1));
        }
        clearError(fieldId);
    });
}

// Function to only allow numbers on number only
function attachDigitFilter(inputEl, fieldId) {
    inputEl.addEventListener("input", function () {
        const pos = inputEl.selectionStart;
        const cleaned = inputEl.value.replace(/\D/g, "");
        if (inputEl.value !== cleaned) {
            inputEl.value = cleaned;
            inputEl.setSelectionRange(Math.max(0, pos - 1), Math.max(0, pos - 1));
        }
        clearError(fieldId);
    });
}

// Owner Registration
// Function to validate fields in the owner registration form
function validateOwnerField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    switch (fieldId) {
        // First name
        case "firstname": validateNameField("firstname", "First name", 2, 50); break;

        // Last name
        case "lastname": validateNameField("lastname", "Last name", 2, 50); break;

        // Mobile number
        case "mobile": validatePhoneField("mobile", "Mobile number", true); break;

        // Street address
        case "street": validateTextField("street", "Street", 2, 100); break;

        // Suburb address
        case "suburb": validateNameField("suburb", "Suburb", 2, 50); break;

        // Email address field
        case "email": validateEmailField("email", "Email address", true); break;

        // Postcode
        // Only numbers and 4 digits allowed
        case "postcode":
            clearError("postcode");
            if (!isNotEmpty(input.value.trim()))
                showError("postcode", "Postcode is required.");
            else if (!isValidPostcode(input.value.trim()))
                showError("postcode", "Postcode must be 4 digits.");
            break;

        // Australian state
        case "state":
            clearError("state");
            if (!isNotEmpty(input.value.trim()))
                showError("state", "Please select a state.");
            break;

        // Password
        // Password requirements
        case "password":
            clearError("password");
            if (!isNotEmpty(input.value.trim()))
                showError("password", "Password is required.");
            else if (!isValidLength(input.value.trim(), 8, 50))
                showError("password", "Password must be between 8 and 50 characters.");
            else if (!isValidStrongPassword(input.value.trim()))
                showError("password", "Password must include uppercase, lowercase, number, and special character.");
            const confirmInput = document.getElementById("confirm-password");
            if (confirmInput && confirmInput.value.trim())
                validateOwnerField("confirm-password");
            break;

        // Password confirmation
        // Must be the same as the password
        case "confirm-password": {
            const password = document.getElementById("password").value.trim();
            clearError("confirm-password");
            if (!isNotEmpty(input.value.trim()))
                showError("confirm-password", "Confirm password is required.");
            else if (!isValidConfirmPassword(password, input.value.trim()))
                showError("confirm-password", "Passwords do not match.");
            break;
        }
    }
}

// Event listener for dog owner registration form
(function setupOwnerForm() {
    const form = document.getElementById("dog-owner-information");
    if (!form) return;

    const fields = [
        "firstname", "lastname", "mobile", "street", "suburb",
        "postcode", "state", "email", "password", "confirm-password"
    ];

    // Blur event for validation
    fields.forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener("blur", function () { validateOwnerField(fieldId); });
        if (fieldId === "mobile") {
            attachPhoneFilter(input, fieldId);
        } else if (fieldId === "postcode") {
            attachDigitFilter(input, fieldId);
        } else {
            input.addEventListener("input", function () { clearError(fieldId); });
        }
    });

    // Submit form if valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fields.forEach(validateOwnerField);
        const hasErrors = fields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Owner Registration Successfully Submitted");
            event.target.submit();
        }
    });
})();

// Donor Registration
// Function to validate fields in the dog donor registration form
function validateDonorField(fieldId) {
    const input = document.getElementById(fieldId);

    switch (fieldId) {
        // Owner name
        case "owner-name": validateNameField("owner-name", "Owner name"); break;

        // Dog name
        case "dog-name": validateNameField("dog-name", "Dog name", 1, 30); break;

        // Dog breed
        case "breed": validateTextField("breed", "Breed"); break;

        // Dog age
        case "age": {
            clearError("age");
            const value = input ? input.value.trim() : "";
            const num = Number(value);
            if (!isNotEmpty(value))
                showError("age", "Age is required.");
            else if (isNaN(num) || num < 1 || num > 15)
                showError("age", "Age must be between 1 and 15 years.");
            break;
        }

        // Dog weight
        case "weight": {
            clearError("weight");
            const value = input ? input.value.trim() : "";
            const num = Number(value);
            if (!isNotEmpty(value))
                showError("weight", "Weight is required.");
            else if (isNaN(num) || num < 1 || num > 100)
                showError("weight", "Weight must be between 1 and 100 kg.");
            break;
        }

        // Dog gender
        case "gender": {
            clearError("gender");
            const value = input ? input.value.trim() : "";
            if (!isNotEmpty(value))
                showError("gender", "Please select a gender.");
            break;
        }

        // Dog vaccination status
        case "vaccination-status": {
            clearError("vaccination-status");
            const checked = document.querySelector('input[name="vaccination-status"]:checked');
            if (!checked)
                showError("vaccination-status", "Please select your dog's vaccination status.");
            break;
        }

        // Health declaration
        case "health-declaration": {
            clearError("health-declaration");
            const allChecked = ["health-declaration-1", "health-declaration-2", "health-declaration-3", "health-declaration-4"]
                .every(function (name) {
                    const el = document.querySelector('input[name="' + name + '"]');
                    return el && el.checked;
                });
            if (!allChecked)
                showError("health-declaration", "You must confirm all health declaration statements.");
            break;
        }
    }
}

// Event listener for dog donor registration form
(function setupDonorForm() {
    const form = document.getElementById("dog-donor-registration");
    if (!form) return;

    const inputFields = ["owner-name", "dog-name", "breed", "age", "weight", "gender"];

    inputFields.forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener("blur", function () { validateDonorField(fieldId); });
        input.addEventListener("change", function () { validateDonorField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    document.querySelectorAll('input[name="vaccination-status"]').forEach(function (radio) {
        radio.addEventListener("change", function () { validateDonorField("vaccination-status"); });
    });

    ["health-declaration-1", "health-declaration-2", "health-declaration-3", "health-declaration-4"].forEach(function (name) {
        const cb = document.querySelector('input[name="' + name + '"]');
        if (cb) cb.addEventListener("change", function () { validateDonorField("health-declaration"); });
    });

    const allFields = [...inputFields, "vaccination-status", "health-declaration"];
 
    // Submit form if valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        allFields.forEach(validateDonorField);
        const hasErrors = allFields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Registration submitted successfully!");
        }
    });
})();

// Donor Eligibility Assessment
(function setupDonorEligibilityAssessmentForm() {
    const form = document.getElementById("donor-eligibility-assessment");
    if (!form) return;

    const eligibleRadio = document.getElementById("status-eligible");
    const tempIneligibleRadio = document.getElementById("status-temp-ineligible");
    const permIneligibleRadio = document.getElementById("status-perm-ineligible");
    const ineligibilityDetails = document.getElementById("ineligibility-details");

    // Function to show/hide ineligibility details
    function toggleIneligibilityDetails() {
        ineligibilityDetails.hidden = !(tempIneligibleRadio.checked || permIneligibleRadio.checked);
    }

    eligibleRadio.addEventListener("change", toggleIneligibilityDetails);
    tempIneligibleRadio.addEventListener("change", toggleIneligibilityDetails);
    permIneligibleRadio.addEventListener("change", toggleIneligibilityDetails);

    // Function to validate fields in the donation eligibility assessment
    function validateField(fieldId) {
        const today = new Date().toISOString().split("T")[0];
        clearError(fieldId);

        switch (fieldId) {

            // Selected dog
            case "selected-dog": {
                const value = document.getElementById("selected-dog").value;
                if (!isNotEmpty(value))
                    showError(fieldId, "Please select a registered donor dog.");
                break;
            }

            // Assessment date
            case "assessment-date": {
                const value = document.getElementById("assessment-date").value;
                if (!isNotEmpty(value))
                    showError(fieldId, "Please enter the assessment date.");
                else if (value > today)
                    showError(fieldId, "Assessment date cannot be in the future.");
                break;
            }

            // Assessed by
            case "assessed-by": {
                const value = document.getElementById("assessed-by").value;
                if (!isNotEmpty(value))
                    showError(fieldId, "Please select an authorised staff member.");
                break;
            }

            // Eligibility status
            case "eligibility-status": {
                const checked = document.querySelector('input[name="eligibility-status"]:checked');
                if (!checked)
                    showError(fieldId, "Please select an eligibility status.");
                break;
            }

            // Reason for ineligibility
            case "reason-ineligibility": {
                if (tempIneligibleRadio.checked || permIneligibleRadio.checked) {
                    const value = document.getElementById("reason-ineligibility").value.trim();
                    if (!isNotEmpty(value))
                        showError(fieldId, "Please provide a reason for ineligibility.");
                }
                break;
            }

            // Next eligibility date
            case "next-eligible-date": {
                if (tempIneligibleRadio.checked) {
                    const value = document.getElementById("next-eligible-date").value;
                    if (!isNotEmpty(value))
                        showError(fieldId, "Please enter the next eligible date.");
                    else if (value <= today)
                        showError(fieldId, "Next eligible date must be in the future.");
                }
                break;
            }
        }
    }

    // Event listeners for donor eligibility assessment form
    ["selected-dog", "assessed-by"].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener("change", function () { validateField(fieldId); });
    });

    ["assessment-date", "next-eligible-date"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    document.querySelectorAll('input[name="eligibility-status"]').forEach(function (radio) {
        radio.addEventListener("change", function () { validateField("eligibility-status"); });
    });

    const reasonTextarea = document.getElementById("reason-ineligibility");
    reasonTextarea.addEventListener("blur", function () { validateField("reason-ineligibility"); });
    reasonTextarea.addEventListener("input", function () { clearError("reason-ineligibility"); });
    const fieldsToValidate = [
        "selected-dog", "assessment-date", "assessed-by",
        "eligibility-status", "reason-ineligibility", "next-eligible-date"
    ];

    // Submit form if valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fieldsToValidate.forEach(validateField);
        const hasErrors = fieldsToValidate.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Assessment submitted successfully!");
            event.target.submit();
        }
    });
})();

// Blood Donation Request
(function setupBloodDonationRequestForm() {
    const form = document.getElementById("blood-donation-request");
    if (!form) return;

    // Check if date is today or future
    function isDateTodayOrFuture(input) {
        const d = new Date(input);
        if (isNaN(d)) return false;
        d.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
    }

    // Function to validate fields in the blood donation request form
    function validateField(fieldId) {
        switch (fieldId) {

            // Requesting clinic name
            case "requestingclinicname": validateTextField("requestingclinicname", "Clinic name", 2, 50); break;

            // Clinic email
            case "clinic-email": validateEmailField("clinic-email", "Clinic email", true); break;

            // Clinic phone number
            case "clinic-phone": validatePhoneField("clinic-phone", "Clinic phone", true); break;

            // Blood type
            case "blood-type": {
                clearError("blood-type");
                if (!isNotEmpty(document.getElementById("blood-type").value))
                    showError("blood-type", "Please select a blood type.");
                break;
            }

            // Quantity
            // Max 10 ml
            case "quantity": {
                clearError("quantity");
                const value = document.getElementById("quantity").value.trim();
                if (!isNotEmpty(value)) {
                    showError("quantity", "Quantity is required.");
                } else {
                    const q = Number(value);
                    if (!Number.isInteger(q) || q < 1)
                        showError("quantity", "Quantity must be a positive integer (mL).");
                    else if (q > 10)
                        showError("quantity", "Quantity cannot exceed 10 mL.");
                }
                break;
            }

            // Urgency
            case "urgency": {
                clearError("urgency");
                if (!document.querySelector('input[name="urgency-status"]:checked'))
                    showError("urgency", "Please select an urgency level.");
                break;
            }

            // Required date
            // Date should be in the future
            case "requireddate": {
                clearError("requireddate");
                const value = document.getElementById("requireddate").value.trim();
                if (!isNotEmpty(value))
                    showError("requireddate", "Required date is required.");
                else if (!isDateTodayOrFuture(value))
                    showError("requireddate", "Required date cannot be in the past.");
                break;
            }

            // Clinic notes
            case "clinicnotes": validateNotesField("clinicnotes", "Clinical notes", 500); break;
        }
    }

    // Ensure only numbers can be typed in the quantity
    document.getElementById("quantity").addEventListener("keydown", function (e) {
        if (["e", "E", "+", "-", "."].indexOf(e.key) !== -1) e.preventDefault();
    });

    // Blur event for validation
    ["requestingclinicname", "clinic-email", "quantity"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    const clinicPhoneInput = document.getElementById("clinic-phone");
    clinicPhoneInput.addEventListener("blur", function () { validateField("clinic-phone"); });
    attachPhoneFilter(clinicPhoneInput, "clinic-phone");

    document.getElementById("blood-type").addEventListener("change", function () { validateField("blood-type"); });

    document.querySelectorAll('input[name="urgency-status"]').forEach(function (radio) {
        radio.addEventListener("change", function () { validateField("urgency"); });
    });

    ["requireddate", "clinicnotes"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    const allFields = ["requestingclinicname", "clinic-email", "clinic-phone", "blood-type", "quantity", "urgency", "requireddate", "clinicnotes"];

    // Submit form if valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        allFields.forEach(validateField);
        const hasErrors = allFields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Submitted! — Status: Under Review");
            event.target.submit();
        }
    });
})();

// Record Blood Donation
(function setupRecordBloodDonationForm() {
    const form = document.getElementById("record-blood-donation");
    if (!form) return;

    // Function to check if date is today or in the past
    function isDatePastOrToday(input) {
        const d = new Date(input);
        if (isNaN(d)) return false;
        d.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d <= today;
    }

    // Function to check if date is in the future and after the donation date
    function isDateFutureAndAfter(input, compareDate) {
        const d = new Date(input);
        if (isNaN(d)) return false;
        d.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d <= today) return false;
        if (compareDate) {
            const c = new Date(compareDate);
            if (isNaN(c)) return false;
            c.setHours(0, 0, 0, 0);
            return d > c;
        }
        return true;
    }

    // Function to validate fields in the record blood donation request
    function validateField(fieldId) {
        switch (fieldId) {

            // Clinic name
            case "clinicname": validateTextField("clinicname", "Clinic name", 2, 50); break;

            // Requesting dog name
            case "requestingdogname": validateTextField("requestingdogname", "Dog name", 2, 50); break;

            // Post donation notes
            case "postnotes": validateNotesField("postnotes", "Post-donation notes", 500); break;

            // Donation date
            case "donationdate": {
                clearError("donationdate");
                const value = document.getElementById("donationdate").value.trim();
                if (!isNotEmpty(value))
                    showError("donationdate", "Donation date is required.");
                else if (!isDatePastOrToday(value))
                    showError("donationdate", "Donation date must be this date or earlier.");
                break;
            }

            // Volume
            case "volume": {
                clearError("volume");
                const value = document.getElementById("volume").value.trim();
                if (!isNotEmpty(value)) {
                    showError("volume", "Volume is required.");
                } else {
                    const v = Number(value);
                    if (!Number.isFinite(v) || isNaN(v))
                        showError("volume", "Volume must be a number.");
                    else if (v < 50 || v > 500)
                        showError("volume", "Volume must be between 50 and 500 mL.");
                }
                break;
            }
            // End date
            case "enddate": {
                clearError("enddate");
                const donationDate = document.getElementById("donationdate").value.trim();
                const value = document.getElementById("enddate").value.trim();
                if (!isNotEmpty(value))
                    showError("enddate", "Recovery period end date is required.");
                else if (!isDateFutureAndAfter(value, donationDate))
                    showError("enddate", "Recovery period end date must be a future date and after the donation date.");
                break;
            }
        }
    }

    // Blur event listeners for validation
    ["clinicname", "requestingdogname", "volume"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    ["donationdate", "enddate"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    const postnotes = document.getElementById("postnotes");
    postnotes.addEventListener("blur", function () { validateField("postnotes"); });
    postnotes.addEventListener("input", function () { clearError("postnotes"); });

    const allFields = ["clinicname", "requestingdogname", "donationdate", "volume", "postnotes", "enddate"];

    // Submit form if valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        allFields.forEach(validateField);
        const hasErrors = allFields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Submitted — Status: Recorded");
            event.target.submit();
        }
    });
})();

// DonorClinic Matching
(function setupDonorClinicMatchingForm() {
    const form = document.getElementById("donor-clinic-matching");
    if (!form) return;

    // Function to validate fields in the donor-clinic matching
    function validateField(fieldId) {
        switch (fieldId) {

            // Notes
            case "notes": validateNotesField("notes", "Notes", 300); break;

            // Donation request
            case "donation-request": {
                clearError("donation-request");
                if (!isNotEmpty(document.getElementById("donation-request").value))
                    showError("donation-request", "Please select a donation request.");
                break;
            }

            // Donor dogs
            case "donor-dogs": {
                clearError("donor-dogs");
                const selected = Array.from(document.getElementById("donor-dogs").selectedOptions);
                if (selected.length === 0)
                    showError("donor-dogs", "Please select at least one donor dog.");
                break;
            }

            // Eligibility confirmation
            case "eligibility-confirmed": {
                clearError("eligibility-confirmed");
                if (!document.getElementById("eligibility-confirmed").checked)
                    showError("eligibility-confirmed", "You must confirm eligibility before submitting.");
                break;
            }

            // Match decision
            case "match-decision": {
                clearError("match-decision");
                if (!isNotEmpty(document.getElementById("match-decision").value))
                    showError("match-decision", "Please select a match decision.");
                break;
            }
        }
    }

    // Event listeners for validation
    ["donation-request", "match-decision"].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener("change", function () { validateField(fieldId); });
    });

    document.getElementById("donor-dogs").addEventListener("change", function () { validateField("donor-dogs"); });
    document.getElementById("eligibility-confirmed").addEventListener("change", function () { validateField("eligibility-confirmed"); });

    const notesInput = document.getElementById("notes");
    notesInput.addEventListener("blur", function () { validateField("notes"); });
    notesInput.addEventListener("input", function () { clearError("notes"); });

    const allFields = ["donation-request", "donor-dogs", "eligibility-confirmed", "match-decision", "notes"];

    // Submit if form is valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        allFields.forEach(validateField);
        const hasErrors = allFields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            alert("Match submitted successfully!");
            event.target.submit();
        }
    });
})();

// Contact Us
(function setupContactUsForm() {
    const form = document.getElementById("contact-us");
    if (!form) return;

    // Function to validate fields in the contact us form
    function validateField(fieldId) {
        switch (fieldId) {

            // First name
            case "firstname": validateNameField("firstname", "First name", 2, 50); break;

            // Last name
            case "lastname": validateNameField("lastname", "Last name", 2, 50); break;

            // Email address
            case "email": validateEmailField("email", "Email address", true); break;

            // Mobile number
            case "mobile": validatePhoneField("mobile", "Phone number", false); break;

            // Subject
            case "subject": validateTextField("subject", "Subject"); break;

            // Message
            case "message": validateTextField("message", "Message"); break;

            // Enquiry type
            case "enquiry-type": {
                clearError("enquiry-type");
                if (!isNotEmpty(document.getElementById("enquiry-type").value))
                    showError("enquiry-type", "Please select an enquiry type.");
                break;
            }
        }
    }

    // Event listeners for validation
    ["firstname", "lastname", "email", "subject", "message"].forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener("blur", function () { validateField(fieldId); });
        input.addEventListener("input", function () { clearError(fieldId); });
    });

    const mobileInput = document.getElementById("mobile");
    mobileInput.addEventListener("blur", function () { validateField("mobile"); });
    attachPhoneFilter(mobileInput, "mobile");

    document.getElementById("enquiry-type").addEventListener("change", function () { validateField("enquiry-type"); });

    const allFields = ["firstname", "lastname", "email", "mobile", "enquiry-type", "subject", "message"];

    // Submit if form is valid
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        allFields.forEach(validateField);
        const hasErrors = allFields.some(function (fieldId) {
            const el = document.getElementById(fieldId + "-error");
            return el && el.textContent !== "";
        });
        if (!hasErrors) {
            event.target.submit();
        }
    });
})();
