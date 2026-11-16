export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketCategory = 'hardware' | 'software' | 'network' | 'access' | 'security' | 'other';

export interface Comment {
  id: string;
  author: string;
  role: 'tech' | 'user' | 'admin';
  content: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterDept: string;
  assignedTo: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assetId?: string;
  comments: Comment[];
}

export type AssetType = 'laptop' | 'desktop' | 'server' | 'screen' | 'printer' | 'network' | 'mobile' | 'other';
export type AssetStatus = 'in_use' | 'available' | 'maintenance' | 'retired';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  model: string;
  brand: string;
  serialNumber: string;
  status: AssetStatus;
  assignedUser?: string;
  assignedUserEmail?: string;
  department?: string;
  location: string;
  purchaseDate: string;
  warrantyEnd: string;
  ipAddress?: string;
  notes?: string;
}

export type LicenseCategory = 'security' | 'productivity' | 'design' | 'dev' | 'infrastructure' | 'communication';

export interface License {
  id: string;
  name: string;
  vendor: string;
  category: LicenseCategory;
  totalSeats: number;
  usedSeats: number;
  costPerYear: number;
  renewalDate: string;
  keyOrContractRef: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  phone?: string;
}
