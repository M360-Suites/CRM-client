"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Coins,
  Database,
  Gauge,
  GitBranch,
  LibraryBig,
  Plug,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import type { RevenueTabKey } from "./header";

const summary = {
  spend: 125000,
  revenue: 325000,
  roas: 2.6,
  cac: 1850,
  winRate: 32,
  cycleDays: 16,
  impressions: 1245000,
  clicks: 42250,
  cpc: 2.96,
  costPerLead: 310,
  byPlatform: [
    { name: "Google Ads", spend: 48000, revenue: 120000 },
    { name: "Meta", spend: 35000, revenue: 92000 },
    { name: "LinkedIn", spend: 22000, revenue: 61000 },
    { name: "SEO", spend: 20000, revenue: 52000 },
  ],
};

const dummyData = {
  connectors: [
    { id: "c1", name: "Google Ads", status: "connected", lastSynced: "2 min ago", spend: 48000 },
    { id: "c2", name: "Meta", status: "connected", lastSynced: "7 min ago", spend: 35000 },
    { id: "c3", name: "LinkedIn", status: "pending", lastSynced: "never", spend: 22000 },
  ],
  attribution: [
    { name: "Search — Q4", platform: "Google Ads", spend: 28000, revenue: 86000, roi: 206 },
    { name: "Retargeting", platform: "Meta", spend: 17000, revenue: 64000, roi: 276 },
    { name: "Outbound ads", platform: "LinkedIn", spend: 15000, revenue: 34000, roi: 127 },
  ],
  cost: [
    { id: "p1", name: "Search Q4", platform: "Google Ads", spend: 28000, clicks: 10320, impressions: 410000 },
    { id: "p2", name: "Retargeting", platform: "Meta", spend: 17000, clicks: 9860, impressions: 390000 },
    { id: "p3", name: "LinkedIn Nurture", platform: "LinkedIn", spend: 15000, clicks: 4520, impressions: 170000 },
  ],
  routing: [
    { id: "r1", name: "Enterprise EMEA", priority: 10, owner: "Sam Lee", isActive: true },
    { id: "r2", name: "Mid-market US", priority: 20, owner: "Jane Park", isActive: true },
    { id: "r3", name: "High intent fallback", priority: 30, owner: "Round robin", isActive: false },
  ],
  nurture: [
    { id: "n1", contact: "Jamie Ford", channel: "email", status: "pending", body: "Hi Jamie, I saw your team is evaluating a pipeline update..." },
    { id: "n2", contact: "Lena Moss", channel: "sms", status: "approved", body: "Hi Lena, just checking in ..." },
  ],
  templates: [
    { id: "t1", name: "First touch follow-up", channel: "email", stage: "first_touch" },
    { id: "t2", name: "2-step nurture", channel: "email", stage: "nurture" },
    { id: "t3", name: "Enterprise check-in", channel: "sms", stage: "enterprise" },
  ],
  warehouse: [
    { source: "ad_connector", event: "campaign_logged", value: 44 },
    { source: "lead_form", event: "lead_created", value: 31 },
    { source: "routing", event: "lead_routed", value: 18 },
    { source: "ai_nurture", event: "draft_generated", value: 12 },
  ],
};

