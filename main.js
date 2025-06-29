document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const processButton = document.getElementById('process-button');
    const downloadButton = document.getElementById('download-button');
    const credentialsForm = document.getElementById('credentials-form');
    const alertContainer = document.getElementById('alert-container');
    const resultsSection = document.getElementById('results-section');
    const resultsTableBody = document.getElementById('results-table-body');
    const progressContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');

    let selectedFile = null;

    // --- UI Helper Functions ---
    const showAlert = (message, type = 'danger') => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertContainer.append(wrapper);
    };

    const clearAlerts = () => {
        alertContainer.innerHTML = '';
    };

    const resetUI = () => {
        clearAlerts();
        processButton.disabled = true;
        processButton.innerHTML = 'Process Charges';
        resultsSection.classList.add('hidden');
        resultsTableBody.innerHTML = '';
        downloadButton.classList.add('hidden');
        downloadButton.disabled = true;
        progressBarFill.style.width = '0%';
        progressContainer.classList.add('hidden');
        progressBarFill.classList.remove('bg-danger'); // Reset progress bar color
    };

    // --- File Input Handling ---
    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFileSelect(fileInput.files[0]);
        }
    });

    // Support for Drag and Drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.style.borderColor = 'var(--primary-glow)';
    });
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.style.borderColor = 'var(--border-color)';
    });
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    const handleFileSelect = (file) => {
        selectedFile = file;
        fileNameDisplay.textContent = file.name;
        fileNameDisplay.classList.remove('hidden');
        processButton.disabled = false;
        document.querySelector('.file-upload-text').classList.add('hidden');
    };

    // --- Main Processing Logic ---
    processButton.addEventListener('click', async () => {
        if (!selectedFile || !credentialsForm.checkValidity()) {
            showAlert('Please fill in all credentials and select a file.');
            return;
        }

        resetUI();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('customer_key', document.getElementById('customer-key').value);
        formData.append('username', document.getElementById('username').value);
        formData.append('password', document.getElementById('password').value);

        // --- UI Update for Processing Start ---
        processButton.disabled = true;
        processButton.innerHTML = '<i class="fas fa-cog fa-spin"></i> Processing...';
        progressContainer.classList.remove('hidden');
        progressBarFill.style.width = '10%'; // Initial small progress

        let progress = 10;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress < 90) {
                progressBarFill.style.width = `${progress}%`;
            }
        }, 500);

        try {
            // --- Single API Call ---
            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            // --- Success: Populate UI with Final Results ---
            progressBarFill.style.width = '100%';
            processButton.innerHTML = 'Processing Complete';
            resultsSection.classList.remove('hidden');

            // Populate the results table
            if (data.results && data.results.length > 0) {
                let tableHtml = '';
                data.results.forEach(row => {
                    tableHtml += `
                        <tr>
                            <td>${row.row_number || 'N/A'}</td>
                            <td>${row.practice_name || ''}</td>
                            <td>${row.patient_id || ''}</td>
                            <td>${row.results || 'Success'}</td>
                        </tr>
                    `;
                });
                resultsTableBody.innerHTML = tableHtml;
            } else {
                resultsTableBody.innerHTML = '<tr><td colspan="4">Processing finished, but no result data was returned.</td></tr>';
            }
            
            // **FIX 2**: Show summary alert including Error Rows
            showAlert(`Processing complete! Total Rows: ${data.total_rows}, Encounters Created: ${data.encounters_created}, Payments Posted: ${data.payments_posted}, Error Rows: ${data.failed_rows}.`, 'success');

            // **FIX 1**: Enable download button with correct attributes
            if (data.server_filename && data.download_filename) {
                // Construct the URL with the desired filename as a query parameter
                const downloadUrl = `/api/download_processed_file/${data.server_filename}?download_name=${encodeURIComponent(data.download_filename)}`;
                
                // Set both the href and the download attribute for robustness
                downloadButton.href = downloadUrl;
                downloadButton.setAttribute('download', data.download_filename);
                
                downloadButton.classList.remove('hidden');
                downloadButton.disabled = false;
            }

        } catch (error) {
            clearInterval(progressInterval);
            progressBarFill.style.width = '100%';
            progressBarFill.classList.add('bg-danger');
            showAlert(`An error occurred: ${error.message}`);
            processButton.innerHTML = 'Processing Failed';
        }
    });
});