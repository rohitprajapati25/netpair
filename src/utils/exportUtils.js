/**
 * Export utilities for CSV, Excel, PDF and other formats
 */

/**
 * Convert array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export data to Excel format (basic implementation)
 * @param {Array} data - Data to export
 * @param {string} filename - Filename
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // For now, export as CSV with .xlsx extension
  // In a real implementation, you would use a library like xlsx or exceljs
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join('\t'),
    ...data.map(row => 
      headers.map(header => row[header] || '').join('\t')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export data to PDF format (basic implementation)
 * @param {Array} data - Data to export
 * @param {string} filename - Filename
 */
export const exportToPDF = (data, filename = 'export.pdf') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Basic HTML to PDF conversion
  // In a real implementation, you would use a library like jsPDF or html2pdf
  const headers = Object.keys(data[0]);
  const htmlContent = `
    <html>
      <head>
        <title>Report Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          h1 { color: #333; text-align: center; }
        </style>
      </head>
      <body>
        <h1>IMS Report Export</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};

/**
 * Format data for export based on tab type
 * @param {Array} data - Raw data array
 * @param {string} tab - Tab type (attendance, projects, tasks, etc.)
 * @returns {Array} Formatted data for export
 */
export const formatDataForExport = (data, tab) => {
  if (!data || data.length === 0) return [];

  switch (tab) {
    case 'overview':
      return data.map(item => ({
        'Metric': item.name || item.metric || '',
        'Value': item.value || item.count || '',
        'Change': item.change || '',
        'Period': item.period || '',
        'Status': item.status || '',
        'Last Updated': item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''
      }));

    case 'attendance':
      return data.map(item => ({
        'Employee ID': item._id?.slice(-6) || '',
        'Employee Name': item.employee?.name || item.emp?.name || item.name || '',
        'Department': item.department || item.employee?.department || '',
        'Date': item.date ? new Date(item.date).toLocaleDateString() : '',
        'Check In': item.checkInTime || '',
        'Check Out': item.checkOutTime || '',
        'Status': item.status || '',
        'Hours Worked': item.hoursWorked || '',
        'Overtime': item.overtime || '',
        'Remarks': item.remarks || ''
      }));

    case 'projects':
      return data.map(item => ({
        'Project ID': item._id?.slice(-6) || '',
        'Project Name': item.name || item.title || '',
        'Status': item.status || '',
        'Priority': item.priority || '',
        'Start Date': item.startDate ? new Date(item.startDate).toLocaleDateString() : '',
        'End Date': item.endDate ? new Date(item.endDate).toLocaleDateString() : '',
        'Team Size': (item.assignedEmployees || item.teamMembers || []).length || 0,
        'Progress': item.progress || 0,
        'Budget': item.budget || '',
        'Budget Used': item.budgetUsed || '',
        'Manager': item.manager?.name || item.createdBy?.name || '',
        'Created Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
      }));

    case 'tasks':
      return data.map(item => ({
        'Task ID': item._id?.slice(-6) || '',
        'Task Title': item.task_title || item.title || '',
        'Project': item.project_id?.name || item.project?.name || '',
        'Assigned To': item.assigned_to?.name || item.assignedTo?.name || '',
        'Assigned By': item.assigned_by?.name || item.assignedBy?.name || '',
        'Status': item.status || '',
        'Priority': item.priority || '',
        'Progress': item.progress || 0,
        'Start Date': item.start_date ? new Date(item.start_date).toLocaleDateString() : '',
        'Due Date': item.due_date ? new Date(item.due_date).toLocaleDateString() : '',
        'Estimated Hours': item.estimatedHours || '',
        'Actual Hours': item.actualHours || '',
        'Description': item.description || '',
        'Created Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
      }));

    case 'timesheets':
      return data.map(item => ({
        'Timesheet ID': item._id?.slice(-6) || '',
        'Employee Name': item.employee_id?.name || item.employee?.name || '',
        'Project': item.project_id?.name || item.project?.name || '',
        'Task': item.task_id?.task_title || item.task?.title || '',
        'Date': item.date ? new Date(item.date).toLocaleDateString() : '',
        'Hours Worked': item.hours_worked || '',
        'Billable Hours': item.billable_hours || '',
        'Overtime Hours': item.overtime_hours || '',
        'Work Description': item.work_description || '',
        'Status': item.status || '',
        'Approved By': item.approvedBy?.name || '',
        'Submitted Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
      }));

    case 'leave':
      return data.map(item => ({
        'Leave ID': item._id?.slice(-6) || '',
        'Employee Name': item.employeeId?.name || item.employee?.name || item.name || '',
        'Leave Type': item.leaveType || item.type || '',
        'From Date': item.fromDate ? new Date(item.fromDate).toLocaleDateString() : '',
        'To Date': item.toDate ? new Date(item.toDate).toLocaleDateString() : '',
        'Days': item.days || '',
        'Status': item.status || '',
        'Reason': item.reason || '',
        'Applied Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        'Approved By': item.approvedBy?.name || '',
        'Approved Date': item.approvedDate ? new Date(item.approvedDate).toLocaleDateString() : '',
        'Balance Before': item.balanceBefore || '',
        'Balance After': item.balanceAfter || ''
      }));

    case 'assets':
      return data.map(item => ({
        'Asset ID': item._id?.slice(-6) || '',
        'Asset Name': item.name || '',
        'Category': item.category || '',
        'Serial Number': item.serialNumber || '',
        'Status': item.status || '',
        'Assigned To': item.assignedTo?.name || '',
        'Purchase Date': item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '',
        'Warranty Expiry': item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : '',
        'Value': item.value || '',
        'Depreciation': item.depreciation || '',
        'Location': item.location || '',
        'Vendor': item.vendor || '',
        'Maintenance Due': item.maintenanceDue ? new Date(item.maintenanceDue).toLocaleDateString() : ''
      }));

    case 'hr':
      return data.map(item => ({
        'Employee ID': item._id?.slice(-6) || '',
        'Employee Name': item.name || '',
        'Department': item.department || '',
        'Designation': item.designation || '',
        'Join Date': item.joinDate ? new Date(item.joinDate).toLocaleDateString() : '',
        'Employment Type': item.employmentType || '',
        'Salary': item.salary || '',
        'Performance Rating': item.performanceRating || '',
        'Last Appraisal': item.lastAppraisal ? new Date(item.lastAppraisal).toLocaleDateString() : '',
        'Training Hours': item.trainingHours || '',
        'Certifications': item.certifications || '',
        'Status': item.status || ''
      }));

    default:
      // Generic export for unknown tab types
      return data.map(item => {
        const formatted = {};
        Object.keys(item).forEach(key => {
          if (key === '_id') {
            formatted['ID'] = item[key]?.slice(-6) || '';
          } else if (key.includes('Date') || key.includes('date')) {
            formatted[key] = item[key] ? new Date(item[key]).toLocaleDateString() : '';
          } else if (typeof item[key] === 'object' && item[key]?.name) {
            formatted[key] = item[key].name;
          } else {
            formatted[key] = item[key] || '';
          }
        });
        return formatted;
      });
  }
};

/**
 * Export data to JSON format
 * @param {Array} data - Data to export
 * @param {string} filename - Filename
 */
export const exportToJSON = (data, filename = 'export.json') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};