const tabs = [
  { value: "overview", label: "CRO Dashboard", icon: Gauge },
  { value: "connectors", label: "Ad Connectors", icon: Plug },
  { value: "attribution", label: "Attribution & ROI", icon: GitBranch },
  { value: "cost", label: "Cost Intelligence", icon: Coins },
  { value: "routing", label: "Instant Routing", icon: RouteIcon },
  { value: "nurture", label: "AI Nurture", icon: Sparkles },
  { value: "templates", label: "Template Library", icon: LibraryBig },
  { value: "warehouse", label: "Data Warehouse", icon: Database },
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Body({ activeTab }: { activeTab: RevenueTabKey }) {
  const ActiveComponent = selectedTabComponent(activeTab);

  return (
    <div className="w-full">
      <ActiveComponent />
    </div>
  );
}

function selectedTabComponent(activeTab: RevenueTabKey) {
  switch (activeTab) {
    case "overview":
      return OverviewTab;
    case "connectors":
      return ConnectorsTab;
    case "attribution":
      return AttributionTab;
    case "cost":
      return CostTab;
    case "routing":
      return RoutingTab;
    case "nurture":
      return NurtureTab;
    case "templates":
      return TemplatesTab;
    case "warehouse":
      return WarehouseTab;
    default:
      return OverviewTab;
  }
}

function OverviewTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <KPI label="Ad spend" value={formatCurrency(summary.spend)} tone="#FFF3BF" />
        <KPI label="Attributed revenue" value={formatCurrency(summary.revenue)} tone="#D1FAE5" />
        <KPI label="ROAS" value={`${summary.roas.toFixed(2)}x`} tone="#FFE8D7" />
        <KPI label="CAC" value={formatCurrency(summary.cac)} tone="#FDE2E2" />
        <KPI label="Win rate" value={`${summary.winRate}%`} tone="#EDE9FE" />
        <KPI label="Cycle length" value={`${summary.cycleDays}d`} tone="#DBEAFE" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Spend vs attributed revenue by platform">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.byPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="spend" name="Spend" fill="#F8B5A3" radius={[6, 6, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#E2725B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Progress against executive targets">
          <div className="space-y-4">
            <Progress label="Revenue" current={summary.revenue} goal={400000} fmt={formatCurrency} />
            <Progress label="Ad spend vs ceiling" current={summary.spend} goal={150000} fmt={formatCurrency} invert />
            <Progress label="ROAS" current={summary.roas} goal={3} fmt={(value) => `${Number(value).toFixed(2)}x`} />
            <Progress label="CAC vs threshold" current={summary.cac} goal={2000} fmt={formatCurrency} invert />
            <Progress label="Cycle length vs target" current={summary.cycleDays} goal={14} fmt={(value) => `${Number(value).toFixed(0)}d`} invert />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPI label="Impressions" value={summary.impressions.toLocaleString()} tone="#EDE9FE" />
        <KPI label="Clicks" value={summary.clicks.toLocaleString()} tone="#FCE7F3" />
        <KPI label="Cost per click" value={formatCurrency(summary.cpc)} tone="#DCFCE7" />
        <KPI label="Cost per lead" value={formatCurrency(summary.costPerLead)} tone="#FDE68A" />
      </div>
    </div>
  );
}

