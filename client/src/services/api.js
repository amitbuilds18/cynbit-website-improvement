const API_BASE = '/api';

export const api = {
  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/jobs?${query}`);
    return res.json();
  },

  async getJobBySlug(slug) {
    const res = await fetch(`${API_BASE}/jobs/${slug}`);
    return res.json();
  },

  // Applications
  async submitApplication(formData) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      body: formData // multipart/form-data for resume upload
    });
    return res.json();
  },

  async trackApplication(applicationNumber, email) {
    const query = new URLSearchParams({
      applicationNumber,
      ...(email ? { email } : {})
    }).toString();
    const res = await fetch(`${API_BASE}/applications/track?${query}`);
    return res.json();
  },

  // Recruiter
  async getRecruiterApplications() {
    const res = await fetch(`${API_BASE}/applications/admin/list`, {
      headers: {
        'x-recruiter-key': 'cynbit_lead_architect_2026'
      }
    });
    return res.json();
  },

  async updateApplicationStatus(id, updateData) {
    const res = await fetch(`${API_BASE}/applications/admin/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-recruiter-key': 'cynbit_lead_architect_2026'
      },
      body: JSON.stringify(updateData)
    });
    return res.json();
  }
};
