# Tebra Automation Tool (TAT)

This project is a web-based automation tool designed to streamline charge entry and payment posting within the Tebra (formerly Kareo) platform. It provides a simple user interface for batch processing patient data from an Excel spreadsheet, leveraging the Tebra SOAP API to create encounters and post payments efficiently.

[Project Link](https://github.com/saqibcodes007/TAT)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Workflow](#workflow)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Features

* **Web-Based UI:** A clean, modern user interface for entering Tebra credentials and uploading Excel files for processing.
* **Batch Processing from Excel:** Accepts `.xlsx` or `.xls` files containing multiple patient charges and payments for bulk processing.
* **Dynamic Column Mapping:** Intelligently validates the uploaded spreadsheet and maps various column header names to the required data fields (e.g., "dos", "date of service" are both mapped to DOS).
* **Automated Charge Entry:** For each patient, the tool automatically:
    * Fetches patient and insurance details for verification.
    * Looks up and validates Practice, Service Location, and Provider IDs using the Tebra API.
    * Groups multiple procedures into a single encounter per patient per Date of Service.
    * Creates the encounter in Tebra with all service lines, modifiers, and diagnoses.
* **Automated Payment Posting:** Optionally posts patient payments from the spreadsheet, linking them to the correct patient and practice.
* **Instant Feedback and Reporting:** The UI provides a real-time summary of the batch process, including total rows, encounters created, payments posted, and error counts. A detailed, row-by-row status report can be downloaded as a formatted Excel file.
* **Cloud-Native Deployment:** Designed to be deployed as a simple web app on Microsoft Azure, with continuous deployment configured via GitHub Actions.

## Tech Stack

* **Language:** Python 3
* **Web Framework:** Flask
* **Data Manipulation:** Pandas
* **API Interaction:** Zeep (for SOAP APIs)
* **Frontend:** HTML5, CSS3, JavaScript
* **Hosting:** Microsoft Azure App Service
* **CI/CD:** GitHub Actions

## Workflow

The tool follows a simple, user-driven workflow:

1.  **Enter Credentials:** The user enters their Tebra API Customer Key, Username, and Password into the secure form fields.
2.  **Upload File:** The user uploads an Excel spreadsheet containing charge and/or payment data.
3.  **Process Request:** The user clicks "Process Charges." The Flask backend receives the file and credentials.
4.  **Data Validation:** The server validates the Excel file, checking for required columns and sheet names.
5.  **API Interaction:** The application loops through the data, making a series of calls to the Tebra SOAP API to:
    * Fetch patient and insurance information.
    * Post patient payments (if provided).
    * Group service lines and create encounters.
    * Fetch the final status and charge amounts for the newly created encounters.
6.  **Generate Report:** A new Excel file is generated in memory with the original data, augmented with new columns showing the results of the automation (e.g., Encounter ID, Charge Status, API error messages).
7.  **Display Results:** The UI is updated with a summary of the job. The user can then click the "Download Output Excel" button to get the detailed report, which is named based on the input file (e.g., `input_file TebraAuto Results.xlsx`).

## Usage

1.  **Navigate to the URL:** Open the URL of the deployed Azure Web App.
2.  **Enter Credentials:** Fill in your Tebra Customer Key, Username, and Password.
3.  **Upload File:** Drag and drop or browse to select your Excel file.
4.  **Process:** Click the "Process Charges" button.
5.  **Review & Download:** Wait for the processing to complete. The summary will appear on the screen. Click the "Download Output Excel" button to save the detailed report.

## Future Enhancements

* **Database Integration:** Store job history and results in a database for long-term tracking and analytics.
* **User Authentication:** Add a login system for users to protect access to the tool.
* **More Granular Error Handling:** Provide more specific suggestions to the user based on the type of API error received from Tebra.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss proposed changes.

## License

This project is licensed under the MIT License.

## Contact

**SAQIB SHERWANI**

[My GitHub](https://github.com/saqibcodes007)

[Email Me!](mailto:sherwanisaqib@gmail.com)

## Acknowledgements

* RCM and Billing Team at Panacea Smart Solutions for their subject matter expertise. 
* The Tebra API team for providing the SOAP web services.
* The developers behind Flask, Pandas, and other open-source libraries used in this project.

---
<p align="center">
  Developed by Saqib Sherwani
  <br>
  Copyright © 2025 • All Rights Reserved
</p>
