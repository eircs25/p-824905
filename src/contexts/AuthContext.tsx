
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  role: 'admin' | 'establishment_owner' | 'fire_inspector';
  status: 'pending' | 'approved' | 'rejected';
  is_first_login: boolean;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (userData: any) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  loadingProfile: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Redirect based on auth events
      if (event === 'SIGNED_IN') {
        await fetchUserProfile(session?.user?.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch user profile whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  const fetchUserProfile = async (userId?: string) => {
    if (!userId) return;
    
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      
      // Handle routing based on user role and status
      if (data) {
        if (data.status === 'approved') {
          // Direct to appropriate dashboard based on role
          if (data.role === 'admin') {
            navigate('/admin');
          } else if (data.role === 'establishment_owner') {
            navigate('/dashboard');
          }
          
          // Check if first login to prompt password change
          if (data.is_first_login) {
            navigate('/reset-password');
          }
        } else if (data.status === 'pending') {
          toast.info('Your account is pending approval.');
          navigate('/pending');
        } else if (data.status === 'rejected') {
          toast.error('Your account has been rejected.');
          await signOut();
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      toast.error('Failed to load user profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: 'temporary', // Will be changed by admin later
        options: {
          data: {
            first_name: userData.firstName,
            middle_name: userData.middleName,
            last_name: userData.lastName,
            role: 'establishment_owner',
          },
        },
      });

      if (error) throw error;
      
      // Handle establishments
      if (data.user) {
        for (const establishment of userData.establishments) {
          const { error: estError } = await supabase
            .from('establishments')
            .insert({
              owner_id: data.user.id,
              name: establishment.name,
              building_permit_no: establishment.buildingPermitNo,
            });
          
          if (estError) throw estError;
        }
      }

      return data;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast.error(error.message || 'Failed to reset password');
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      if (profile && profile.is_first_login) {
        // Update first login flag
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_first_login: false })
          .eq('id', user?.id);
        
        if (updateError) throw updateError;
        
        // Update local profile
        setProfile({
          ...profile,
          is_first_login: false
        });
      }
      
      toast.success('Password updated successfully');
      
      // Redirect based on role
      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      toast.error(error.message || 'Failed to update password');
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    loadingProfile,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
