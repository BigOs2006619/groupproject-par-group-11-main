// Track donation row count for numbering
let donationRowCount = 1;

// Function to add a new donation row to the table
document.getElementById("add-donation-btn").addEventListener("click", function () {
    donationRowCount++;
    const tbody = document.getElementById("donation-history-body");
    const row = document.createElement("tr");
    row.classList.add("donation-row");
    row.innerHTML = `
        <td>${donationRowCount}</td>
        <td><input type="date" name="donation-date[]" /></td>
        <td><input type="text" name="donation-notes[]" placeholder="Optional notes" /></td>
        <td><button type="button" class="remove-donation-btn" onclick="removeDonationRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
    attachRowListeners(row);
});

// Function to remove a donation row and re-number remaining rows
function removeDonationRow(btn) {
    btn.closest("tr").remove();
    renumberDonationRows();
}

// Function to re-number all donation rows after a removal
function renumberDonationRows() {
    document.querySelectorAll("#donation-history-body .donation-row").forEach(function (row, i) {
        row.cells[0].textContent = i + 1;
    });
    donationRowCount = document.querySelectorAll("#donation-history-body .donation-row").length;
}

// Blur event listeners for validation
function attachRowListeners(row) {
    const dateInput = row.querySelector('input[name="donation-date[]"]');
    const notesInput = row.querySelector('input[name="donation-notes[]"]');
    if (dateInput) dateInput.addEventListener("blur", validateDonationRows);
    if (notesInput) notesInput.addEventListener("blur", validateDonationRows);
    if (dateInput) dateInput.addEventListener("input", function () { clearError("donation-history"); });
    if (notesInput) notesInput.addEventListener("input", function () { clearError("donation-history"); });
}

// Function to validate donation history rows
// Dates must be in the past and notes are limiterd to 200 characters
function validateDonationRows() {
    const today = new Date().toISOString().split("T")[0];
    const dates = document.querySelectorAll('input[name="donation-date[]"]');
    const notes = document.querySelectorAll('input[name="donation-notes[]"]');
    clearError("donation-history");

    for (let i = 0; i < dates.length; i++) {
        if (dates[i].value !== "" && dates[i].value >= today) {
            showError("donation-history", "Donation #" + (i + 1) + " date must be in the past.");
            return;
        }
    }
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].value.length > 200) {
            showError("donation-history", "Donation #" + (i + 1) + " notes cannot exceed 200 characters.");
            return;
        }
    }
}

// Function to validate fields in the donation eligibility form
function validateField(fieldId) {
    const today = new Date().toISOString().split("T")[0];
    clearError(fieldId);

    switch (fieldId) {
        // Dog name
        case "dog-name": {
            const value = document.getElementById("dog-name").value;
            if (!isNotEmpty(value))
                showError(fieldId, "Please select a donor dog.");
            break;
        }

        // Eligibility status
        case "eligibility-status": {
            const checked = document.querySelector('input[name="eligibility-status"]:checked');
            if (!checked)
                showError(fieldId, "Please select an eligibility status.");
            break;
        }

        // Last assessment date
        case "last-assessment-date": {
            const value = document.getElementById("last-assessment-date").value;
            if (!isNotEmpty(value))
                showError(fieldId, "Please enter the last assessment date.");
            else if (value > today)
                showError(fieldId, "Last assessment date must be today or in the past.");
            break;
        }

        // Assessed by
        case "assessed-by": {
            const value = document.getElementById("assessed-by").value;
            if (!isNotEmpty(value))
                showError(fieldId, "Please select an authorised staff member.");
            break;
        }

        // Next eligible donation
        case "next-eligible-donation-date": {
            const value = document.getElementById("next-eligible-donation-date").value;
            if (isNotEmpty(value) && value <= today)
                showError(fieldId, "Next eligible donation date must be in the future.");
            break;
        }
    }
}

attachRowListeners(document.querySelector("#donation-history-body .donation-row"));

["dog-name", "assessed-by"].forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("change", function () {
        validateField(fieldId);
    });
});

// Blur event listeners for validation
["last-assessment-date", "next-eligible-donation-date"].forEach(function (fieldId) {
    const input = document.getElementById(fieldId);
    input.addEventListener("blur", function () { validateField(fieldId); });
    input.addEventListener("input", function () { clearError(fieldId); });
});

document.querySelectorAll('input[name="eligibility-status"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        validateField("eligibility-status");
    });
});

// Validate all fields before submission/ submit if form is valid
document.getElementById("donation-eligibility").addEventListener("submit", function (event) {
    event.preventDefault();

    ["dog-name", "eligibility-status", "last-assessment-date", "assessed-by", "next-eligible-donation-date"]
        .forEach(validateField);
    validateDonationRows();

    const fields = ["dog-name", "eligibility-status", "last-assessment-date", "assessed-by", "donation-history", "next-eligible-donation-date"];
    const hasErrors = fields.some(function (fieldId) {
        const el = document.getElementById(fieldId + "-error");
        return el && el.textContent !== "";
    });

    if (!hasErrors) {
        alert("Eligibility and status saved successfully!");
        event.target.submit();
    }
});
