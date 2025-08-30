// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import apiClient from '@/lib/api/client';
// import { useAuthStore } from '@/lib/store/auth.store';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const login = useAuthStore((state) => state.login);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   // const onSubmit = async (data: LoginFormData) => {
//   //   setIsLoading(true);
//   //   setError('');

//   //   try {
//   //     const response = await apiClient.post('/auth/login', data);
//   //     const { token, ...user } = response.data;
      
//   //     login(user, token);
      
//   //     // Redirect based on role
//   //     switch (user.role) {
//   //       case 'ADMIN':
//   //         router.push('/dashboard');
//   //         break;
//   //       case 'INSTRUCTOR':
//   //         router.push('/dashboard');
//   //         break;
//   //       case 'STUDENT':
//   //         router.push('/dashboard');
//   //         break;
//   //       default:
//   //         router.push('/');
//   //     }
//   //   } catch (err: any) {
//   //     setError(err.response?.data?.error || 'Invalid credentials');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
// const onSubmit = async (data: LoginFormData) => {
//   setIsLoading(true);
//   setError('');

//   try {
//     const response = await apiClient.post('/auth/login', data);
    
//     // Extract data including the ID
//     const { token, id, email, firstName, lastName, role } = response.data;
    
//     // Create user object with actual ID from backend
//     const user = {
//       id,           // Now using real ID from backend
//       email,
//       firstName,
//       lastName,
//       role: role.toString(),
//     };
    
//     // Correct parameter order: (token, user)
//     login(token, user);
    
//     router.push('/dashboard');
    
//   } catch (err: any) {
//     console.error('Login error:', err.response?.data);
//     setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
//   } finally {
//     setIsLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="john@university.edu"
//                 {...register('email')}
//                 disabled={isLoading}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 {...register('password')}
//                 disabled={isLoading}
//               />
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2">
//           <div className="text-sm text-center text-gray-600">
//             Don't have an account?{' '}
//             <Link href="/register" className="text-blue-600 hover:underline">
//               Sign up
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email: data.email, password: '***' });
      
      const response = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      console.log('Login response:', response.data);
      
      // Extract data from backend response
      const { token, id, email, firstName, lastName, role } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      if (!id || !email || !firstName || !lastName || !role) {
        throw new Error('Incomplete user data received from server');
      }
      
      // Create user object
      const user = {
        id: Number(id),
        email,
        firstName,
        lastName,
        role: role.toString(),
      };
      
      console.log('User object created:', user);
      console.log('Token:', token.substring(0, 20) + '...');
      
      // Call login with correct parameter order: (token, user)
      login(token, user);
      
      console.log('Login successful, redirecting to dashboard...');
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please contact administrator.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@university.edu"
                autoComplete="email"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          {/* Test Credentials */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium mb-1">Admin Login:</p>
          <p>Email: admin@university.edu</p>
          <p>Password: admin123</p>
        </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}