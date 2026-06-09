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

const axisStyle = { fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }

const tooltipProps = {
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
}

export function ActivityAreaChart({
  data,
}: {
  data: { month: string; published: number; contributions: number }[]
}) {
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
        <Area
          type="monotone"
          dataKey="published"
          name="منشورات"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#gPublished)"
        />
        <Area
          type="monotone"
          dataKey="contributions"
          name="مساهمات"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#gContrib)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SearchLineChart({ data }: { data: { month: string; searches: number }[] }) {
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
          name="عمليات البحث"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-3)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DepartmentBarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
          width={80}
          orientation="right"
        />
        <Tooltip {...tooltipProps} />
        <Bar dataKey="value" name="أصول" fill="var(--chart-1)" radius={[4, 0, 0, 4]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HealthPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
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
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sans)" }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
