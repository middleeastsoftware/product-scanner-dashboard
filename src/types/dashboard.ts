export interface DashboardMetrics {
  totalProducts: number
  totalVinyl: number
  totalCD: number
  totalCassette: number
  recentProducts24h: number
  recentProducts7d: number
  recentProducts30d: number
  submissionCount: number
  successRate: number
  failedSubmissions: number
  uniqueVendors: number
  uniqueArtists: number
}

export interface RecentProduct {
  id: number
  title: string
  vendor: string
  productType: string
  discogsId: string
  shopifyId: string
  status: string
  tags: string[]
  imageUrl: string
  createdAt: string
  submissionCount: number
}

export interface ProductStats {
  productType: string
  count: number
  percentage: number
}

export interface VendorStats {
  vendor: string
  count: number
}

export interface ActivityItem {
  id: number
  type: 'product_created' | 'submission_failed' | 'submission_success'
  title: string
  message: string
  timestamp: string
  productId: number
}

export interface SubmissionStats {
  total: number
  successful: number
  failed: number
  successRate: number
}

export interface DailyProductCount {
  date: string
  count: number
}
