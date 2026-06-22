import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, Ban, Trash2, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MOCK_USERS = [
  { id: 'usr-001', name: 'John Doe', email: 'john@example.com', plan: 'Elite', joinDate: '2023-01-15', lastActive: '2 mins ago', strategies: 12, status: 'Active', isAdmin: false },
  { id: 'usr-002', name: 'Jane Smith', email: 'jane.smith@trading.io', plan: 'Pro', joinDate: '2023-04-22', lastActive: '1 hour ago', strategies: 5, status: 'Active', isAdmin: false },
  { id: 'usr-003', name: 'Mike Johnson', email: 'mikej@quant.net', plan: 'Free', joinDate: '2023-08-05', lastActive: '3 days ago', strategies: 1, status: 'Suspended', isAdmin: false },
  { id: 'usr-004', name: 'Sarah Williams', email: 'swilliams@gmail.com', plan: 'Elite', joinDate: '2022-11-10', lastActive: 'Just now', strategies: 28, status: 'Active', isAdmin: true },
  { id: 'usr-005', name: 'Alex Brown', email: 'alex.b@hotmail.com', plan: 'Pro', joinDate: '2023-09-01', lastActive: '5 hours ago', strategies: 3, status: 'Active', isAdmin: false },
  { id: 'usr-006', name: 'Emily Davis', email: 'edavis@invest.com', plan: 'Free', joinDate: '2023-10-12', lastActive: '1 week ago', strategies: 0, status: 'Active', isAdmin: false },
];

export function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const handleSuspend = (id: string) => {
    const confirm = window.confirm("Are you sure you want to suspend this user?");
    if (confirm) {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Suspended' } : u));
      toast.success("User suspended successfully");
    }
  };

  const handleMakeAdmin = (id: string) => {
    const confirm = window.confirm("Grant administrator privileges to this user?");
    if (confirm) {
      setUsers(users.map(u => u.id === id ? { ...u, isAdmin: true } : u));
      toast.success("User is now an Admin");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
          {selectedUsers.size > 0 && (
            <button className="px-4 py-2 bg-loss/10 text-loss rounded-xl text-sm font-semibold hover:bg-loss/20 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete ({selectedUsers.size})
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-border">
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          {user.isAdmin && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      user.plan === 'Elite' ? 'bg-purple-100 text-purple-700' :
                      user.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 font-medium">{user.strategies} Strategies</p>
                    <p className="text-xs text-slate-500">Last: {user.lastActive}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      user.status === 'Active' ? 'text-success' : 'text-loss'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-success' : 'bg-loss'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip" data-tip="View Profile">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors tooltip" data-tip="Send Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      
                      <div className="relative group/dropdown">
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10">
                          <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 font-medium">
                            <Edit2 className="w-4 h-4" /> Edit Details
                          </button>
                          {!user.isAdmin && (
                            <button 
                              onClick={() => handleMakeAdmin(user.id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-medium"
                            >
                              <ShieldCheck className="w-4 h-4" /> Make Admin
                            </button>
                          )}
                          {user.status === 'Active' ? (
                            <button 
                              onClick={() => handleSuspend(user.id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-loss hover:bg-loss/5 flex items-center gap-2 font-medium border-t border-border"
                            >
                              <Ban className="w-4 h-4" /> Suspend User
                            </button>
                          ) : (
                            <button 
                              onClick={() => setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Active' } : u))}
                              className="w-full text-left px-4 py-2.5 text-sm text-success hover:bg-success/5 flex items-center gap-2 font-medium border-t border-border"
                            >
                              <ShieldCheck className="w-4 h-4" /> Reactivate User
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500 font-medium">Showing <span className="font-bold text-slate-700">{filteredUsers.length}</span> of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-border bg-white rounded-lg text-sm font-semibold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-border bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
