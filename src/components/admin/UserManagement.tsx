import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, Establishment } from '@/types/database';

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  establishments_count: number;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchEstablishments(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, status, role')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get the emails from auth.users for these profiles
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Get establishment counts for each user
      const { data: estCounts, error: estCountsError } = await supabase
        .from('establishments')
        .select('owner_id, count')
        .group('owner_id');
        
      if (estCountsError) throw estCountsError;
      
      // Combine the data
      const combinedUsers = profiles
        .filter(profile => profile.role === 'establishment_owner')
        .map(profile => {
          const authUser = users.users.find(user => user.id === profile.id);
          const estCount = estCounts.find(e => e.owner_id === profile.id);
          
          return {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: authUser?.email || 'Unknown',
            status: profile.status as 'pending' | 'approved' | 'rejected',
            establishments_count: estCount ? parseInt(estCount.count) : 0
          };
        });
      
      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstablishments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEstablishments(data || []);
    } catch (error: any) {
      console.error('Error fetching establishments:', error.message);
      toast.error('Failed to load establishments');
    }
  };

  const approveUser = async (userId: string) => {
    setProcessingUser(userId);
    try {
      // Generate a random temporary password
      const tempPassword = Math.random().toString(36).slice(-10);
      
      // Reset the user's password
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: tempPassword }
      );
      
      if (resetError) throw resetError;

      // Update user status in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Send email with temp password
      try {
        const response = await supabase.functions.invoke('send-approval-email', {
          body: { 
            userId, 
            action: 'approve', 
            tempPassword 
          }
        });
        
        if (response.error) {
          console.error('Error sending approval email:', response.error);
          toast.warning('User approved, but email notification failed');
        } else {
          toast.success('User approved and notification email sent!');
        }
      } catch (emailError: any) {
        console.error('Error calling send-approval-email function:', emailError);
        toast.warning('User approved, but email notification failed');
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: 'approved' } : user
        )
      );
    } catch (error: any) {
      console.error('Error approving user:', error.message);
      toast.error('Failed to approve user');
    } finally {
      setProcessingUser(null);
    }
  };

  const rejectUser = async (userId: string) => {
    setProcessingUser(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Send rejection email
      try {
        const response = await supabase.functions.invoke('send-approval-email', {
          body: { 
            userId, 
            action: 'reject' 
          }
        });
        
        if (response.error) {
          console.error('Error sending rejection email:', response.error);
          toast.warning('User rejected, but email notification failed');
        } else {
          toast.success('User rejected and notification email sent!');
        }
      } catch (emailError: any) {
        console.error('Error calling send-approval-email function:', emailError);
        toast.warning('User rejected, but email notification failed');
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: 'rejected' } : user
        )
      );
    } catch (error: any) {
      console.error('Error rejecting user:', error.message);
      toast.error('Failed to reject user');
    } finally {
      setProcessingUser(null);
    }
  };

  const filteredUsers = users
    .filter(user => {
      // Apply search filter
      const searchMatch = 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = 
        filter === 'all' || 
        (filter === 'pending' && user.status === 'pending') ||
        (filter === 'approved' && user.status === 'approved');
      
      return searchMatch && statusMatch;
    });

  return (
    <div className="p-4">
      <div className="bg-[#FF6347] text-white p-4 rounded-t-lg text-xl font-bold text-center mb-2">
        USER ACCOUNTS
      </div>

      <div className="bg-[#FEF2E7] rounded-b-lg p-4">
        {/* Filters and search */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex space-x-1 bg-white rounded-full p-1 mb-2 sm:mb-0">
            <button 
              className={`px-4 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-[#FF6347] text-white' : 'text-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              ALL
            </button>
            <button 
              className={`px-4 py-1 rounded-full text-sm ${filter === 'pending' ? 'bg-[#FF6347] text-white' : 'text-gray-700'}`}
              onClick={() => setFilter('pending')}
            >
              PENDING
            </button>
            <button 
              className={`px-4 py-1 rounded-full text-sm ${filter === 'approved' ? 'bg-[#FF6347] text-white' : 'text-gray-700'}`}
              onClick={() => setFilter('approved')}
            >
              APPROVED
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. of Establishments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedUser === user.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.establishments_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                approveUser(user.id);
                              }}
                              disabled={processingUser === user.id}
                              className="text-green-500 hover:text-green-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectUser(user.id);
                              }}
                              disabled={processingUser === user.id}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {selectedUser === user.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm">
                            <h3 className="font-medium text-gray-900 mb-2">Establishments</h3>
                            {establishments.length === 0 ? (
                              <p>No establishments found</p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Building Permit</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Certificate Expiry</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {establishments.map((est) => (
                                      <tr key={est.id} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-sm">{est.name}</td>
                                        <td className="px-4 py-2 text-sm">{est.building_permit_no}</td>
                                        <td className="px-4 py-2 text-sm">
                                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            est.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                          }`}>
                                            {est.status}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          {est.certificate_expiry ? new Date(est.certificate_expiry).toLocaleDateString() : 'N/A'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
