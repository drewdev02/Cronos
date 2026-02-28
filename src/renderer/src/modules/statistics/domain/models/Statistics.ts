export interface EarningsByClient {
  clientName: string
  earned: number
}

export interface TimeDistributionEntry {
  name: string
  value: number
}

export interface TrendEntry {
  day: string
  earned: number
}

export interface Statistics {
  earningsByClient: EarningsByClient[]
  timeDistribution: TimeDistributionEntry[]
  trend: TrendEntry[]
}
