'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import apiClient from '@/lib/api/client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const createSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
});

const editSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.string().min(1, 'Role is required'),
  enabled: z.boolean(),
});

interface UserFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess: () => void;
}

export default function UserForm({ initialData, isEditing = false, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STUDENT',
      enabled: true,
    },
  });

  const watchRole = watch('role');

  useEffect(() => {
    if (isEditing && initialData) {
      setValue('firstName', initialData.firstName);
      setValue('lastName', initialData.lastName);
      setValue('email', initialData.email);
      setValue('role', initialData.role);
      setValue('enabled', initialData.enabled);
    }
  }, [isEditing, initialData, setValue]);

const onSubmit = async (data: any) => {
  setIsLoading(true);
  try {
    if (isEditing) {
      await apiClient.put(`/users/${initialData.id}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        enabled: data.enabled,
      });
    } else {
      // Make sure the request matches what the backend expects
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      
      console.log("Creating user with payload:", payload);
      await apiClient.post('/users', payload);
    }
    onSuccess();
  } catch (error: any) {
    console.error('Error saving user:', error.response?.data || error);
    alert(`Error: ${error.response?.data?.message || 'Failed to save user'}`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Tharindu"
            {...register('firstName')}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Vinod"
            {...register('lastName')}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message as string}</p>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tharindu@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message as string}</p>
            )}
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={watchRole}
          onValueChange={(value) => setValue('role', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrator</SelectItem>
            <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message as string}</p>
        )}
      </div>
      
      {isEditing && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enabled"
            checked={watch('enabled')}
            onCheckedChange={(checked) => setValue('enabled', !!checked)}
            disabled={isLoading}
          />
          <Label htmlFor="enabled">Account Active</Label>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Update User' : 'Create User'
          )}
        </Button>
      </div>
    </form>
  );
}