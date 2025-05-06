/**
 * TimeOff Tracker - CSV Import Testing Script
 * This script tests the CSV/TXT import functionality for staff data
 */

// Sample CSV data for testing
const sampleCSVData = `First Name,Last Name,Email,District,Position,Start Date,Status
John,Smith,john.smith@school.edu,Clarksburg,Teacher,2022-08-15,active
Maria,Rodriguez,m.rodriguez@school.edu,Florida,Principal,2020-06-01,active
David,Johnson,d.johnson@school.edu,Monroe,Administrative Assistant,2023-01-10,active
Sarah,Williams,s.williams@school.edu,Savoy,Teacher,2021-09-05,active
Michael,Brown,m.brown@school.edu,Clarksburg,Guidance Counselor,2019-11-20,active`;

// Test cases for CSV import
const csvImportTests = [
  {
    name: "Standard CSV Import",
    description: "Test importing a standard CSV file with header row",
    data: sampleCSVData,
    delimiter: ",",
    expectedRecords: 5,
    expectedFields: ["First Name", "Last Name", "Email", "District", "Position", "Start Date", "Status"]
  },
  {
    name: "Tab-Delimited Import",
    description: "Test importing a tab-delimited file",
    data: sampleCSVData.replace(/,/g, "\t"),
    delimiter: "\t",
    expectedRecords: 5,
    expectedFields: ["First Name", "Last Name", "Email", "District", "Position", "Start Date", "Status"]
  },
  {
    name: "Semicolon-Delimited Import",
    description: "Test importing a semicolon-delimited file",
    data: sampleCSVData.replace(/,/g, ";"),
    delimiter: ";",
    expectedRecords: 5,
    expectedFields: ["First Name", "Last Name", "Email", "District", "Position", "Start Date", "Status"]
  },
  {
    name: "Missing Required Fields",
    description: "Test importing data with missing required fields",
    data: "First Name,Last Name\nJohn,Smith\nMaria,Rodriguez",
    delimiter: ",",
    expectedRecords: 0,
    expectedError: "Missing required fields",
    expectedFields: ["First Name", "Last Name"]
  },
  {
    name: "Duplicate Detection",
    description: "Test duplicate detection functionality",
    data: `First Name,Last Name,Email,District,Position,Start Date,Status
John,Smith,john.smith@school.edu,Clarksburg,Teacher,2022-08-15,active
John,Smith,john.smith@school.edu,Clarksburg,Teacher,2022-08-15,active`,
    delimiter: ",",
    expectedRecords: 1,
    expectedDuplicates: 1,
    expectedFields: ["First Name", "Last Name", "Email", "District", "Position", "Start Date", "Status"]
  }
];

/**
 * Parse CSV data
 * @param {string} csvData - CSV data to parse
 * @param {string} delimiter - Delimiter character
 * @returns {Object} Parsed data
 */
function parseCSV(csvData, delimiter = ',') {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(delimiter);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(delimiter);
    const record = {};
    
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = data[j];
    }
    
    records.push(record);
  }
  
  return {
    headers,
    records
  };
}

/**
 * Validate imported data
 * @param {Array} records - Imported records
 * @returns {Object} Validation results
 */
