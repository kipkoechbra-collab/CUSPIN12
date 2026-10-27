import {
  User,
  MarketWeekend,
  VendorApplication,
  Payment,
  Sponsor,
  FAQ,
  Announcement,
  ContactMessage,
  AdminStats,
  AdminAuditLog,
} from '../types';

const API_BASE = '/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // fallback
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ─── AUTH ──────────────────────────────────────────────────────────
  async register(data: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  }

  // ─── PUBLIC ────────────────────────────────────────────────────────
  async getPublicWeekends(): Promise<MarketWeekend[]> {
    return this.request('/public/weekends');
  }

  async getPublicVendors(params?: { category?: string; weekend?: string }): Promise<any[]> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/public/vendors${query ? `?${query}` : ''}`);
  }

  async getPublicSponsors(): Promise<Sponsor[]> {
    return this.request('/public/sponsors');
  }

  async getPublicAnnouncements(): Promise<Announcement[]> {
    return this.request('/public/announcements');
  }

  async getPublicFAQs(): Promise<FAQ[]> {
    return this.request('/public/faqs');
  }

  async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<{ message: string }> {
    return this.request('/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitNewsletter(data: { email: string; firstName?: string }): Promise<{ message: string }> {
    return this.request('/public/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitSponsorApplication(data: any): Promise<{ message: string }> {
    return this.request('/public/sponsor-application', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPublicSettings(): Promise<Record<string, string>> {
    return this.request('/public/settings');
  }

  // ─── VENDOR APPLICATION ────────────────────────────────────────────
  async submitApplication(data: any): Promise<{ message: string; application: VendorApplication }> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyApplications(): Promise<VendorApplication[]> {
    return this.request('/applications/my');
  }

  async getApplicationById(id: string): Promise<VendorApplication> {
    return this.request(`/applications/${id}`);
  }

  async updateApplication(id: string, data: any): Promise<VendorApplication> {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ─── ADMIN ─────────────────────────────────────────────────────────
  async getAdminStats(): Promise<AdminStats> {
    return this.request('/admin/stats');
  }

  async getAdminApplications(params?: any): Promise<{ applications: VendorApplication[]; total: number; totalPages: number }> {
    const query = new URLSearchParams(params || {}).toString();
    return this.request(`/admin/applications${query ? `?${query}` : ''}`);
  }

  async getAdminApplicationDetail(id: string): Promise<{ application: VendorApplication; auditLog: AdminAuditLog[] }> {
    return this.request(`/admin/applications/${id}`);
  }

  async updateApplicationStatus(id: string, status: string, reviewNotes?: string): Promise<VendorApplication> {
    return this.request(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes }),
    });
  }

  async togglePublicListing(id: string, isPublicListing: boolean): Promise<VendorApplication> {
    return this.request(`/admin/applications/${id}/public`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublicListing }),
    });
  }

  async toggleApplicationLock(id: string, isLocked: boolean): Promise<VendorApplication> {
    return this.request(`/admin/applications/${id}/lock`, {
      method: 'PATCH',
      body: JSON.stringify({ isLocked }),
    });
  }

  async sendVendorMessage(id: string, data: { subject: string; content: string }): Promise<any> {
    return this.request(`/admin/applications/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payments
  async getAdminPayments(status?: string): Promise<Payment[]> {
    return this.request(`/admin/payments${status ? `?status=${status}` : ''}`);
  }

  async markPaymentPaid(id: string, data: { transactionRef?: string; note?: string }): Promise<Payment> {
    return this.request(`/admin/payments/${id}/mark-paid`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async refundPayment(id: string, data: { refundAmount?: number; note?: string }): Promise<Payment> {
    return this.request(`/admin/payments/${id}/refund`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Weekends
  async getAdminWeekends(): Promise<MarketWeekend[]> {
    return this.request('/admin/weekends');
  }

  async createWeekend(data: any): Promise<MarketWeekend> {
    return this.request('/admin/weekends', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWeekend(id: string, data: any): Promise<MarketWeekend> {
    return this.request(`/admin/weekends/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWeekend(id: string): Promise<any> {
    return this.request(`/admin/weekends/${id}`, {
      method: 'DELETE',
    });
  }

  // Sponsors
  async getAdminSponsors(): Promise<Sponsor[]> {
    return this.request('/admin/sponsors');
  }

  async createSponsor(data: any): Promise<Sponsor> {
    return this.request('/admin/sponsors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSponsor(id: string, data: any): Promise<Sponsor> {
    return this.request(`/admin/sponsors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSponsor(id: string): Promise<any> {
    return this.request(`/admin/sponsors/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminSponsorApplications(): Promise<any[]> {
    return this.request('/admin/sponsor-applications');
  }

  async updateSponsorApplicationStatus(id: string, status: string): Promise<any> {
    return this.request(`/admin/sponsor-applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Announcements
  async getAdminAnnouncements(): Promise<Announcement[]> {
    return this.request('/admin/announcements');
  }

  async createAnnouncement(data: any): Promise<Announcement> {
    return this.request('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(id: string, data: any): Promise<Announcement> {
    return this.request(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: string): Promise<any> {
    return this.request(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  // FAQs
  async getAdminFAQs(): Promise<FAQ[]> {
    return this.request('/admin/faqs');
  }

  async createFAQ(data: any): Promise<FAQ> {
    return this.request('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFAQ(id: string, data: any): Promise<FAQ> {
    return this.request(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFAQ(id: string): Promise<any> {
    return this.request(`/admin/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getAdminMessages(unread?: boolean): Promise<ContactMessage[]> {
    return this.request(`/admin/messages${unread ? '?unread=true' : ''}`);
  }

  async markMessageRead(id: string): Promise<ContactMessage> {
    return this.request(`/admin/messages/${id}/read`, {
      method: 'PATCH',
    });
  }

  async deleteMessage(id: string): Promise<any> {
    return this.request(`/admin/messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Newsletter
  async getAdminNewsletter(): Promise<any[]> {
    return this.request('/admin/newsletter');
  }

  // Audit Logs
  async getAdminAuditLogs(params?: any): Promise<{ logs: AdminAuditLog[]; total: number }> {
    const query = new URLSearchParams(params || {}).toString();
    return this.request(`/admin/audit-log${query ? `?${query}` : ''}`);
  }

  // Admins
  async getAdminUsers(): Promise<User[]> {
    return this.request('/admin/admins');
  }

  async createAdminUser(data: any): Promise<User> {
    return this.request('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Settings
  async getAdminSettings(): Promise<Record<string, string>> {
    return this.request('/admin/settings');
  }

  async updateAdminSettings(settings: Record<string, string>): Promise<any> {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const api = new ApiService();
