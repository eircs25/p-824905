
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Establishment = {
  id: string;
  name: string;
  building_permit_no: string;
  status: 'active' | 'inactive';
  certificate_expiry_date: string;
  last_certificate_date: string;
};

const Dashboard: React.FC = () => {
  const { profile, loading, signOut } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loadingEstablishments, setLoadingEstablishments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'establishment_owner' || profile.status !== 'approved')) {
      navigate('/login');
    }
  }, [profile, loading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchEstablishments();
    }
  }, [profile]);

  const fetchEstablishments = async () => {
    if (!profile) return;
    
    setLoadingEstablishments(true);
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEstablishments(data || []);
    } catch (error: any) {
      console.error('Error fetching establishments:', error.message);
      toast.error('Failed to load establishments');
    } finally {
      setLoadingEstablishments(false);
    }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/45843aab2bdc4491756624ad4ebc4eedc6eb4350"
              className="w-[40px] h-[50px] mr-3"
              alt="Logo"
            />
            <div>
              <div className="text-[#F00] text-2xl font-semibold">
                <span>V-FIRE</span>
                <span className="text-black text-sm ml-[5px]">INSPECT</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{profile.first_name} {profile.last_name}</div>
              <div className="text-xs text-gray-500">Establishment Owner</div>
            </div>
            
            <button 
              onClick={signOut}
              className="text-white bg-[#FE623F] px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Establishments</h1>

        {loadingEstablishments ? (
          <div className="text-center py-4">Loading establishments...</div>
        ) : establishments.length === 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg p-8 text-center">
            <p className="text-gray-500">No establishments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {establishments.map((establishment) => (
              <div key={establishment.id} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{establishment.name}</h3>
                  <div className="mt-1 flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      establishment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {establishment.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Building Permit</dt>
                      <dd className="mt-1 text-sm text-gray-900">{establishment.building_permit_no}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Certificate Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(establishment.last_certificate_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(establishment.certificate_expiry_date).toLocaleDateString()}
                        {new Date(establishment.certificate_expiry_date) < new Date() && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#FE623F] hover:bg-red-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
