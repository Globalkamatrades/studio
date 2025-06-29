"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Public Sale", percentage: 40, fill: "var(--color-public)" },
  { category: "Rewards", percentage: 20, fill: "var(--color-rewards)" },
  { category: "Team", percentage: 15, fill: "var(--color-team)" },
  { category: "Liquidity", percentage: 15, fill: "var(--color-liquidity)" },
  { category: "Marketing", percentage: 10, fill: "var(--color-marketing)" },
]

const chartConfig = {
  percentage: {
    label: "Percentage",
  },
  public: {
    label: "Public Sale (40%)",
    color: "hsl(var(--chart-1))",
  },
  rewards: {
    label: "Rewards (20%)",
    color: "hsl(var(--chart-2))",
  },
  team: {
    label: "Team (15%)",
    color: "hsl(var(--chart-3))",
  },
  liquidity: {
    label: "Liquidity (15%)",
    color: "hsl(var(--chart-4))",
  },
  marketing: {
    label: "Marketing (10%)",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export const TokenDistributionChart: React.FC = () => {
  return (
    <Card className="border-none shadow-none bg-transparent flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tokenomics Distribution</CardTitle>
        <CardDescription>
          Allocation of the 1B total supply
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default TokenDistributionChart
