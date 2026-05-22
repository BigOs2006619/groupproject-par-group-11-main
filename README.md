# SEF Project Repository README Template

## How to use this file?
Use this README as a short project summary for assessment and marking.

Keep the structure below, replace the placeholder text with your own project details, and remove any sections or prompts that are not relevant to your submission.

Write clearly and concisely. The goal is to help the marker quickly understand:

- who is in the group
- how to set up and run the project
- how to use the application
- which accounts are available for testing

### Group Name:

Par-Group-11

### Group Member List:
List the **full name** and **student ID** for each team member.

1. **Student 1** - Khalid Hussien, 20327718
2. **Student 2** - Zakariya Dib, 22224559
3. **Student 3** - Omar Yaghi, 22210592
4. **Student 4** - Stephen Elijah Perez, 22180389
----  

### Installation and setup instructions.
Provide the steps the marker needs to follow to install, configure, and run your project.

Include only the instructions that are necessary for marking. If your project needs environment variables, database setup, admin account creation, seed data, or package installation, include those details here.

For example, You may wish to include:

- Python version
- virtual environment setup
- dependency installation
- database migration commands
- fixture or seed-data loading steps
- how to start the development server
- any special notes for the marker

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install dependencies.
4. Apply migrations and load any required data.
5. Start the application.
6. Add any additional project-specific steps here.
----

### Brief user guide for using the application.
Briefly explain how the marker should test the main features of your system.

Focus on the most important workflows and pages. Keep this section practical and easy to follow.

#### Landing Page

- The landing page is Index.html were customers are greated with the services given to Dwight Doggy Donors.

#### Main web pages and their purpose

- **inedx.html** - This page is homepage of Dwight Doggy Donor website.
- **dog-owner-registration.html** - This is the page for registering the Dog Owner.
- **dog-donor-registration.html** - This is the page for registering the Dog Donor.
- **pages/donor-eligibility-assessment.html** - Allows registered dog owners to view their donor elligiblity status.
- **pages/blood-donation-request.html** - Grants requests for donation requests.
- **pages/donor-clinic-matching.html** - This is where donors are matched for specific clinics.
- **pages/record-blood-donation.html** - Donor's information record used after donation.
- **pages/contact-us.html** - Contact us page for keeping contact with Dwight Doggy Donors.

----

#### User credentials and their associated roles.
List every user account required for marking.

Ensure that:

- all test users created in the database are included
- each account clearly states its role or permission level
- passwords are listed in **plain text**
- the marker can tell which account should be used to test which feature

- **Admin user** - username/email: `...`, password: `...`, role: `...`
- **Staff user** - username/email: `...`, password: `...`, role: `...`
- **Standard user** - username/email: `...`, password: `...`, role: `...`
- Add more accounts if needed
----
