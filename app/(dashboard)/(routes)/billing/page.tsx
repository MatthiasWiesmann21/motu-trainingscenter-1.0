"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, Download, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress";

interface Price {
  id: string
  object: string
  active: boolean
  billing_scheme: string
  created: number
  currency: string
  custom_unit_amount: number | null
  livemode: boolean
  lookup_key: string | null
  metadata: Record<string, unknown>
  nickname: string | null
  product: string
  recurring: {
    aggregate_usage: string | null
    interval: string
    interval_count: number
    meter: string | null
    trial_period_days: number | null
    usage_type: string
  }
  tax_behavior: string
  tiers_mode: string | null
  transform_quantity: string | null
  type: string
  unit_amount: number
  unit_amount_decimal: string
}

interface Product {
  id: string
  object: string
  active: boolean
  attributes: any[]
  created: number
  default_price: string
  description: string
  features: string[]
  images: any[]
  livemode: boolean
  marketing_features: any[]
  metadata: Record<string, unknown>
  name: string
  package_dimensions: any | null
  shippable: any | null
  statement_descriptor: any | null
  tax_code: any | null
  type: string
  unit_label: any | null
  updated: number
  url: any | null
  prices: Price[]
}

interface CurrentPlan {
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

interface UsageStats {
  emails: { used: number; limit: number }
  projects: { used: number; limit: number }
  members: { used: number; limit: number }
}

interface PaymentMethod {
  type: string
  last4: string
  expiry: string
}

interface BillingHistory {
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

export default function BillingPage() {
  const [packages, setPackages] = useState<Product[]>([])
  const [isYearly, setIsYearly] = useState(false)
  const [showPricing, setShowPricing] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview") // Step 1: Add selectedTab state

  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    name: "Pro Plan",
    price: 29,
    interval: 'month',
    features: ["500 emails/month", "10 projects", "5 team members"]
  })
  const [usageStats, setUsageStats] = useState<UsageStats>({
    emails: { used: 350, limit: 500 },
    projects: { used: 7, limit: 10 },
    members: { used: 3, limit: 5 }
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "Visa",
    last4: "4242",
    expiry: "12/2024"
  })
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([
    { date: "2023-05-01", amount: 29, status: "paid" },
    { date: "2023-04-01", amount: 29, status: "paid" },
    { date: "2023-03-01", amount: 29, status: "paid" },
  ])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/packages", { method: "GET" })
        const data = await response.json()
        setPackages(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const filteredPackages = isYearly ? packages.slice(3, 6) : packages.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Billing & Subscription</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan: {currentPlan.name}</CardTitle>
              <CardDescription>
                ${currentPlan.price}/{currentPlan.interval}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setSelectedTab("plans")} variant="outline"> {/* Step 2: Implement the onClick */}
                Change Plan
              </Button>
              <Button variant="destructive">Cancel Subscription</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="mb-8 flex items-center justify-center space-x-2">
            <Label htmlFor="billing-switch">Monthly</Label>
            <Switch
              id="billing-switch"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="Toggle between monthly and yearly billing"
            />
            <Label htmlFor="billing-switch">Yearly</Label>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => {
              const price = pkg.prices.find((price) => 
                price.recurring.interval === (isYearly ? "year" : "month")
              )

              return (
                <Card key={pkg.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{pkg.name.trim().split("-")[0]}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-center">
                      <span className="text-4xl font-bold">${(price?.unit_amount || 0) / 100}</span>
                      <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={pkg.name.toLowerCase().includes(currentPlan.name.toLowerCase()) ? "outline" : "default"}
                    >
                      {pkg.name.toLowerCase().includes(currentPlan.name.toLowerCase()) ? "Current Plan" : "Switch to this plan"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <CreditCard className="h-6 w-6" />
                <div>
                  <p className="font-medium">{paymentMethod.type} ending in {paymentMethod.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires {paymentMethod.expiry}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Update Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent billing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}