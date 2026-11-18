export type CampaignType =
  | 'KATHINA'
  | 'TRAI_TANG'
  | 'CONSTRUCTION'
  | 'AN_VI'
  | 'CHARITY'
  | 'OTHER';

export type CampaignStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'FUNDING'
  | 'FUNDED'
  | 'EXPIRED'
  | 'EVENT_HELD'
  | 'REPORTED'
  | 'CLOSED'
  | 'SUSPENDED';

export type SurplusPolicy = 'NEXT_EVENT' | 'CHARITY_FUND' | 'NEXT_SEASON';

export interface Temple {
  id: string;
  name: string;
  slug: string;
  address: string;
  province: string;
  representativeName: string;
  phone: string;
  avatarUrl: string;
  isVerified: boolean;
  onTimeReportRate: number; // e.g. 100 (%)
  bankAccount: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface BudgetItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  actualExpense?: number;
  notes?: string;
}

export interface DonationItem {
  id: string;
  donationCode: string;
  donorName: string;
  isAnonymous: boolean;
  isAmountHidden: boolean;
  amount: number;
  prayerMessage?: string;
  confirmedAt: string;
  status: 'CONFIRMED' | 'PENDING' | 'MANUAL_CONFIRMED';
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  type: CampaignType;
  typeLabel: string;
  description: string;
  coverImage: string;
  temple: Temple;
  targetAmount: number;
  confirmedAmount: number;
  pendingAmount: number;
  eventDate: string;
  endDate: string;
  daysRemaining: number;
  status: CampaignStatus;
  surplusPolicy: SurplusPolicy;
  surplusPolicyLabel: string;
  allowOverTarget: boolean;
  monksCount?: number;
  robesCount?: number;
  retreatSeason?: string;
  budgetItems: BudgetItem[];
  donations: DonationItem[];
}
