"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useLanguage } from "@/lib/check-language"

interface ChartProps {
  data: {
    name: string
    total: number
  }[]
  label: string
}

export const Chart = ({ data, label }: ChartProps) => {
  const [chartHeight, setChartHeight] = useState(350)
  const currentLanguage = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setChartHeight(250)
      } else if (width < 1024) {
        setChartHeight(300)
      } else {
        setChartHeight(350)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Card className="w-full my-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            total: {
              label: label,
              color: "hsl(var(--primary))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data}>
              <XAxis 
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.floor(value)}`}
                allowDecimals={false}
              />
              <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}