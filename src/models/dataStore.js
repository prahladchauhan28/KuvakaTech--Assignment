// Simple in-memory storage for demo purposes
class DataStore {
  constructor() {
    this.offer = null;
    this.leads = [];
    this.results = [];
  }

  setOffer(offerData) {
    this.offer = offerData;
  }

  getOffer() {
    return this.offer;
  }

  setLeads(leads) {
    this.leads = leads;
  }

  getLeads() {
    return this.leads;
  }

  setResults(results) {
    this.results = results;
  }

  getResults() {
    return this.results;
  }
}

export default new DataStore();