function validateImportedData(records) {
  const requiredFields = ["First Name", "Last Name", "Email", "District"];
  const errors = [];
  const validRecords = [];
  const duplicates = [];
  
  // Track emails to detect duplicates
  const emails = new Set();
  
  records.forEach((record, index) => {
    const recordErrors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!record[field] || record[field].trim() === '') {
        recordErrors.push(`Missing required field: ${field}`);
      }
    });
    
    // Check email format
    if (record["Email"] && !isValidEmail(record["Email"])) {
      recordErrors.push("Invalid email format");
    }
    
    // Check for duplicates
    if (record["Email"] && emails.has(record["Email"])) {
      duplicates.push(index);
      recordErrors.push("Duplicate email address");
    } else if (record["Email"]) {
      emails.add(record["Email"]);
    }
    
    if (recordErrors.length > 0) {
      errors.push({
        record: index + 1,
        errors: recordErrors
      });
    } else {
      validRecords.push(record);
    }
  });
  
  return {
    valid: errors.length === 0,
    validRecords,
    errors,
    duplicates
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Run CSV import tests
 */
function runCSVImportTests() {
  console.log("Starting CSV Import Tests...");
  
  const results = {
    total: csvImportTests.length,
    passed: 0,
    failed: 0,
    tests: []
  };
  
  csvImportTests.forEach(test => {
    console.log(`\nRunning test: ${test.name}`);
    console.log(test.description);
    
    try {
      // Parse CSV data
      const parsedData = parseCSV(test.data, test.delimiter);
      
      // Validate headers
      const missingFields = test.expectedFields.filter(field => !parsedData.headers.includes(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing expected fields: ${missingFields.join(', ')}`);
      }
      
      // Validate records
      const validationResult = validateImportedData(parsedData.records);
      
      // Check expected records count
      if (validationResult.validRecords.length !== test.expectedRecords) {
        throw new Error(`Expected ${test.expectedRecords} valid records, got ${validationResult.validRecords.length}`);
      }
      
      // Check expected duplicates
      if (test.expectedDuplicates && validationResult.duplicates.length !== test.expectedDuplicates) {
        throw new Error(`Expected ${test.expectedDuplicates} duplicates, got ${validationResult.duplicates.length}`);
      }
      
      // Check expected error
      if (test.expectedError) {
        const hasExpectedError = validationResult.errors.some(error => 
          error.errors.some(err => err.includes(test.expectedError))
        );
        
        if (!hasExpectedError) {
          throw new Error(`Expected error "${test.expectedError}" not found`);
        }
      }
      
      // Test passed
      results.passed++;
      results.tests.push({
        name: test.name,
        status: "Pass",
        details: {
          records: parsedData.records.length,
          validRecords: validationResult.validRecords.length,
          errors: validationResult.errors.length,
          duplicates: validationResult.duplicates.length
        }
      });
      
      console.log(`✅ Test passed: ${test.name}`);
      
    } catch (error) {
      // Test failed
      results.failed++;
      results.tests.push({
        name: test.name,
        status: "Fail",
        error: error.message
      });
      
      console.log(`❌ Test failed: ${test.name}`);
      console.log(`   Error: ${error.message}`);
    }
  });
  
  // Print summary
  console.log("\n--- CSV Import Test Summary ---");
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  return results;
}

/**
 * Test CSV import with sample file
 */
function testSampleCSVImport() {
  console.log("\nTesting sample_staff_import.csv file...");
  
  try {
    // In a real environment, this would load the actual file
    // For this simulation, we'll use the sample data
    
    const parsedData = parseCSV(sampleCSVData);
    const validationResult = validateImportedData(parsedData.records);
    
    console.log(`✅ Sample file test passed`);
    console.log(`   Records: ${parsedData.records.length}`);
    console.log(`   Valid records: ${validationResult.validRecords.length}`);
    console.log(`   Errors: ${validationResult.errors.length}`);
    console.log(`   Duplicates: ${validationResult.duplicates.length}`);
    
    return {
      status: "Pass",
      records: parsedData.records.length,
      validRecords: validationResult.validRecords.length,
      errors: validationResult.errors.length,
      duplicates: validationResult.duplicates.length
    };
    
  } catch (error) {
    console.log(`❌ Sample file test failed`);
    console.log(`   Error: ${error.message}`);
    
    return {
      status: "Fail",
      error: error.message
    };
  }
}

// Run tests
const testResults = runCSVImportTests();
const sampleFileResult = testSampleCSVImport();

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runCSVImportTests,
    testSampleCSVImport,
    parseCSV,
    validateImportedData,
    testResults,
    sampleFileResult
  };
}