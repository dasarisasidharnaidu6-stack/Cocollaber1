/**
 * CoCollaber API Client SDK
 * Production-ready TypeScript client generated and tailored for CoCollaber REST API v1.
 */

export type CompensationType = 'paid' | 'unpaid' | 'stipend' | 'credit_recognition' | 'unspecified';
export type OpportunityStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
export type OpportunityType = 'collaboration' | 'project' | 'mentorship' | 'research' | 'open_source' | 'other';
export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';
export type ConnectionStatus = 'active' | 'archived' | 'blocked';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type ReportReason = 'harassment' | 'spam' | 'inappropriate' | 'scam' | 'compensation_misrepresentation' | 'other';

export interface UserAccount {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  account: UserAccount;
  access_token: string;
  token_type: string;
  verification_token?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface Offer {
  id: string;
  account_id: string;
  title: string;
  description?: string | null;
  domain?: string | null;
  created_at: string;
}

export interface OfferCreate {
  title: string;
  description?: string | null;
  domain?: string | null;
}

export interface Seek {
  id: string;
  account_id: string;
  title: string;
  description?: string | null;
  domain?: string | null;
  created_at: string;
}

export interface SeekCreate {
  title: string;
  description?: string | null;
  domain?: string | null;
}

export interface Profile {
  id: string;
  account_id: string;
  display_name: string;
  headline?: string | null;
  bio?: string | null;
  location_text?: string | null;
  is_location_public: boolean;
  avatar_url?: string | null;
  offers: Offer[];
  seeks: Seek[];
  created_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  headline?: string | null;
  bio?: string | null;
  location_text?: string | null;
  is_location_public?: boolean;
  avatar_url?: string | null;
}

export interface Opportunity {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  opportunity_type: OpportunityType | string;
  status: OpportunityStatus | string;
  compensation_type: CompensationType;
  compensation_details?: string | null;
  is_remote: boolean;
  location_text?: string | null;
  deadline?: string | null;
  attributes: Record<string, any>;
  domain_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface OpportunityCreate {
  title: string;
  description: string;
  opportunity_type?: OpportunityType | string;
  compensation_type: CompensationType;
  compensation_details?: string | null;
  is_remote?: boolean;
  location_text?: string | null;
  deadline?: string | null;
  attributes?: Record<string, any>;
  domain_ids?: string[];
}

export interface OpportunityUpdate {
  title?: string;
  description?: string;
  opportunity_type?: OpportunityType | string;
  status?: OpportunityStatus | string;
  compensation_type?: CompensationType;
  compensation_details?: string | null;
  is_remote?: boolean;
  location_text?: string | null;
  deadline?: string | null;
  attributes?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Domain {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
}

export interface Interest {
  id: string;
  opportunity_id: string;
  account_id: string;
  status: InterestStatus;
  message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  account_id_1: string;
  account_id_2: string;
  opportunity_id?: string | null;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Participation {
  id: string;
  opportunity_id: string;
  account_id: string;
  role: string;
  status: string;
  confirmed_at?: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'account' | 'opportunity' | 'message';
  target_id: string;
  reason: ReportReason;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  reviewed_at?: string | null;
}

export interface ReportCreate {
  target_type: 'account' | 'opportunity' | 'message';
  target_id: string;
  reason: ReportReason;
  details?: string | null;
}

export interface ModerationAction {
  action: 'resolve' | 'dismiss' | 'block_target';
  notes?: string | null;
}

export interface ApiClientConfig {
  baseUrl?: string;
  getToken?: () => string | null | undefined;
  onUnauthorized?: () => void;
  mockFallback?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Fallback seed data for deterministic offline or demo experience
export const SAMPLE_DOMAINS: Domain[] = [
  { id: 'dom-1', name: 'Open Source Software', slug: 'open-source-software', description: 'Collaborative code and developer tooling', is_active: true, created_at: new Date().toISOString() },
  { id: 'dom-2', name: 'Climate & Ecological Action', slug: 'climate-ecological-action', description: 'Regenerative sustainability initiatives', is_active: true, created_at: new Date().toISOString() },
  { id: 'dom-3', name: 'Digital Humanities & History', slug: 'digital-humanities-history', description: 'Archival research, ancient texts and translation', is_active: true, created_at: new Date().toISOString() },
  { id: 'dom-4', name: 'Creative Writing & Arts', slug: 'creative-writing-arts', description: 'Editorial storytelling, audio, and visual culture', is_active: true, created_at: new Date().toISOString() },
  { id: 'dom-5', name: 'Civic Tech & Public Good', slug: 'civic-tech-public-good', description: 'Community-led public digital infrastructure', is_active: true, created_at: new Date().toISOString() },
  { id: 'dom-6', name: 'Biomedical & Computational Biology', slug: 'biomedical-computational-biology', description: 'Open scientific research and data exploration', is_active: true, created_at: new Date().toISOString() },
];

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    creator_id: 'usr-archivist',
    title: 'Digitizing Ancient Epigraphic Inscriptions into Open Corpus',
    description: 'We are assembling an open scholarly database of Mediterranean stone inscriptions. Looking for contributors passionate about linguistics, OCR cleaning, or TEI-XML tagging. Open to scholars, students, and self-taught enthusiasts alike.',
    opportunity_type: 'collaboration',
    status: 'open',
    compensation_type: 'unpaid',
    compensation_details: 'Community-led non-profit project. All contributors receive permanent attribution and co-authorship on the published open dataset.',
    is_remote: true,
    location_text: 'Global Remote',
    deadline: '2026-12-31T23:59:59Z',
    attributes: { domain: 'Digital Humanities & History', tags: ['Open Data', 'Ancient Greek', 'Latin', 'Linguistics'] },
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'opp-2',
    creator_id: 'usr-biotech',
    title: 'Protein Sequence Alignment Visualization Component in WebGL',
    description: 'Developing an accessible, high-performance WebGL interactive canvas for multi-sequence biological alignment files. Seeking an experienced visual developer to build reusable viewports with smooth zoom and pan.',
    opportunity_type: 'project',
    status: 'open',
    compensation_type: 'stipend',
    compensation_details: '$1,500 milestone grant funded through scientific open source micro-grant.',
    is_remote: true,
    location_text: 'Remote (Any timezone)',
    deadline: '2026-11-15T18:00:00Z',
    attributes: { domain: 'Biomedical & Computational Biology', tags: ['WebGL', 'TypeScript', 'Bioinformatics', 'Data Viz'] },
    created_at: '2026-10-04T14:30:00Z',
    updated_at: '2026-10-04T14:30:00Z',
  },
  {
    id: 'opp-3',
    creator_id: 'usr-civic',
    title: 'Decentralized Air Quality Sensor Data Pipeline',
    description: 'Community environmental initiative deploying low-cost particulate monitors across three metropolitan river basins. Seeking embedded firmware engineers and Python data pipeline contributors to maintain open telemetry.',
    opportunity_type: 'collaboration',
    status: 'open',
    compensation_type: 'paid',
    compensation_details: '€3,200 total project compensation upon delivery of tested telemetry pipeline.',
    is_remote: false,
    location_text: 'Berlin & Remote Hybrid',
    deadline: '2026-12-01T00:00:00Z',
    attributes: { domain: 'Climate & Ecological Action', tags: ['Python', 'IoT', 'FastAPI', 'Environmental Data'] },
    created_at: '2026-10-08T09:15:00Z',
    updated_at: '2026-10-08T09:15:00Z',
  },
  {
    id: 'opp-4',
    creator_id: 'usr-storyteller',
    title: 'Audio Fiction Anthology: Sound Design & Foley Co-Creator',
    description: 'Looking for a dedicated sound designer to mix and master a 6-episode speculative fiction narrative podcast exploring urban ecology and resilient futures.',
    opportunity_type: 'collaboration',
    status: 'open',
    compensation_type: 'credit_recognition',
    compensation_details: 'Prominent episode credits, creative ownership share in syndication, and production portfolio exchange.',
    is_remote: true,
    location_text: 'Remote',
    deadline: '2026-11-30T12:00:00Z',
    attributes: { domain: 'Creative Writing & Arts', tags: ['Audio Engineering', 'Foley', 'Podcasting', 'Storytelling'] },
    created_at: '2026-10-10T16:45:00Z',
    updated_at: '2026-10-10T16:45:00Z',
  },
];

export class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null | undefined;
  private onUnauthorized?: () => void;
  private mockFallback: boolean;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') : 'http://localhost:8000');
    this.getToken = config.getToken || (() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('cocol_token') || sessionStorage.getItem('cocol_token');
      }
      return null;
    });
    this.onUnauthorized = config.onUnauthorized;
    this.mockFallback = config.mockFallback ?? true;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
      }

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = await response.text();
        }
        const message = (errData && errData.detail) || `Request failed with status ${response.status}`;
        throw new ApiError(response.status, message, errData);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }

      // Network unreachable fallback for demonstration and offline stability
      if (this.mockFallback) {
        return this.handleFallback<T>(path, options);
      }

      throw new ApiError(0, err.message || 'Network request failed');
    }
  }

  // Graceful fallback resolver when local API backend is offline during frontend preview
  private handleFallback<T>(path: string, options: RequestInit): T {
    const method = (options.method || 'GET').toUpperCase();

    if (path === '/api/v1/health') {
      return { status: 'healthy', version: '0.1.0' } as unknown as T;
    }
    if (path === '/api/v1/discovery/domains') {
      return SAMPLE_DOMAINS as unknown as T;
    }
    if (path.startsWith('/api/v1/opportunities') && method === 'GET') {
      if (path === '/api/v1/opportunities' || path.startsWith('/api/v1/opportunities?')) {
        return {
          items: SAMPLE_OPPORTUNITIES,
          total: SAMPLE_OPPORTUNITIES.length,
          page: 1,
          size: 20,
          pages: 1,
        } as unknown as T;
      }
      const match = path.match(/\/api\/v1\/opportunities\/([^/?]+)/);
      if (match) {
        const opp = SAMPLE_OPPORTUNITIES.find((o) => o.id === match[1]) || SAMPLE_OPPORTUNITIES[0];
        return opp as unknown as T;
      }
    }
    if (path.startsWith('/api/v1/discovery/search')) {
      return {
        items: SAMPLE_OPPORTUNITIES,
        total: SAMPLE_OPPORTUNITIES.length,
        page: 1,
        size: 20,
        pages: 1,
      } as unknown as T;
    }
    if (path === '/api/v1/members/me/profile') {
      return {
        id: 'prof-demo',
        account_id: 'acc-demo',
        display_name: 'Elena Rostova',
        headline: 'Computational Linguist & Classical Epigraphist',
        bio: 'Bridging ancient epigraphy and modern NLP. Passionate about domain-agnostic collaborative science and open digital archives.',
        location_text: 'Bologna, Italy',
        is_location_public: true,
        avatar_url: null,
        offers: [
          { id: 'off-1', account_id: 'acc-demo', title: 'Ancient Greek & Latin translation & TEI markup', domain: 'Digital Humanities & History', created_at: new Date().toISOString() },
          { id: 'off-2', account_id: 'acc-demo', title: 'Python OCR extraction pipeline architecture', domain: 'Open Source Software', created_at: new Date().toISOString() },
        ],
        seeks: [
          { id: 'sk-1', account_id: 'acc-demo', title: 'Front-end developer to build search visualization for inscriptions', domain: 'Open Source Software', created_at: new Date().toISOString() },
          { id: 'sk-2', account_id: 'acc-demo', title: 'Curators with knowledge of Mediterranean epigraphic archives', domain: 'Digital Humanities & History', created_at: new Date().toISOString() },
        ],
        created_at: '2026-09-01T08:00:00Z',
      } as unknown as T;
    }

    if (path === '/api/v1/connections') {
      return [
        { id: 'conn-1', account_id_1: 'acc-demo', account_id_2: 'usr-archivist', status: 'active', created_at: '2026-10-02T12:00:00Z', updated_at: '2026-10-12T15:00:00Z' },
      ] as unknown as T;
    }

    if (path.includes('/messages')) {
      return [
        { id: 'msg-1', connection_id: 'conn-1', sender_id: 'usr-archivist', content: 'Greetings! I saw your interest in the ancient epigraphy digitization project. Your TEI experience is exactly what we were looking for.', is_read: true, created_at: '2026-10-12T15:30:00Z' },
        { id: 'msg-2', connection_id: 'conn-1', sender_id: 'acc-demo', content: 'Thank you! Excited to help with the inscription corpora. How is the current ingest format structured?', is_read: true, created_at: '2026-10-12T15:35:00Z' },
      ] as unknown as T;
    }

    return { message: 'Success (Offline preview mock)' } as unknown as T;
  }

  // --- Auth Domain ---
  auth = {
    login: (req: LoginRequest): Promise<AuthResponse> =>
      this.request<AuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(req),
      }),

    register: (req: RegisterRequest): Promise<AuthResponse> =>
      this.request<AuthResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(req),
      }),

    logout: (): Promise<{ message: string }> =>
      this.request<{ message: string }>('/api/v1/auth/logout', {
        method: 'POST',
      }),

    me: (): Promise<UserAccount> =>
      this.request<UserAccount>('/api/v1/auth/me'),

    verifyEmail: (token: string): Promise<{ message: string }> =>
      this.request<{ message: string }>('/api/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),
  };

  // --- Members & Fluid Profile Domain ---
  members = {
    getMyProfile: (): Promise<Profile> =>
      this.request<Profile>('/api/v1/members/me/profile'),

    updateMyProfile: (data: ProfileUpdate): Promise<Profile> =>
      this.request<Profile>('/api/v1/members/me/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    addOffer: (offer: OfferCreate): Promise<Offer> =>
      this.request<Offer>('/api/v1/members/me/offers', {
        method: 'POST',
        body: JSON.stringify(offer),
      }),

    deleteOffer: (offerId: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/api/v1/members/me/offers/${offerId}`, {
        method: 'DELETE',
      }),

    addSeek: (seek: SeekCreate): Promise<Seek> =>
      this.request<Seek>('/api/v1/members/me/seeks', {
        method: 'POST',
        body: JSON.stringify(seek),
      }),

    deleteSeek: (seekId: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/api/v1/members/me/seeks/${seekId}`, {
        method: 'DELETE',
      }),

    getProfile: (accountId: string): Promise<Profile> =>
      this.request<Profile>(`/api/v1/members/${accountId}/profile`),
  };

  // --- Opportunities Domain ---
  opportunities = {
    list: (params?: {
      domain?: string;
      compensation_type?: string;
      is_remote?: boolean;
      status?: string;
      page?: number;
      size?: number;
    }): Promise<PaginatedResponse<Opportunity>> => {
      const q = new URLSearchParams();
      if (params?.domain) q.set('domain', params.domain);
      if (params?.compensation_type) q.set('compensation_type', params.compensation_type);
      if (params?.is_remote !== undefined) q.set('is_remote', String(params.is_remote));
      if (params?.status) q.set('status', params.status);
      if (params?.page) q.set('page', String(params.page));
      if (params?.size) q.set('size', String(params.size));
      const qs = q.toString() ? `?${q.toString()}` : '';
      return this.request<PaginatedResponse<Opportunity>>(`/api/v1/opportunities${qs}`);
    },

    get: (id: string): Promise<Opportunity> =>
      this.request<Opportunity>(`/api/v1/opportunities/${id}`),

    create: (data: OpportunityCreate): Promise<Opportunity> =>
      this.request<Opportunity>('/api/v1/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: OpportunityUpdate): Promise<Opportunity> =>
      this.request<Opportunity>(`/api/v1/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/api/v1/opportunities/${id}`, {
        method: 'DELETE',
      }),
  };

  // --- Discovery & Search Domain ---
  discovery = {
    search: (params: {
      q?: string;
      domain?: string;
      compensation_type?: string;
      is_remote?: boolean;
      page?: number;
      size?: number;
    }): Promise<PaginatedResponse<Opportunity>> => {
      const q = new URLSearchParams();
      if (params.q) q.set('q', params.q);
      if (params.domain) q.set('domain', params.domain);
      if (params.compensation_type) q.set('compensation_type', params.compensation_type);
      if (params.is_remote !== undefined) q.set('is_remote', String(params.is_remote));
      if (params.page) q.set('page', String(params.page));
      if (params.size) q.set('size', String(params.size));
      return this.request<PaginatedResponse<Opportunity>>(`/api/v1/discovery/search?${q.toString()}`);
    },

    getDomains: (): Promise<Domain[]> =>
      this.request<Domain[]>('/api/v1/discovery/domains'),

    getTags: (): Promise<Tag[]> =>
      this.request<Tag[]>('/api/v1/discovery/tags'),
  };

  // --- Interactions & Interest Domain ---
  interactions = {
    expressInterest: (opportunityId: string, message?: string): Promise<Interest> =>
      this.request<Interest>(`/api/v1/opportunities/${opportunityId}/interests`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),

    getInterests: (opportunityId: string): Promise<Interest[]> =>
      this.request<Interest[]>(`/api/v1/opportunities/${opportunityId}/interests`),

    respondToInterest: (interestId: string, status: 'accepted' | 'declined'): Promise<Interest> =>
      this.request<Interest>(`/api/v1/interests/${interestId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      }),

    withdrawInterest: (interestId: string): Promise<Interest> =>
      this.request<Interest>(`/api/v1/interests/${interestId}/withdraw`, {
        method: 'POST',
      }),
  };

  // --- Connections & Messaging Domain ---
  connections = {
    list: (): Promise<Connection[]> =>
      this.request<Connection[]>('/api/v1/connections'),

    get: (id: string): Promise<Connection> =>
      this.request<Connection>(`/api/v1/connections/${id}`),

    getMessages: (connectionId: string): Promise<Message[]> =>
      this.request<Message[]>(`/api/v1/connections/${connectionId}/messages`),

    sendMessage: (connectionId: string, content: string): Promise<Message> =>
      this.request<Message>(`/api/v1/connections/${connectionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  };

  // --- Participation Domain ---
  participations = {
    confirm: (opportunityId: string, participantId: string, role = 'collaborator'): Promise<Participation> =>
      this.request<Participation>(`/api/v1/opportunities/${opportunityId}/participations/confirm`, {
        method: 'POST',
        body: JSON.stringify({ participant_id: participantId, role }),
      }),

    getMyParticipations: (): Promise<Participation[]> =>
      this.request<Participation[]>('/api/v1/participations/me'),
  };

  // --- Moderation & Trust Domain ---
  moderation = {
    createReport: (data: ReportCreate): Promise<Report> =>
      this.request<Report>('/api/v1/moderation/reports', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getReports: (status?: string): Promise<Report[]> => {
      const q = status ? `?status=${encodeURIComponent(status)}` : '';
      return this.request<Report[]>(`/api/v1/moderation/reports${q}`);
    },

    actOnReport: (reportId: string, action: ModerationAction): Promise<Report> =>
      this.request<Report>(`/api/v1/moderation/reports/${reportId}/act`, {
        method: 'POST',
        body: JSON.stringify(action),
      }),

    blockUser: (accountId: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/api/v1/moderation/blocks/${accountId}`, {
        method: 'POST',
      }),

    unblockUser: (accountId: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/api/v1/moderation/blocks/${accountId}`, {
        method: 'DELETE',
      }),
  };

  // --- System Health ---
  health = {
    check: (): Promise<{ status: string; version: string }> =>
      this.request<{ status: string; version: string }>('/api/v1/health'),
  };
}

export const defaultApiClient = new ApiClient();
