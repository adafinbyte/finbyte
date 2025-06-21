"use client"

import { PieChart, Pie, Cell } from "recharts"
import { useState } from "react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "../ui/card";

const data = [
  { name: "Platform Rewards", value: 5, fill: "hsl(var(--chart-2))" },
  { name: "Staking Rewards", value: 5, fill: "hsl(var(--chart-3))" },
  { name: "Team Funding", value: 2.5, fill: "hsl(var(--chart-4))" },
  { name: "Presale & Liquidity", value: 7.5, fill: "hsl(var(--chart-5))" },
  { name: "Vesting", value: 30, fill: "hsl(var(--chart-1))" },
];

const chartConfig = {
  value: {
    label: "Usage %",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export default function TokenDistribution() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="p-2 grid gap-y-4 mt-6">
      <h1 className="text-xl font-semibold">
        Token Distribution Ideas
      </h1>
      <h1 className="text-sm text-muted-foreground font-semibold">
        These values are not final and may change depending how
        we decided based on future tokenomics.
      </h1>

      <Card className="p-4 bg-secondary/20 backdrop-blur-lg">
        <h1 className="text-sm text-muted-foreground font-semibold">
          Changes from initial ideas.
        </h1>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Half the token supply to 500,000,000 - 500M</li>
        </ul>
      </Card>

      <div className="flex flex-wrap items-center gap-3 justify-center">
        {data.map((item, index) => (
          <Card key={index} className="px-4 py-2 text-center flex flex-col gap-0.5">
            <h1 className="font-semibold text-sm text-muted-foreground">
              {item.name}
            </h1>

            <p className="text-xl font-medium">
              ƒ{(item.value * 10000000).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <div className=" grid gap-8">
        <ChartContainer config={chartConfig} className="min-h-64">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{name}:</span>
                      <span className="font-bold">{value}%</span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              stroke="hsl(var(--background))"
              strokeWidth={2}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  fillOpacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.3}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <Card className="p-4">
          <div className="mt-2">
            <ol className="space-y-12">
              <li>
                <h1 className="underline text-lg font-semibold">
                  Token Vesting 
                </h1>

                <div className="w-3/4 text-center mx-auto p-4 bg-secondary rounded-xl my-4">
                  <div className="grid grid-cols-2 gap-8">
                    <h1>300 Million $FIN</h1>
                    <h1>60% of Total Supply</h1>
                  </div>
                </div>

                <div>
                  To align with our long-term vision, 60% of the total $FIN supply (300 million tokens)
                  will be locked and vested using trusted Cardano-native locking tools like cnft.tools.
                  These tokens will be gradually released over several years and allocated toward:

                  <div className="my-4">
                    <ol className="list-disc list-inside space-y-1">
                      <li>Ecosystem incentives</li>
                      <li>Future Community incentives</li>
                      <li>Strategic partnerships and grants</li>
                      <li>Platform scalability and innovation</li>
                    </ol>
                  </div>

                  <div className="p-4 border-l border-l-green-400 bg-secondary rounded-r-xl my-10">
                    Why vesting?
                    We believe token vesting discourages speculation and promotes confidence in Finbyte's long-term commitment.
                  </div>
                </div>
              </li>

              <li>
                <h1 className="underline text-lg font-semibold">
                  Platform Rewards
                </h1>

                <div className="w-3/4 text-center mx-auto p-4 bg-secondary rounded-xl my-4">
                  <div className="grid grid-cols-2 gap-8">
                    <h1>50 Million $FIN</h1>
                    <h1>10% of Total Supply</h1>
                  </div>
                </div>

                <div>
                  50 million $FIN tokens are set aside to directly reward user interaction across the Finbyte platform.
                  You'll be able to earn $FIN by:

                  <div className="my-4">
                    <ol className="list-disc list-inside space-y-1">
                      <li>Liking, commenting, and posting on the platform</li>
                      <li>Participating in discussion forums</li>
                      <li>Engaging in verified Cardano community initiatives</li>
                      <li>Supporting other projects through curated tasks and challenges</li>
                    </ol>
                  </div>

                  This ensures that Finbyte becomes a community-powered economy where your
                  time and effort are genuinely valued.
                </div>
              </li>

              <li>
                <h1 className="underline text-lg font-semibold">
                  Staking Rewards
                </h1>

                <div className="w-3/4 text-center mx-auto p-4 bg-secondary rounded-xl my-4">
                  <div className="grid grid-cols-2 gap-8">
                    <h1>50 Million $FIN</h1>
                    <h1>10% of Total Supply</h1>
                  </div>
                </div>

                <div>
                  To further incentivize token holding and platform alignment, 10% of $FIN
                  supply (50 million tokens) is allocated for staking rewards. Users will be able to:

                  <div className="my-4">
                    <ol className="list-disc list-inside space-y-1">
                      <li>Stake $FIN to support the network</li>
                      <li>Earn proportional rewards over time</li>
                      <li>Gain access to governance and exclusive platform benefits</li>
                    </ol>
                  </div>

                  This encourages healthy supply circulation while rewarding loyal contributors.
                </div>
              </li>

              <li>
                <h1 className="underline text-lg font-semibold">
                  Team & Development
                </h1>

                <div className="w-3/4 text-center mx-auto p-4 bg-secondary rounded-xl my-4">
                  <div className="grid grid-cols-2 gap-8">
                    <h1>25 Million $FIN</h1>
                    <h1>5% of Total Supply</h1>
                  </div>
                </div>

                <div>
                  We've reserved 25 million $FIN tokens (5% of the total supply) for the
                  Finbyte team, core contributors, and future platform development.
                  These tokens will be vested with a structured release schedule to promote
                  long-term commitment, transparency, and responsible stewardship.

                  <div className="my-4">
                    Funds from this allocation will support:
                    <ol className="list-disc list-inside space-y-1">
                      <li>Ongoing development and R&D</li>
                      <li>Infrastructure, servers, and APIs</li>
                      <li>Contributor grants, audits and bounties</li>
                      <li>Legal compliance, community events, and marketing campaigns</li>
                    </ol>
                  </div>
                </div>

                <div className="p-4 border-l border-l-green-400 bg-secondary rounded-r-xl my-10">
                  <h1 className="font-semibold">Why only 5%?</h1>

                  <div className="my-2 text-sm pl-4">
                    <p>
                      We believe in building alongside our community, not above it.
                      By limiting our team allocation, we're signaling our commitment
                      to sustainability and decentralization. To remain aligned with
                      our values and goals, our team will also participate in our own
                      staking platform to earn additional rewards, just like any
                      other user. Only a portion of the 5% will be released upfront;
                      the rest is gradually vested over time. This keeps us accountable,
                      while still ensuring we have enough resources to fund ongoing
                      development and scale responsibly as the platform grows.
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <h1 className="underline text-lg font-semibold">
                  Presale & Liquidity
                </h1>

                <div className="w-3/4 text-center mx-auto p-4 bg-secondary rounded-xl my-4">
                  <div className="grid grid-cols-2 gap-8">
                    <h1>75 Million $FIN</h1>
                    <h1>15% of Total Supply</h1>
                  </div>
                </div>

                <div>
                  To bootstrap a liquid and fair market at launch, 15% of the supply
                  (75 million $FIN) will be offered through a community presale.
                  All funds raised will go directly into liquidity pools on supported
                  Cardano DEXs.

                  <div className="my-4">
                    Presale participants will help shape Finbyte's future by:
                    <ol className="list-disc list-inside space-y-1">
                      <li>Supporting launch stability</li>
                      <li>Ensuring organic price discovery</li>
                      <li>Enabling early governance and access</li>
                    </ol>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  )
}
