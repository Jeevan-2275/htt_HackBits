// Campaign Service - Connects to backend APIs
import authService from '@/lib/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class CampaignService {
  // Get all campaigns for current user
  async getCampaigns() {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'GET',
        headers: authService.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch campaigns');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Get single campaign by ID (authenticated)
  async getCampaignById(campaignId) {
    try {
      const response = await fetch(`${API_URL}/projects/${campaignId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch campaign');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  // Get campaign by ID (Public - no auth required, for recording page)
  async getPublicCampaignById(campaignId) {
    try {
      console.log('🔄 Fetching public campaign:', campaignId);
      console.log('📍 API URL:', `${API_URL}/projects/public/${campaignId}`);
      
      const response = await fetch(`${API_URL}/projects/public/${campaignId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      console.log('📦 Response:', { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to fetch campaign';
        console.error('❌ API Error:', errorMsg, data.details);
        throw new Error(errorMsg);
      }

      if (!data.data) {
        console.error('❌ No data in response:', data);
        throw new Error('Invalid response from server');
      }

      console.log('✅ Campaign loaded successfully:', data.data._id);
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching campaign:', error.message);
      throw error;
    }
  }

  // Create new campaign
  async createCampaign(campaignData) {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Update campaign
  async updateCampaign(campaignId, campaignData) {
    try {
      const response = await fetch(`${API_URL}/projects/${campaignId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update campaign');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  // Delete campaign
  async deleteCampaign(campaignId) {
    try {
      const response = await fetch(`${API_URL}/projects/${campaignId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete campaign');
      }

      return data.data;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

export default new CampaignService();
