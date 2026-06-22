'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Edit, Trash2, Eye, ShieldAlert, 
  MoreVertical, Download, Plus, Shield, ShieldOff, UserX, UserCheck
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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

  const filteredUsers = users.filter(u => 
    (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      // using bio temporarily as status flag if no dedicated status field exists, or create a 'status' field.
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage all platform users, roles, and access</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 bg-white transition-colors flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" /> Filters
            </button>
            {selectedUsers.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 mr-2">{selectedUsers.length} selected</span>
                <button className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-bold transition-colors">Bulk Suspend</button>
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
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
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
            <button className="px-3 py-1 rounded border border-slate-200 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-slate-200 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
