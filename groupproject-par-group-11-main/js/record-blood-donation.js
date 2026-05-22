// Validation for Record Blood Donation form

// Donation date must be today or in the past
function isDatePastOrToday(input) {
    const d = new Date(input);
    if (isNaN(d)) return false;
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d <= today;
}

// Date must be in the future and (optionally) strictly after compareDate
function isDateFutureAndAfter(input, compareDate) {
    const d = new Date(input);
    if (isNaN(d)) return false;
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (d <= today) return false;
    if (compareDate) {
        const c = new Date(compareDate);
        if (isNaN(c)) return false;
        c.setHours(0,0,0,0);
        return d > c;
    }
    return true;
}


document.getElementById("record-blood-donation").addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;

    // Receiving Clinic
    const clinicname = document.getElementById("clinicname").value.trim();
    clearError("clinicname");
    if (!isNotEmpty(clinicname)) {
        showError("clinicname", "Clinic name is required.");
        valid = false;
    } else if (!isValidLength(clinicname, 2, 50)) {
        showError("clinicname", "Clinic name must be between 2 and 50 characters.");
        valid = false;
    }

    //Selected Dog
    const requestingdogname = document.getElementById("requestingdogname").value.trim();
    clearError("requestingdogname");
    if (!isNotEmpty(requestingdogname)) {
        showError("requestingdogname", "Dog name is required.");
        valid = false;
    } else if (!isValidLength(requestingdogname, 2, 50)) {
        showError("requestingdogname", "Dog name must be between 2 and 50 characters.");
        valid = false;
    }


    // Donation Date - required; current or past date
    const donationDate = document.getElementById("donationdate").value.trim();
    clearError("donationdate");
    if (!isNotEmpty(donationDate)) {
        showError("donationdate", "Donation date is required.");
        valid = false;
    } else if (!isDatePastOrToday(donationDate)) {
        showError("donationdate", "Donation date must be this date or earlier.");
        valid = false;
    }


    // Volume Donated - required; numeric; 50-500 mL
    const volumeRaw = document.getElementById("volume").value.trim();
    clearError("volume");
    if (!isNotEmpty(volumeRaw)) {
        showError("volume", "Volume is required.");
        valid = false;
    } else {
        const v = Number(volumeRaw);
        if (!Number.isFinite(v) || Number.isNaN(v)) {
            showError("volume", "Volume must be a number.");
            valid = false;
        } else if (v < 50 || v > 500) {
            showError("volume", "Volume must be between 50 and 500 mL.");
            valid = false;
        }
    }

    // Post-Donation Notes / Complications - optional; max 500 characters
    const postNotes = document.getElementById("postnotes").value.trim();
    clearError("postnotes");
    if (postNotes.length > 500) {
        showError("postnotes", "Post-donation notes cannot exceed 500 characters.");
        valid = false;
    }

    // Recovery Period End Date - required; future date and after Donation Date
    const endDate = document.getElementById("enddate").value.trim();
    clearError("enddate");
    if (!isNotEmpty(endDate)) {
        showError("enddate", "Recovery period end date is required.");
        valid = false;
    } else if (!isDateFutureAndAfter(endDate, donationDate)) {
        showError("enddate", "Recovery period end date must be a future date and after the donation date.");
        valid = false;
    }

    if (valid) {
        alert("Submitted — Status: Recorded");
        event.target.submit();
    }
});