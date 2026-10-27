'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LockedFeatureGate } from '@/components/common/locked-feature-gate';
import { DEMO_SALONS } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { formatLKR } from '@/lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Clock } from 'lucide-react';

const monthlyRevenueData = [
  { month: 'May', revenue: 145000, bookings: 42 },
  { month: 'Jun', revenue: 198000, bookings: 56 },
  { month: 'Jul', revenue: 245000, bookings: 68 },
  { month: 'Aug', revenue: 280000, bookings: 75 },
  { month: 'Sep', revenue: 340000, bookings: 88 },
  { month: 'Oct', revenue: 395000, bookings: 94 },
];

const busiestHoursData = [
  { hour: '9 AM', clients: 4 },
  { hour: '11 AM', clients: 8 },
  { hour: '1 PM', clients: 5 },
  { hour: '3 PM', clients: 9 },
  { hour: '5 PM', clients: 14 },
  { hour: '7 PM', clients: 12 },
];

const revenuePerServiceData = [
  { service: 'Balayage', revenue: 160000 },
  { service: 'Bridal Pack', revenue: 120000 },
  { service: 'Precision Cut', revenue: 65000 },
  { service: 'Keratin Glaze', revenue: 50000 },
];

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function OwnerAnalyticsPage() {
  const { currentSalon: salon } = useOwnerSalon();
  const isLocked = !can(salon, 'revenueAndAnalyticsReports');

  return (
    <LockedFeatureGate
      isLocked={isLocked}
      featureName="Revenue Analytics & Performance Reports"
      description="Track monthly salon revenue growth, busiest appointment hours, average ticket size, and no-show rates."
      salonName={salon.name}
      billingCode={salon.billingCode}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Revenue & Analytics</h1>
          <p className="text-xs text-muted">
            Performance analytics, busy hour breakdowns, and client retention trends.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Monthly Revenue
            </span>
            <p className="text-2xl font-black text-primary-deep">{formatLKR(395000)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +16.2% vs last month
            </p>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Average Ticket
            </span>
            <p className="text-2xl font-black text-ink">{formatLKR(4200)}</p>
            <p className="text-[11px] text-muted">Per completed booking</p>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Busiest Window
            </span>
            <p className="text-2xl font-black text-ink">4 PM - 7 PM</p>
            <p className="text-[11px] text-muted">Fridays & Saturdays</p>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              No-Show Rate
            </span>
            <p className="text-2xl font-black text-emerald-600">3.2%</p>
            <p className="text-[11px] text-muted">Industry avg is 14%</p>
          </Card>
        </div>

        {/* Revenue Growth Chart */}
        <Card className="p-6 space-y-4">
          <CardTitle>Monthly Revenue Growth (LKR)</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B6CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B6CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3F5" />
                <XAxis dataKey="month" stroke="#6B6785" fontSize={12} />
                <YAxis
                  stroke="#6B6785"
                  fontSize={12}
                  tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B6CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2-Column charts: Busiest Hours + Revenue per Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <CardTitle>Busiest Hours of the Day</CardTitle>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={busiestHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E3F5" />
                  <XAxis dataKey="hour" stroke="#6B6785" fontSize={11} />
                  <YAxis stroke="#6B6785" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="clients" fill="#5B3FD1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <CardTitle>Revenue by Treatment (LKR)</CardTitle>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenuePerServiceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E3F5" />
                  <XAxis
                    type="number"
                    stroke="#6B6785"
                    fontSize={11}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <YAxis type="category" dataKey="service" stroke="#6B6785" fontSize={11} width={80} />
                  <Tooltip formatter={(v: any) => `LKR ${Number(v).toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#8B6CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </LockedFeatureGate>
  );
}
