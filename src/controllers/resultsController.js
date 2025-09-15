import dataStore from "../models/dataStore.js";
import { Parser } from "json2csv";

const getResults = (req, res) => {
  try {
    const results = dataStore.getResults();

    if (!results || results.length === 0) {
      return res.status(404).json({
        error: "No results available. Please run scoring first.",
      });
    }

    // Add filtering options via query parameters
    const {
      intent,
      minScore,
      maxScore,
      sortBy = "score",
      order = "desc",
    } = req.query;

    let filteredResults = [...results];

    // Filter by intent
    if (intent) {
      filteredResults = filteredResults.filter(
        (result) => result.intent.toLowerCase() === intent.toLowerCase()
      );
    }

    // Filter by score range
    if (minScore) {
      filteredResults = filteredResults.filter(
        (result) => result.score >= parseInt(minScore)
      );
    }

    if (maxScore) {
      filteredResults = filteredResults.filter(
        (result) => result.score <= parseInt(maxScore)
      );
    }

    // Sort results
    if (sortBy) {
      filteredResults.sort((a, b) => {
        if (order.toLowerCase() === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }

    res.json(filteredResults);
  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).json({
      error: "Internal server error while retrieving results",
    });
  }
};

const exportResults = (req, res) => {
  try {
    const results = dataStore.getResults();

    if (!results || results.length === 0) {
      return res.status(404).json({
        error: "No results available. Please run scoring first.",
      });
    }

    const fields = [
      { label: "Name", value: "name" },
      { label: "Role", value: "role" },
      { label: "Company", value: "company" },
      { label: "Intent", value: "intent" },
      { label: "Score", value: "score" },
      { label: "Reasoning", value: "reasoning" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(results);

    const filename = req.query.filename || "lead_results.csv";

    res.header("Content-Type", "text/csv");
    res.attachment(filename);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting results:", error);
    res.status(500).json({
      error: "Internal server error while exporting results",
    });
  }
};

export { getResults, exportResults };
