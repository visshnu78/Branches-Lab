// public/js/api.js

const API_BASE_URL = window.location.origin.startsWith('http') && !window.location.origin.includes(':5500')
  ? ''
  : 'http://localhost:5000';

const API = {
  // Check if real backend is available
  async isBackendAvailable() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Register
  async register(name, email, password) {
    const isOnline = await this.isBackendAvailable();
    if (isOnline) {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      return await res.json();
    }

    // Local Fallback
    const users = JSON.parse(localStorage.getItem('bl_mock_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = { id: 'mock-' + Date.now(), name, email, role: 'CLIENT' };
    users.push(newUser);
    localStorage.setItem('bl_mock_users', JSON.stringify(users));
    localStorage.setItem('bl_auth_token', 'mock-jwt-token-' + Date.now());
    return { success: true, message: 'Account registered successfully.', data: { user: newUser } };
  },

  // Auth: Login
  async login(email, password) {
    const isOnline = await this.isBackendAvailable();
    if (isOnline) {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        localStorage.setItem('bl_auth_token', data.data.token);
      }
      return data;
    }

    // Local Fallback
    localStorage.setItem('bl_auth_token', 'mock-jwt-token-' + Date.now());
    return {
      success: true,
      message: 'Login successful (Offline Demo Mode).',
      data: { user: { email, name: email.split('@')[0], role: 'CLIENT' } }
    };
  },

  // Inquiries: Submit
  async submitInquiry(payload) {
    const isOnline = await this.isBackendAvailable();
    const token = localStorage.getItem('bl_auth_token');

    if (isOnline) {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      return await res.json();
    }

    // Local Fallback: store inquiry in browser localStorage
    const inquiries = JSON.parse(localStorage.getItem('bl_inquiries') || '[]');
    const newInquiry = {
      id: 'inq-' + Date.now(),
      ...payload,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    localStorage.setItem('bl_inquiries', JSON.stringify(inquiries));

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      success: true,
      message: 'Thank you! Your project proposal has been received. Our team will contact you within 24 hours.',
      data: { inquiry: newInquiry }
    };
  },

  // Services: Fetch
  async getServices(category = 'ALL', search = '') {
    const isOnline = await this.isBackendAvailable();
    if (isOnline) {
      const params = new URLSearchParams();
      if (category && category !== 'ALL') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/api/services?${params.toString()}`);
      return await res.json();
    }

    // Default static services fallback
    const fallbackServices = [
      {
        id: 's1',
        title: 'Product Strategy & Discovery',
        category: 'STRATEGY',
        description: 'Validate ideas before you invest. We run focused discovery sprints to define your roadmap, align stakeholders, and de-risk your biggest bets.',
        icon: '🎯'
      },
      {
        id: 's2',
        title: 'UX/UI Design & Prototyping',
        category: 'DESIGN',
        description: 'Beautiful interfaces grounded in research. We design experiences that feel intuitive, convert visitors into users, and keep them coming back.',
        icon: '✨'
      },
      {
        id: 's3',
        title: 'Custom Software Engineering',
        category: 'ENGINEERING',
        description: 'Full-stack development with an obsession for clean architecture. We build web apps, mobile platforms, and APIs that scale with your ambition.',
        icon: '🛠️'
      },
      {
        id: 's4',
        title: 'AI & Machine Learning',
        category: 'AI_DATA',
        description: 'Put intelligence to work. From predictive models to natural language processing, we embed AI where it creates real, measurable business value.',
        icon: '🤖'
      },
      {
        id: 's5',
        title: 'Cloud & DevOps',
        category: 'INFRASTRUCTURE',
        description: 'Ship faster with confidence. We architect cloud-native infrastructure, CI/CD pipelines, and monitoring systems that keep your product rock-solid.',
        icon: '☁️'
      },
      {
        id: 's6',
        title: 'Cybersecurity & Compliance',
        category: 'SECURITY',
        description: 'Protect what you\'ve built. We provide threat assessments, penetration testing, and compliance audits so you can grow without worry.',
        icon: '🔒'
      }
    ];

    let filtered = fallbackServices;
    if (category && category !== 'ALL') {
      filtered = filtered.filter(s => s.category === category);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }

    return { success: true, data: { services: filtered } };
  }
};

window.API = API;
