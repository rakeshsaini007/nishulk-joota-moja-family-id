/**
 * Google Apps Script for Student Data Management
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Replace the code in the editor with this content.
 * 4. Save the project (e.g., "StudentDataBackend").
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select type "Web App".
 * 7. Set "Execute as" to "Me".
 * 8. Set "Who has access" to "Anyone".
 * 9. Copy the Web App URL and paste it into your React app's GAS_URL constant.
 */

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var result;

  try {
    if (action === 'fetchBySchoolCode') {
      result = fetchBySchoolCode(params.schoolCode);
    } else if (action === 'updateStudentRecord') {
      result = updateStudentRecord(params.data);
    } else {
      result = { success: false, message: 'Invalid action' };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function fetchBySchoolCode(schoolCode) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0]; // Assuming data is in the first sheet
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var students = [];

  // Find column indices
  var colIndices = {};
  headers.forEach(function(header, index) {
    colIndices[header.trim()] = index;
  });

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // The prompt says UDiseSchoolCode is the search key
    if (row[colIndices['UDiseSchoolCode']].toString() === schoolCode.toString()) {
      var student = {};
      headers.forEach(function(header, index) {
        student[header.trim()] = row[index];
      });
      students.push(student);
    }
  }

  return { success: true, data: students };
}

function updateStudentRecord(studentData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  var serialNumCol = -1;
  var rationStatusCol = -1;
  var statusCol = -1;
  var familyIdStatusCol = -1;
  var familyIdCol = -1;
  var reasonCol = -1;

  headers.forEach(function(header, index) {
    var h = header.trim();
    if (h === 'Serial Number') serialNumCol = index;
    if (h === 'Ration Card Status') rationStatusCol = index;
    if (h === 'status') statusCol = index;
    if (h === 'Family ID status') familyIdStatusCol = index;
    if (h === 'New FamilyId') familyIdCol = index;
    if (h === 'Reason') reasonCol = index;
  });

  if (serialNumCol === -1) {
    return { success: false, message: 'Serial Number column not found' };
  }

  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (data[i][serialNumCol].toString() === studentData['Serial Number'].toString()) {
      var rowIdx = i + 1;
      if (rationStatusCol !== -1) sheet.getRange(rowIdx, rationStatusCol + 1).setValue(studentData['Ration Card Status'] || '');
      if (statusCol !== -1) sheet.getRange(rowIdx, statusCol + 1).setValue(studentData['status'] || '');
      if (familyIdStatusCol !== -1) sheet.getRange(rowIdx, familyIdStatusCol + 1).setValue(studentData['Family ID status'] || '');
      if (familyIdCol !== -1) sheet.getRange(rowIdx, familyIdCol + 1).setValue(studentData['New FamilyId'] || '');
      if (reasonCol !== -1) sheet.getRange(rowIdx, reasonCol + 1).setValue(studentData['Reason'] || '');
      
      found = true;
      break;
    }
  }

  if (found) {
    return { success: true, message: 'Data updated successfully' };
  } else {
    return { success: false, message: 'Student not found' };
  }
}
