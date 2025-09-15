import dataStore from '../models/dataStore.js';

const createOffer = (req, res) => {
  try {
    const { name, value_props, ideal_use_cases } = req.body;
    
    // Validation: Check for required fields
    if (!name || !value_props || !ideal_use_cases) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide name, value_props, and ideal_use_cases.' 
      });
    }
    
    // Validation: Check data types
    if (typeof name !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid data type: name must be a string.' 
      });
    }
    
    if (!Array.isArray(value_props)) {
      return res.status(400).json({ 
        error: 'Invalid data type: value_props must be an array.' 
      });
    }
    
    if (!Array.isArray(ideal_use_cases)) {
      return res.status(400).json({ 
        error: 'Invalid data type: ideal_use_cases must be an array.' 
      });
    }
    
    // Validation: Check array contents
    if (value_props.length === 0) {
      return res.status(400).json({ 
        error: 'value_props array cannot be empty.' 
      });
    }
    
    if (ideal_use_cases.length === 0) {
      return res.status(400).json({ 
        error: 'ideal_use_cases array cannot be empty.' 
      });
    }
    
    // Check if all value_props are strings
    const invalidValueProps = value_props.filter(prop => typeof prop !== 'string');
    if (invalidValueProps.length > 0) {
      return res.status(400).json({ 
        error: 'All value_props must be strings.' 
      });
    }
    
    // Check if all ideal_use_cases are strings
    const invalidUseCases = ideal_use_cases.filter(useCase => typeof useCase !== 'string');
    if (invalidUseCases.length > 0) {
      return res.status(400).json({ 
        error: 'All ideal_use_cases must be strings.' 
      });
    }
    
    // Store the offer data
    dataStore.setOffer({ 
      name, 
      value_props, 
      ideal_use_cases 
    });
    
    // Success response
    res.status(201).json({ 
      message: 'Offer details stored successfully',
      offer: {
        name,
        value_props,
        ideal_use_cases
      }
    });
  } catch (error) {
    console.error('Error in createOffer:', error);
    res.status(500).json({ 
      error: 'Internal server error while processing offer details.' 
    });
  }
};

export { createOffer };