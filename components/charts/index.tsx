"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useLocale, useT } from "@/hooks/use-locale"

const axisStyle = { fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }
const BAR_SIZE = 16
const BAR_GAP = 4
const X_AXIS_HEIGHT = 30
const LABEL_LINE_HEIGHT = 15 // text-[11px] with leading-snug (~1.36)
const LABEL_PAD = 4

type CategoryTickProps = {
  x: number
  y: number
  payload: { value: string }
  labelWidth: number
  dir: "rtl" | "ltr"
}

/**
 * Renders category labels at Recharts' tick `y` (band center) so they stay
 * aligned with bars. foreignObject allows wrapping; first line is anchored to `y`.
 */
function CategoryAxisTick({ x, y, payload, labelWidth, dir }: CategoryTickProps) {
  const boxWidth = labelWidth - LABEL_PAD * 2
  const foX = dir === "rtl" ? x : x - boxWidth

  return (
    <foreignObject
      x={foX}
      y={y - LABEL_LINE_HEIGHT / 2}
      width={boxWidth}
      height={LABEL_LINE_HEIGHT * 4}
      className="overflow-visible"
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="text-[11px] leading-[15px] text-muted-foreground"
        style={{
          fontFamily: "var(--font-sans)",
          textAlign: dir === "rtl" ? "left" : "right",
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  )
}

type LegendEntry = { value: string; color: string }

function ChartLegend({ payload }: { payload?: LegendEntry[] }) {
  if (!payload?.length) return null

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3">
      {payload.map((entry) => (
        <li key={entry.value} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: entry.color }}
            aria-hidden
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

function useTooltipProps() {
  const { formatNumber } = useLocale()
  return {
    contentStyle: {
      background: "var(--popover)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      fontSize: 12,
      fontFamily: "var(--font-sans)",
      color: "var(--popover-foreground)",
    },
    labelStyle: { color: "var(--popover-foreground)", marginBottom: 4 },
    cursor: { fill: "var(--muted)", opacity: 0.4 },
    formatter: (value: number, name: string) => [formatNumber(value), name] as [string, string],
  }
}

export function ActivityAreaChart({
  data,
}: {
  data: { month: string; published: number; contributions: number }[]
}) {
  const t = useT()
  const tooltipProps = useTooltipProps()

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gPublished" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} reversed />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={36} />
        <Tooltip {...tooltipProps} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sans)" }} />
        <Area type="monotone" dataKey="published" name={t("charts.published")} stroke="var(--chart-1)" strokeWidth={2} fill="url(#gPublished)" />
        <Area type="monotone" dataKey="contributions" name={t("charts.contributions")} stroke="var(--chart-2)" strokeWidth={2} fill="url(#gContrib)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SearchLineChart({ data }: { data: { month: string; searches: number }[] }) {
  const t = useT()
  const tooltipProps = useTooltipProps()

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} reversed />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={44} />
        <Tooltip {...tooltipProps} />
        <Line
          type="monotone"
          dataKey="searches"
          name={t("charts.searches")}
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-3)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

type RankBarSeries = {
  dataKey: string
  name: string
  fill: string
}

function categoryLabelWidth(labels: string[]) {
  const longest = Math.max(0, ...labels.map((l) => l.length))
  return Math.min(280, Math.max(96, Math.ceil(longest * 8)))
}

function bandHeightForSeries(seriesCount: number, minBand = 38) {
  const stackHeight = seriesCount * BAR_SIZE + Math.max(0, seriesCount - 1) * BAR_GAP
  return Math.max(minBand, stackHeight + 10)
}

function HorizontalRankBarChart({
  data,
  categoryKey = "name",
  series,
  rowHeight,
  showLegend = true,
}: {
  data: Record<string, string | number>[]
  categoryKey?: string
  series: RankBarSeries[]
  rowHeight?: number
  showLegend?: boolean
}) {
  const { dir } = useLocale()
  const tooltipProps = useTooltipProps()
  const barRadius: [number, number, number, number] =
    dir === "rtl" ? [0, 4, 4, 0] : [4, 0, 0, 4]
  const labels = data.map((row) => String(row[categoryKey]))
  const labelWidth = categoryLabelWidth(labels)
  const bandHeight = rowHeight ?? bandHeightForSeries(series.length)
  const topMargin = 4
  const bottomMargin = X_AXIS_HEIGHT + 4
  const chartHeight = topMargin + data.length * bandHeight + bottomMargin
  const legendPayload = series.map((bar) => ({ value: bar.name, color: bar.fill }))

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: topMargin, right: 8, left: 8, bottom: bottomMargin }}
          barCategoryGap={0}
          barGap={BAR_GAP}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
            height={X_AXIS_HEIGHT}
            reversed={dir === "rtl"}
          />
          <YAxis
            type="category"
            dataKey={categoryKey}
            width={labelWidth}
            axisLine={false}
            tickLine={false}
            interval={0}
            orientation={dir === "rtl" ? "right" : "left"}
            tick={(props) => (
              <CategoryAxisTick
                x={props.x}
                y={props.y}
                payload={props.payload}
                labelWidth={labelWidth}
                dir={dir}
              />
            )}
          />
          <Tooltip {...tooltipProps} />
          {series.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.fill}
              radius={barRadius}
              barSize={BAR_SIZE}
              maxBarSize={BAR_SIZE}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {showLegend && <ChartLegend payload={legendPayload} />}
    </div>
  )
}

export function DepartmentBarChart({ data }: { data: { name: string; value: number }[] }) {
  const t = useT()

  return (
    <HorizontalRankBarChart
      data={data}
      showLegend={false}
      series={[{ dataKey: "value", name: t("charts.assets"), fill: "var(--chart-1)" }]}
    />
  )
}

export function TopContributorsChart({
  data,
}: {
  data: { name: string; contributions: number; assets: number }[]
}) {
  const t = useT()

  return (
    <HorizontalRankBarChart
      data={data}
      series={[
        { dataKey: "contributions", name: t("charts.contributionsLabel"), fill: "var(--chart-1)" },
        { dataKey: "assets", name: t("charts.publishedAssets"), fill: "var(--chart-2)" },
      ]}
    />
  )
}

export function TopCommunitiesChart({
  data,
}: {
  data: { name: string; members: number; posts: number; assets: number }[]
}) {
  const t = useT()

  return (
    <HorizontalRankBarChart
      data={data}
      series={[
        { dataKey: "posts", name: t("charts.posts"), fill: "var(--chart-1)" },
        { dataKey: "members", name: t("charts.members"), fill: "var(--chart-4)" },
        { dataKey: "assets", name: t("charts.producedAssets"), fill: "var(--chart-2)" },
      ]}
    />
  )
}

export function HealthPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const tooltipProps = useTooltipProps()
  const legendPayload = data.map((d) => ({ value: d.name, color: d.color }))

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={88}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipProps} />
        </PieChart>
      </ResponsiveContainer>
      <ChartLegend payload={legendPayload} />
    </div>
  )
}