function ConnectorsTab() {
  return (
    <div className="space-y-4">
      <Note>Each connector is the ingestion point for one traffic source. Dummy state is active for review until the real data layer is connected.</Note>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {dummyData.connectors.map((connector) => (
          <div key={connector.id} className="rounded-xl border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-[#1F2937]">{connector.name}</div>
                <div className="mt-0.5 text-xs text-[#6B7280]">Google / Meta / LinkedIn</div>
              </div>
              <StatusPill status={connector.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Mini label="Campaigns" value="3" />
              <Mini label="Tracked spend" value={formatCurrency(connector.spend)} />
            </div>
            <div className="mt-3 text-xs text-[#6B7280]">Last sync: {connector.lastSynced}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttributionTab() {
  return (
    <div className="space-y-4">
      <Note>Dummy attribution rows are shown here so each tab can be styled and reviewed before live data is wired in.</Note>
      <div className="overflow-x-auto rounded-xl border border-[#E8E8E8] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6B7280]">
              <th className="p-3">Campaign</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Spend</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">ROI</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.attribution.map((row) => (
              <tr key={row.name} className="border-t border-[#E8E8E8]">
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-[#6B7280]">{row.platform}</td>
                <td className="p-3">{formatCurrency(row.spend)}</td>
                <td className="p-3">{formatCurrency(row.revenue)}</td>
                <td className="p-3 font-medium text-[#166534]">{row.roi}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CostTab() {
  return (
    <div className="space-y-4">
      <Note>Cost intelligence keeps the same structure and visual rhythm while the real spend data is added later.</Note>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPI label="Total spend" value={formatCurrency(summary.spend)} tone="#FFF4D6" />
        <KPI label="CPC" value={formatCurrency(summary.cpc)} tone="#FCE7F3" />
        <KPI label="Cost per lead" value={formatCurrency(summary.costPerLead)} tone="#FDE68A" />
        <KPI label="CAC" value={formatCurrency(summary.cac)} tone="#FDE2E2" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E8E8E8] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6B7280]">
              <th className="p-3">Campaign</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Spend</th>
              <th className="p-3">Impressions</th>
              <th className="p-3">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.cost.map((row) => (
              <tr key={row.id} className="border-t border-[#E8E8E8]">
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-[#6B7280]">{row.platform}</td>
                <td className="p-3">{formatCurrency(row.spend)}</td>
                <td className="p-3">{row.impressions.toLocaleString()}</td>
                <td className="p-3">{row.clicks.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoutingTab() {
  return (
    <div className="space-y-4">
      <Note>Rules are shown as dummy route definitions for structure review while the live routing engine remains out of scope.</Note>
      <div className="space-y-2">
        {dummyData.routing.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between rounded-xl border border-[#E8E8E8] bg-white p-3">
            <div>
              <div className="text-sm font-medium text-[#1F2937]">{rule.name}</div>
              <div className="text-xs text-[#6B7280]">Priority {rule.priority} · Owner {rule.owner}</div>
            </div>
            <StatusPill status={rule.isActive ? "connected" : "pending"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NurtureTab() {
  return (
    <div className="space-y-4">
      <Note>AI nurture cards stay in review mode until the actual draft backend and auth flow are connected.</Note>
      <div className="space-y-3">
        {dummyData.nurture.map((draft) => (
          <div key={draft.id} className="rounded-xl border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#1F2937]">{draft.contact}</div>
                <div className="text-xs text-[#6B7280]">{draft.channel}</div>
              </div>
              <StatusPill status={draft.status} />
            </div>
            <p className="mt-3 text-sm text-[#5C6470]">{draft.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesTab() {
  return (
    <div className="space-y-4">
      <Note>Template cards are mock data placeholders, designed to match the final visual system.</Note>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {dummyData.templates.map((template) => (
          <div key={template.id} className="rounded-xl border border-[#E8E8E8] bg-white p-4">
            <div className="text-sm font-medium text-[#1F2937]">{template.name}</div>
            <div className="mt-1 text-xs text-[#6B7280]">{template.channel} · {template.stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarehouseTab() {
  return (
    <div className="space-y-4">
      <Note>The warehouse view keeps the same event mix layout while real event ingestion is deferred.</Note>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dummyData.warehouse} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="event" width={120} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="value" fill="#E2725B" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone }} />
        <span className="text-xs text-[#6B7280] font-medium">{label}</span>
      </div>
      <div className="mt-2 text-xl font-medium text-[#1F2937]">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-5">
      <h3 className="mb-4 text-sm font-medium text-[#1F2937]">{title}</h3>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F3F4F6] px-2.5 py-2">
      <div className="text-[11px] text-[#6B7280]">{label}</div>
      <div className="text-sm font-medium text-[#1F2937]">{value}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-[#E8E8E8] bg-white px-4 py-3 text-xs leading-relaxed text-[#5C6470]">{children}</div>;
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    connected: { bg: "#E0F2E9", fg: "#166534" },
    pending: { bg: "#FFF4D6", fg: "#9A6A14" },
    approved: { bg: "#E0F2E9", fg: "#166534" },
    default: { bg: "#F3F4F6", fg: "#6B7280" },
  };

  const color = colors[status] ?? colors.default;

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: color.bg, color: color.fg }}
    >
      {status}
    </span>
  );
}

function Progress({
  label,
  current,
  goal,
  fmt,
  invert,
}: {
  label: string;
  current: number;
  goal: number;
  fmt: (value: number) => string;
  invert?: boolean;
}) {
  const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  const good = invert ? current <= goal : current >= goal;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-[#6B7280]">{label}</span>
        <span style={{ color: good ? "#166534" : "#B91C1C", fontWeight: 500 }}>
          {fmt(current)} / {fmt(goal)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: good ? "#A7F3D0" : "#FCA5A5" }}
        />
      </div>
    </div>
  );
}
