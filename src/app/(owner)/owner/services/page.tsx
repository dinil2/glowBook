'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { DEMO_SALONS, DemoService } from '@/lib/demo-data';
import { getLimit } from '@/features/billing/plans';
import { formatLKR } from '@/lib/utils';
import { Plus, Scissors, Clock, Trash2, Edit3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerServicesPage() {
  const salon = DEMO_SALONS[0];
  const [services, setServices] = React.useState<DemoService[]>(salon.services);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<DemoService | null>(null);

  // Form fields
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('hair');
  const [priceLkr, setPriceLkr] = React.useState(3500);
  const [durationMin, setDurationMin] = React.useState(45);
  const [description, setDescription] = React.useState('');
  const [kind, setKind] = React.useState<'service' | 'package'>('service');

  const maxServicesLimit = getLimit(salon, 'maxServices');
  const isAtLimit = services.length >= maxServicesLimit;

  const handleOpenAdd = () => {
    if (isAtLimit) {
      toast.error(`You have reached the ${maxServicesLimit} services limit for your plan. Upgrade to Pro for unlimited services.`);
      return;
    }
    setEditingService(null);
    setName('');
    setCategory('hair');
    setPriceLkr(3500);
    setDurationMin(45);
    setDescription('');
    setKind('service');
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: DemoService) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setPriceLkr(srv.priceLkr);
    setDurationMin(srv.durationMin);
    setDescription(srv.description);
    setKind(srv.kind);
    setModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Service name is required');
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, name, category, priceLkr: Number(priceLkr), durationMin: Number(durationMin), description, kind }
            : s
        )
      );
      toast.success('Service updated successfully');
    } else {
      const newSrv: DemoService = {
        id: `srv-${Date.now()}`,
        name,
        category,
        priceLkr: Number(priceLkr),
        durationMin: Number(durationMin),
        description,
        kind,
      };
      setServices([...services, newSrv]);
      toast.success('New service created successfully');
    }

    setModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success('Service removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Services & Packages</h1>
          <p className="text-xs text-muted">
            Manage your salon treatment menu, pricing, and duration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted">
            {services.length} / {maxServicesLimit === Infinity ? 'Unlimited' : maxServicesLimit} active
          </span>
          <Button variant="primary" size="md" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Service / Package
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-ink">{s.name}</h3>
                    {s.kind === 'package' && (
                      <Badge variant="purple" className="text-[10px] py-0 px-2">
                        Package
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                    Category: {s.category}
                  </span>
                </div>
                <span className="text-base font-extrabold text-primary-deep">
                  {formatLKR(s.priceLkr)}
                </span>
              </div>

              <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                {s.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-muted-border/60 flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {s.durationMin} mins
              </span>

              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenEdit(s)}>
                  <Edit3 className="w-3.5 h-3.5 text-muted hover:text-ink" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-ruby-600 hover:bg-ruby-50" onClick={() => handleDeleteService(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Add/Edit Dialog */}
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingService ? 'Edit Service' : 'Add New Service / Package'}
      >
        <form onSubmit={handleSaveService} className="space-y-4 pt-2">
          <Input
            label="Service / Package Name *"
            placeholder="e.g. Balayage & Glossing"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink focus:outline-none focus:border-primary"
              >
                <option value="hair">Hair Care</option>
                <option value="barber">Barber</option>
                <option value="bridal">Bridal</option>
                <option value="nails">Nails</option>
                <option value="facial">Facial</option>
                <option value="spa">Spa</option>
                <option value="makeup">Makeup</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                Treatment Kind
              </label>
              <select
                value={kind}
                onChange={(e: any) => setKind(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink focus:outline-none focus:border-primary"
              >
                <option value="service">Single Service</option>
                <option value="package">Bridal / Combo Package</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (LKR) *"
              type="number"
              value={priceLkr}
              onChange={(e) => setPriceLkr(Number(e.target.value))}
            />
            <Input
              label="Duration (Minutes) *"
              type="number"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>

          <Input
            label="Description"
            placeholder="Describe what is included in this treatment..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Service
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
