import csv from "csv-parser";
import fs from "fs";

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Clean up uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.warn("Could not delete temporary file:", error);
        }
        resolve(results);
      })
      .on("error", (error) => {
        // Clean up uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkError) {
          console.warn("Could not delete temporary file:", unlinkError);
        }
        reject(error);
      });
  });
}

function validateCSV(leads) {
  // Check if we have any data
  if (!leads || leads.length === 0) {
    return {
      isValid: false,
      message: "CSV file is empty or contains no data",
    };
  }

  // Check required columns
  const requiredColumns = [
    "name",
    "role",
    "company",
    "industry",
    "location",
    "linkedin_bio",
  ];
  const firstLead = leads[0];
  const missingColumns = requiredColumns.filter((col) => !(col in firstLead));

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      message: `Missing required columns: ${missingColumns.join(
        ", "
      )}. Required columns are: ${requiredColumns.join(", ")}`,
    };
  }

  return {
    isValid: true,
    message: "CSV format is valid",
  };
}

export { parseCSV, validateCSV };
