'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { DEMO_SALONS, DemoStaff } from '@/lib/demo-data';
import { getLimit } from '@/features/billing/plans';
import { Plus, Users, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerStaffPage() {
  const salon = DEMO_SALONS[0];
  const [staffList, setStaffList] = React.useState<DemoStaff[]>(salon.staff);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('Senior Stylist');

  const maxStaffLimit = getLimit(salon, 'maxStaff');
  const isAtLimit = staffList.length >= maxStaffLimit;

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    if (isAtLimit) {
      toast.error(`You have reached the ${maxStaffLimit} staff member limit for your plan. Upgrade to Pro for unlimited staff.`);
      return;
    }

    const newStaff: DemoStaff = {
      id: `st-${Date.now()}`,
      name,
      role,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };

    setStaffList([...staffList, newStaff]);
    setName('');
    setModalOpen(false);
    toast.success('Staff member added successfully');
  };

  const handleDeleteStaff = (id: string) => {
    if (staffList.length <= 1) {
      toast.error('You must keep at least 1 staff member');
      return;
    }
    setStaffList(staffList.filter((s) => s.id !== id));
    toast.success('Staff member removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Staff Team</h1>
          <p className="text-xs text-muted">
            Manage your stylists, barbers, and beauticians.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted">
            {staffList.length} / {maxStaffLimit === Infinity ? 'Unlimited' : maxStaffLimit} members
          </span>
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Staff Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((st) => (
          <Card key={st.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={st.photoUrl}
                alt={st.name}
                className="w-12 h-12 rounded-2xl object-cover border"
              />
              <div>
                <h3 className="font-bold text-sm text-ink">{st.name}</h3>
                <p className="text-xs text-muted">{st.role}</p>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                  Active
                </span>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-ruby-600 hover:bg-ruby-50"
              onClick={() => handleDeleteStaff(st.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title="Add Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4 pt-2">
          <Input
            label="Staff Member Full Name *"
            placeholder="e.g. Kasun Rajapaksa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Role / Title"
            placeholder="e.g. Senior Colorist / Master Barber"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Staff Member
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
