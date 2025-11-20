import { GraphQLClient } from 'graphql-request'

// Use window.location.origin for relative proxy in development, or full URL in production
const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

export const graphqlClient = new GraphQLClient(`${API_URL}/barcode-scanner/api/v1/graphql`, {
  headers: {
    'Content-Type': 'application/json',
  },
})

// GraphQL Queries
export const GET_DASHBOARD_METRICS = /* GraphQL */ `
  query GetDashboardMetrics {
    dashboardMetrics {
      totalProducts
      totalVinyl
      totalCD
      totalCassette
      recentProducts24h
      recentProducts7d
      recentProducts30d
      submissionCount
      successRate
      failedSubmissions
      uniqueVendors
      uniqueArtists
    }
  }
`

export const GET_RECENT_PRODUCTS = /* GraphQL */ `
  query GetRecentProducts($limit: Int) {
    recentProducts(limit: $limit) {
      id
      title
      vendor
      productType
      discogsId
      shopifyId
      status
      tags
      imageUrl
      createdAt
      submissionCount
    }
  }
`

export const GET_PRODUCT_STATS = /* GraphQL */ `
  query GetProductStats {
    productStats {
      productType
      count
      percentage
    }
  }
`

export const GET_VENDOR_STATS = /* GraphQL */ `
  query GetVendorStats($limit: Int) {
    vendorStats(limit: $limit) {
      vendor
      count
    }
  }
`

export const GET_RECENT_ACTIVITY = /* GraphQL */ `
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      type
      title
      message
      timestamp
      productId
    }
  }
`

export const GET_SUBMISSION_STATS = /* GraphQL */ `
  query GetSubmissionStats {
    submissionStats {
      total
      successful
      failed
      successRate
    }
  }
`

export const GET_DAILY_PRODUCT_COUNTS = /* GraphQL */ `
  query GetDailyProductCounts($days: Int) {
    dailyProductCounts(days: $days) {
      date
      count
    }
  }
`
