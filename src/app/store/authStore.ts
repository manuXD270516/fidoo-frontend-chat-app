import { create } from 'zustand';
import { auth } from '@/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type AuthState = {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  // Vincular automáticamente al iniciar
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    set({ user });
  });

  return {
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
      auth.signOut();
      set({ user: null });
    },
  };
});
