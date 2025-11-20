import { useQuery } from '@tanstack/react-query'
import { graphqlClient, GET_DASHBOARD_METRICS, GET_RECENT_PRODUCTS, GET_PRODUCT_STATS, GET_DAILY_PRODUCT_COUNTS } from '@/lib/graphql-client'
import type { DashboardMetrics, RecentProduct, ProductStats, DailyProductCount } from '@/types/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Package, TrendingUp, AlertCircle, Users } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from 'recharts'

export function Dashboard() {
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useQuery<{ dashboardMetrics: DashboardMetrics }>({
    queryKey: ['dashboardMetrics'],
    queryFn: () => graphqlClient.request(GET_DASHBOARD_METRICS),
  })

  const { data: productsData, error: productsError } = useQuery<{ recentProducts: RecentProduct[] }>({
    queryKey: ['recentProducts'],
    queryFn: () => graphqlClient.request(GET_RECENT_PRODUCTS, { limit: 10 }),
  })

  const { data: statsData, error: statsError } = useQuery<{ productStats: ProductStats[] }>({
    queryKey: ['productStats'],
    queryFn: () => graphqlClient.request(GET_PRODUCT_STATS),
  })

  const { data: dailyData } = useQuery<{ dailyProductCounts: DailyProductCount[] }>({
    queryKey: ['dailyProductCounts'],
    queryFn: () => graphqlClient.request(GET_DAILY_PRODUCT_COUNTS, { days: 14 }),
  })

  const metrics = metricsData?.dashboardMetrics

  // Filter out 0% products and prepare chart config
  const chartData = statsData?.productStats?.filter(stat => stat.count > 0) || []

  const chartConfig = {
    vinyl: {
      label: "Vinyl",
      color: "hsl(var(--chart-1))",
    },
    cd: {
      label: "CD",
      color: "hsl(var(--chart-2))",
    },
    cassette: {
      label: "Cassette",
      color: "hsl(var(--chart-3))",
    },
  } as const

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (metricsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <h2 className="text-xl font-bold mb-2">Error loading dashboard</h2>
          <p>{metricsError instanceof Error ? metricsError.message : 'Unknown error'}</p>
          <pre className="mt-4 text-xs">{JSON.stringify(metricsError, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Product Scanner Dashboard</h1>
          <p className="text-[hsl(var(--color-muted-foreground))] mt-2">
            Monitor your Shopify product inventory and submissions
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalProducts || 0}</div>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                +{metrics?.recentProducts24h || 0} in last 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.successRate.toFixed(1) || 0}%</div>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                {metrics?.submissionCount || 0} total submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Submissions</CardTitle>
              <AlertCircle className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.failedSubmissions || 0}</div>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Vendors</CardTitle>
              <Users className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.uniqueVendors || 0}</div>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                {metrics?.uniqueArtists || 0} artists
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Type Distribution</CardTitle>
              <CardDescription>Breakdown by product type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              {chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="productType"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.productType.toLowerCase() === 'vinyl'
                              ? 'hsl(var(--chart-1))'
                              : entry.productType.toLowerCase() === 'cd'
                              ? 'hsl(var(--chart-2))'
                              : 'hsl(var(--chart-3))'
                          }
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {metrics?.totalProducts.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Products
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="productType" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                  No product data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products Added by Day</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData?.dailyProductCounts && dailyData.dailyProductCounts.length > 0 ? (
                <ChartContainer config={{
                  count: {
                    label: "Products",
                    color: "hsl(var(--chart-1))",
                  },
                }}>
                  <BarChart
                    data={dailyData.dailyProductCounts.map(item => ({
                      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      count: item.count,
                    }))}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                  No daily product data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest products added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm">Image</th>
                    <th className="text-left p-3 font-medium text-sm">Product</th>
                    <th className="text-left p-3 font-medium text-sm">Vendor</th>
                    <th className="text-left p-3 font-medium text-sm">Type</th>
                    <th className="text-left p-3 font-medium text-sm">Status</th>
                    <th className="text-left p-3 font-medium text-sm">Discogs ID</th>
                    <th className="text-left p-3 font-medium text-sm">Shopify ID</th>
                    <th className="text-left p-3 font-medium text-sm">Submissions</th>
                    <th className="text-left p-3 font-medium text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData?.recentProducts?.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-[hsl(var(--color-accent))] transition-colors"
                    >
                      <td className="p-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[hsl(var(--color-muted))] rounded border flex items-center justify-center">
                            <Package className="h-6 w-6 text-[hsl(var(--color-muted-foreground))]" />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="max-w-[250px]">
                          <p className="text-sm font-medium truncate" title={product.title}>
                            {product.title}
                          </p>
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {product.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 bg-[hsl(var(--color-secondary))] rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {product.tags.length > 2 && (
                                <span className="text-xs text-[hsl(var(--color-muted-foreground))]">
                                  +{product.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{product.vendor}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.productType.toLowerCase().includes('vinyl') || product.productType.toLowerCase().includes('plak')
                              ? 'bg-blue-100 text-blue-800'
                              : product.productType.toLowerCase().includes('cd')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.productType}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status.toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status.toLowerCase() === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {product.discogsId ? (
                          <a
                            href={`https://www.discogs.com/release/${product.discogsId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {product.discogsId}
                          </a>
                        ) : (
                          <span className="text-sm text-[hsl(var(--color-muted-foreground))]">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {product.shopifyId ? (
                          <span className="text-sm font-mono text-xs" title={product.shopifyId}>
                            {product.shopifyId.split('/').pop()}
                          </span>
                        ) : (
                          <span className="text-sm text-[hsl(var(--color-muted-foreground))]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] text-xs font-medium">
                          {product.submissionCount}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-[hsl(var(--color-muted-foreground))]">
                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
