'use client';

import { useEffect, useMemo, useState } from 'react';

type SalesOrder = {
  id: string;
  paymentType: 'crypto' | 'mercadopago';
  status: string;
  amountUsd: number;
  tokenAddress: string;
  chainId: number;
  txHash: string | null;
  createdAt: string;
  artworkTitle: string | null;
  buyerEmail: string | null;
  walletAddress: string | null;
  shippingCity: string | null;
  shippingCountry: string | null;
  shippingAddress: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
};

type SalesSummary = {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenueUsd: number;
};

type ApiResponse = {
  summary: SalesSummary;
  orders: SalesOrder[];
};

const STATUS_COLOR: Record<string, string> = {
  paid: 'text-green-500',
  pending: 'text-amber-400',
  shipped: 'text-sky-400',
  delivered: 'text-emerald-400',
};

export default function SalesDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('status', statusFilter);
        params.set('limit', String(limit));

        const res = await fetch(`/api/admin/sales?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load sales');
        }
        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [statusFilter, limit]);

  const recentOrders = useMemo(() => data?.orders.slice(0, 10) || [], [data]);

  if (loading) {
    return (
      <div className="glass-minimal p-6 rounded-lg">
        <p className="text-sm text-[#8b7d7b]">Loading sales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-minimal p-6 rounded-lg">
        <p className="text-sm text-[#8b7d7b]">Error: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={data.summary.totalOrders} />
        <StatCard label="Paid" value={data.summary.paidOrders} accent />
        <StatCard label="Pending" value={data.summary.pendingOrders} />
        <StatCard label="Shipped" value={data.summary.shippedOrders} />
        <StatCard label="Delivered" value={data.summary.deliveredOrders} />
        <StatCard
          label="Revenue (USD)"
          value={`$${data.summary.totalRevenueUsd.toFixed(2)}`}
          accent
        />
      </div>

      <div className="glass-minimal p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="elegant-text text-sm">Recent sales</h3>
          <div className="flex items-center gap-3 text-xs text-[#8b7d7b]">
            <label className="flex items-center gap-1">
              Status:
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent border border-[#1a1a1a] rounded px-2 py-1 text-xs"
              >
                <option value="all" className="bg-[#0b0b0b] text-white">All</option>
                <option value="pending" className="bg-[#0b0b0b] text-white">Pending</option>
                <option value="paid" className="bg-[#0b0b0b] text-white">Paid</option>
                <option value="shipped" className="bg-[#0b0b0b] text-white">Shipped</option>
                <option value="delivered" className="bg-[#0b0b0b] text-white">Delivered</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              Limit:
              <input
                type="number"
                min={5}
                max={200}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-16 bg-transparent border border-[#1a1a1a] rounded px-2 py-1 text-xs"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[#8b7d7b]">
                <th className="py-2 pr-4">Artwork</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Buyer</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Update</th>
                <th className="py-2 pr-4">Details</th>
                <th className="py-2 pr-4">Placed</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#1a1a1a]">
                  <td className="py-3 pr-4 text-[#e5e5e5]">
                    {order.artworkTitle || '—'}
                    <div className="text-[11px] text-[#8b7d7b]">
                      {order.tokenAddress.slice(0, 6)}... on chain {order.chainId}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                      order.paymentType === 'crypto'
                        ? 'border-[#8a1c1c]/40 text-[#8a1c1c] bg-[#8a1c1c]/5'
                        : 'border-sky-900/40 text-sky-400 bg-sky-900/5'
                    }`}>
                      {order.paymentType === 'crypto' ? 'Crypto' : 'MP'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-[#e5e5e5]">{order.buyerEmail || 'Wallet'}</div>
                    <div className="text-[11px] text-[#8b7d7b]">
                      {order.walletAddress
                        ? `${order.walletAddress.slice(0, 6)}...${order.walletAddress.slice(-4)}`
                        : '—'}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#e5e5e5]">
                    ${order.amountUsd.toFixed(2)}
                  </td>
                  <td className={`py-3 pr-4 ${STATUS_COLOR[order.status] || 'text-[#e5e5e5]'}`}>
                    {order.status}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusUpdater orderId={order.id} current={order.status} />
                  </td>
                  <td className="py-3 pr-4 text-[#8b7d7b]">
                    <ShippingDetailButton order={order} />
                  </td>
                  <td className="py-3 pr-4 text-[#8b7d7b]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`glass-minimal p-4 rounded-lg ${accent ? 'border border-[#8a1c1c]/30' : ''}`}>
      <p className="text-xs text-[#8b7d7b] uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-2xl text-[#e5e5e5] font-light">{value}</p>
    </div>
  );
}

function StatusUpdater({ orderId, current }: { orderId: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = ['pending', 'paid', 'shipped', 'delivered'] as const;

  const updateStatus = async (next: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sales/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Failed to update');
      setStatus(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-xs text-[#e5e5e5]">
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={saving}
        className="bg-transparent border border-[#1a1a1a] rounded px-2 py-1 text-xs"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0b0b0b] text-white">
            {opt}
          </option>
        ))}
      </select>
      {saving && <span className="text-[10px] text-[#8b7d7b]">Saving...</span>}
      {error && <span className="text-[10px] text-[#a33]">{error}</span>}
    </div>
  );
}

function ShippingDetailButton({ order }: { order: SalesOrder }) {
  const [open, setOpen] = useState(false);
  if (!order.shippingAddress && !order.shippingName) return <span>—</span>;

  return (
    <div className="text-xs">
      <button
        onClick={() => setOpen(true)}
        className="underline underline-offset-4 text-[#e5e5e5] hover:text-[#8a1c1c]"
      >
        View
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-minimal p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-[#8b7d7b] text-sm"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <h4 className="elegant-text text-sm mb-3">Shipping Details</h4>
            <div className="space-y-2 text-[#e5e5e5] text-sm">
              <div><span className="text-[#8b7d7b]">Name: </span>{order.shippingName || '—'}</div>
              <div><span className="text-[#8b7d7b]">Address: </span>{order.shippingAddress || '—'}</div>
              <div><span className="text-[#8b7d7b]">City: </span>{order.shippingCity || '—'}</div>
              <div><span className="text-[#8b7d7b]">Country: </span>{order.shippingCountry || '—'}</div>
              <div><span className="text-[#8b7d7b]">Phone: </span>{order.shippingPhone || '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
