// Google Apps Script Code for Google Sheets Integration
// Copy this code to Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Get the active spreadsheet (replace with your spreadsheet ID)
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Debug: Log the received data
    console.log('Received data:', data);
    
    // Prepare the row data - handles all form types
    const rowData = [
      data.timestamp || new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.enrollment || data.course || '', // enrollment for hero form, course for contact form
      data.requirements || data.message || data.query || '', // requirements for hero form, message for contact form, query for popup
      data.formType || 'Unknown Form'
    ];
    
    // Debug: Log the row data being inserted
    console.log('Row data to insert:', rowData);
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true, receivedData: data}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("This script is for POST requests only")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Optional: Function to set up the sheet headers
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Set headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Name', 
      'Phone',
      'Email',
      'Enrollment/Course',
      'Requirements/Message/Query',
      'Form Type'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#f0f0f0');
  }
}
