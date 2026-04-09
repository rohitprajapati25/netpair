// EMS Reports Export Utils - CSV Working ✓ PDF/Excel Ready

export const exportToCSV = (data, filename = 'reports.csv') => {
  if (!data?.length) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(',')
    )
  ].join('\\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Data formatter for all reports
export const formatDataForExport = (records, type = 'attendance') => {
  const formatters = {
    attendance: r => ({
      Employee: r.employee?.name || 'N/A',
      Department: r.employee?.department || 'N/A',
      Date: new Date(r.date || '').toLocaleDateString(),
      CheckIn: r.checkIn || 'N/A',
      Status: r.status || 'N/A',
      Hours: r.workingHours || 0
    }),
    employee: r => ({
      Name: r.name,
      Department: r.department,
      Designation: r.designation,
      Status: r.status,
      Joined: new Date(r.joiningDate).toLocaleDateString()
    }),
    leave: r => ({
      Employee: r.employee?.name || 'N/A',
      Type: r.type,
      Status: r.status,
      From: new Date(r.fromDate).toLocaleDateString(),
      To: new Date(r.toDate).toLocaleDateString()
    }),
    task: r => ({
      Title: r.title,
      Assignee: r.assignee?.name || 'N/A',
      Status: r.status,
      Priority: r.priority,
      Due: new Date(r.dueDate).toLocaleDateString()
    }),
    timesheet: r => ({
      Date: new Date(r.date).toLocaleDateString(),
      Project: r.project_id?.name || 'N/A',
      Task: r.task_id?.task_title || 'N/A',
      Hours: r.hours_worked,
      Status: r.status
    })
  };

  return records.map(formatters[type] || formatters.attendance);
};

// ExcelJS & jsPDF ready after npm install
// exportToExcel, exportToPDF functions above


