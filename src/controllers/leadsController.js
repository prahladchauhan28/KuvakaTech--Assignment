import dataStore from '../models/dataStore.js';
import { parseCSV, validateCSV } from '../services/csvService.js';

const uploadLeads = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please provide a CSV file.' 
      });
    }

    // Parse CSV file
    const leads = await parseCSV(req.file.path);
    
    // Validate CSV structure
    const validationResult = validateCSV(leads);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: `Invalid CSV format: ${validationResult.message}` 
      });
    }

    // Clean and validate lead data
    const cleanedLeads = leads.map(lead => ({
      name: lead.name ? lead.name.trim() : '',
      role: lead.role ? lead.role.trim() : '',
      company: lead.company ? lead.company.trim() : '',
      industry: lead.industry ? lead.industry.trim() : '',
      location: lead.location ? lead.location.trim() : '',
      linkedin_bio: lead.linkedin_bio ? lead.linkedin_bio.trim() : ''
    }));

    // Filter out completely empty rows
    const filteredLeads = cleanedLeads.filter(lead => 
      lead.name || lead.role || lead.company || 
      lead.industry || lead.location || lead.linkedin_bio
    );

    // Store leads
    dataStore.setLeads(filteredLeads);
    
    res.json({ 
      message: `Successfully uploaded ${filteredLeads.length} leads`,
      stats: {
        totalRows: leads.length,
        emptyRowsSkipped: leads.length - filteredLeads.length,
        validLeads: filteredLeads.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.message.includes('CSV')) {
      return res.status(400).json({ 
        error: `File processing error: ${error.message}` 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while processing CSV file' 
    });
  }
};


export { uploadLeads };