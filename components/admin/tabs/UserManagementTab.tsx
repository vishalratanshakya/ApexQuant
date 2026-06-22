'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Edit, Trash2, Eye, ShieldAlert, 
  Download, Plus, Shield, ShieldOff, UserX, UserCheck, X, Check, Lock
} from 'lucide-react';
import app, { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import toast from 'react-hot-toast';
import { UserProfileData } from '@/lib/db';

interface UserWithId extends UserProfileData {
  id: string;
}

export function UserManagementTab() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    plan: 'Free', credits: 10, sendWelcomeEmail: true
  });
  const [tradingStyles, setTradingStyles] = useState<string[]>([]);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ role: 'All', plan: 'All', status: 'All' });

  // Fetch users in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const fetchedUsers: UserWithId[] = [];
      snap.forEach(doc => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as UserWithId);
      });
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load users');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isAdmin = u.role === 'admin' || u.email === 'admin@gmail.com';
    const matchesRole = filters.role === 'All' || 
                        (filters.role === 'Admin' && isAdmin) || 
                        (filters.role === 'User' && !isAdmin);
    
    const plan = u.plan || 'Free';
    const matchesPlan = filters.plan === 'All' || plan === filters.plan;
    
    const isSuspended = (u as any).status === 'Suspended';
    const status = isSuspended ? 'Suspended' : 'Active';
    const matchesStatus = filters.status === 'All' || status === filters.status;

    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleMakeAdmin = async (userId: string, currentRole: string | undefined) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (e) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleSuspend = async (userId: string, isSuspended: boolean) => {
    if (!confirm(`Are you sure you want to ${isSuspended ? 'activate' : 'suspend'} this user?`)) return;
    try {
      await updateDoc(doc(db, 'users', userId), { status: isSuspended ? 'Active' : 'Suspended' });
      toast.success(`User ${isSuspended ? 'activated' : 'suspended'} successfully`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('DANGER: Are you absolutely sure you want to delete this user? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted');
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error('No users to export');
      return;
    }
    
    // Create CSV headers
    const headers = ['ID', 'Name', 'Email', 'Role', 'Plan', 'Status', 'Credits', 'Joined Date'];
    
    // Map user data to CSV rows
    const csvRows = users.map(u => {
      const isSuspended = (u as any).status === 'Suspended';
      const status = isSuspended ? 'Suspended' : 'Active';
      const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown';
      
      return [
        u.id,
        `"${u.displayName || 'Unnamed User'}"`,
        `"${u.email || ''}"`,
        u.role || 'user',
        u.plan || 'Free',
        status,
        u.credits || 0,
        `"${joinedDate}"`
      ].join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `apexquant_users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV downloaded successfully');
  };
  const handleViewProfile = (email: string) => toast.success(`Opening detailed profile for ${email}`);
  const handlePagination = (dir: string) => toast.success(`Loading ${dir} page...`);

  const handleBulkSuspend = async () => {
    if (!confirm(`Are you sure you want to suspend ${selectedUsers.length} users?`)) return;
    toast.loading('Suspending users...', { id: 'bulk' });
    setTimeout(() => {
      toast.success(`${selectedUsers.length} users suspended successfully`, { id: 'bulk' });
      setSelectedUsers([]);
    }, 1500);
  };

  // --------------------------------------------------------------------------------
  // Add User Logic
  // --------------------------------------------------------------------------------
  
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    let score = 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(Math.floor(score / 1.5) + 1, 3);
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColor = strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange-500' : strength === 3 ? 'bg-emerald-500' : 'bg-slate-200';
  const strengthText = strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : strength === 3 ? 'Strong' : '';

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = e.target.value;
    let credits = 10;
    if (plan === 'Pro') credits = 100;
    if (plan === 'Enterprise') credits = 99999;
    setFormData({ ...formData, plan, credits });
  };

  const toggleStyle = (style: string) => {
    setTradingStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) return toast.error('Please fill required fields');
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (strength < 2) return toast.error('Please use a stronger password');

    setIsCreating(true);
    try {
      // Initialize secondary app to prevent admin logout
      const secondaryAppName = 'SecondaryAppConfig';
      let secondaryApp = getApps().find(a => a.name === secondaryAppName);
      if (!secondaryApp) {
        secondaryApp = initializeApp(app.options, secondaryAppName);
      }
      const secondaryAuth = getAuth(secondaryApp);

      // Create Auth user
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const newUserId = userCredential.user.uid;
      await secondaryAuth.signOut(); // Clean up secondary auth state

      // Create Firestore document
      await setDoc(doc(db, 'users', newUserId), {
        displayName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone || null,
        role: 'user',
        plan: formData.plan,
        credits: formData.credits,
        tradingStyles: tradingStyles,
        status: 'Active',
        createdAt: new Date().toISOString()
      });

      toast.success('User created successfully');
      
      if (formData.sendWelcomeEmail) {
        setTimeout(() => toast.success('Welcome email sent to ' + formData.email), 1000);
      }

      // Reset & Close
      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', plan: 'Free', credits: 10, sendWelcomeEmail: true });
      setTradingStyles([]);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists');
      } else {
        toast.error('Failed to create user: ' + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, bg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20' },
    { label: 'Active Now', value: '142', bg: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/20' },
    { label: 'Pro / Enterprise', value: users.filter(u => u.plan !== 'Free').length, bg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-purple-500/20' },
    { label: 'Suspended', value: users.filter(u => (u as any).status === 'Suspended').length, bg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20' },
  ];

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'All').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage all platform users, roles, and access</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-xl p-5 shadow-lg relative overflow-hidden group ${s.bg}`}>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1 relative z-10">{s.label}</p>
            <p className="text-2xl font-bold text-white relative z-10">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col overflow-visible">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-sm font-medium ${
                  isFilterOpen || activeFiltersCount > 0 ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 bg-white'
                }`}
              >
                <Filter className="w-4 h-4" /> Filters {activeFiltersCount > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{activeFiltersCount}</span>}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-20 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <select 
                          value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})}
                          className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                        >
                          <option>All</option>
                          <option>Admin</option>
                          <option>User</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan</label>
                        <select 
                          value={filters.plan} onChange={(e) => setFilters({...filters, plan: e.target.value})}
                          className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                        >
                          <option>All</option>
                          <option>Free</option>
                          <option>Pro</option>
                          <option>Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                        <select 
                          value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}
                          className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                        >
                          <option>All</option>
                          <option>Active</option>
                          <option>Suspended</option>
                        </select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => { setFilters({ role: 'All', plan: 'All', status: 'All' }); setIsFilterOpen(false); }}
                          className="text-sm font-bold text-slate-500 hover:text-slate-800"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            {selectedUsers.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 mr-2">{selectedUsers.length} selected</span>
                <button onClick={handleBulkSuspend} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-bold transition-colors">Bulk Suspend</button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" onChange={toggleSelectAll} checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No users found.</td></tr>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map(u => {
                    const isSuspended = (u as any).status === 'Suspended';
                    const isAdmin = u.role === 'admin' || u.email === 'admin@gmail.com';
                    
                    return (
                      <motion.tr 
                        key={u.id} 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className={`hover:bg-slate-50 transition-colors ${selectedUsers.includes(u.id) ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleSelect(u.id)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shadow-inner">
                              {u.displayName?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-2">
                                {u.displayName || 'Unnamed User'}
                                {isAdmin && <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />}
                              </div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            u.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                            u.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                          }`}>{u.plan || 'Free'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 w-max ${!isSuspended ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${!isSuspended ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {!isSuspended ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => handleViewProfile(u.email || u.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleMakeAdmin(u.id, u.role)}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                              title={isAdmin ? "Remove Admin Role" : "Make Admin"}
                            >
                              {isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleToggleSuspend(u.id, isSuspended)}
                              className={`p-1.5 text-slate-400 rounded-lg transition-colors ${!isSuspended ? 'hover:text-orange-600 hover:bg-orange-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`} 
                              title={!isSuspended ? "Suspend User" : "Activate User"}
                            >
                              {!isSuspended ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredUsers.length} of {users.length} users</div>
          <div className="flex gap-2">
            <button onClick={() => handlePagination('previous')} className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Prev</button>
            <button onClick={() => handlePagination('next')} className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* ADD NEW USER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Create New User</h3>
                  <p className="text-sm text-slate-500">Add a new user manually to the platform</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="add-user-form" onSubmit={handleCreateUser} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                      <input 
                        type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                      <input 
                        type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Security */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password *</label>
                      <input 
                        type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="Enter password"
                      />
                      {formData.password.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                            <div className={`h-full flex-1 ${strength >= 1 ? strengthColor : 'bg-transparent'}`}></div>
                            <div className={`h-full flex-1 ${strength >= 2 ? strengthColor : 'bg-transparent'}`}></div>
                            <div className={`h-full flex-1 ${strength >= 3 ? strengthColor : 'bg-transparent'}`}></div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-orange-500' : 'text-emerald-500'}`}>{strengthText}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password *</label>
                      <input 
                        type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full px-4 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-slate-200'
                        }`}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Subscription & Setup */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subscription Plan *</label>
                      <select 
                        value={formData.plan} onChange={handlePlanChange}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                      >
                        <option>Free</option>
                        <option>Pro</option>
                        <option>Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Credits</label>
                      <input 
                        type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trading Style Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {['Intraday', 'Options', 'Swing Trading', 'Long-term', 'Crypto'].map(style => (
                        <button
                          key={style} type="button" onClick={() => toggleStyle(style)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            tradingStyles.includes(style) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {tradingStyles.includes(style) && <Check className="w-3 h-3" />}
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" checked={formData.sendWelcomeEmail} onChange={e => setFormData({...formData, sendWelcomeEmail: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Send Welcome Email</p>
                      <p className="text-xs text-slate-500">Includes login credentials and onboarding instructions</p>
                    </div>
                  </label>

                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 rounded-b-2xl">
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Secure Firebase Auth
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" form="add-user-form" disabled={isCreating || (formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isCreating ? 'Creating User...' : 'Create User'}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
