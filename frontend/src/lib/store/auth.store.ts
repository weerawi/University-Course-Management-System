// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (user: User, token: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       login: (user, token) => set({ user, token, isAuthenticated: true }),
//       logout: () => set({ user: null, token: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserInfo: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
       
      login: (token: string, user: User) => {
        localStorage.setItem('token', token);
        set({ token, user, isLoggedIn: true });
      },
      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        set({ token: null, user: null, isLoggedIn: false });
        // Redirect to login page
        window.location.href = '/login';
      },
      updateUserInfo: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);