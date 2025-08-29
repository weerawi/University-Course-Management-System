'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import apiClient from '@/lib/api/client';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const createStudentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.number().int().min(1).max(4),
  userId: z.number().optional(),
});

const editStudentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.number().int().min(1).max(4),
});

type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
type EditStudentFormValues = z.infer<typeof editStudentSchema>;

interface StudentFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess: () => void;
}

export default function StudentForm({ initialData, isEditing = false, onSuccess }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [useExistingUser, setUseExistingUser] = useState(false);
  const [error, setError] = useState('');

  const schema = isEditing ? editStudentSchema : createStudentSchema;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      year: 1,
      userId: undefined,
    },
  });

  const watchUserId = watch('userId');

  useEffect(() => {
    if (!isEditing) {
      fetchUnassignedUsers();
    }
    
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        department: initialData.department,
        year: initialData.year,
        userId: initialData.userId,
      });
    }
  }, [initialData, reset, isEditing]);

  const fetchUnassignedUsers = async () => {
    try {
      const response = await apiClient.get('/users?role=STUDENT&unassigned=true');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleUserSelection = (userId: string) => {
    if (userId === 'new') {
      setUseExistingUser(false);
      setValue('userId', undefined);
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('email', '');
    } else {
      setUseExistingUser(true);
      const selectedUser = users.find(u => u.id.toString() === userId);
      if (selectedUser) {
        setValue('userId', selectedUser.id);
        setValue('firstName', selectedUser.firstName);
        setValue('lastName', selectedUser.lastName);
        setValue('email', selectedUser.email);
      }
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      const payload: any = {
        studentId: data.studentId,
        department: data.department,
        year: data.year,
      };

      if (isEditing) {
        // For editing, include name fields
        payload.firstName = data.firstName;
        payload.lastName = data.lastName;
        await apiClient.put(`/students/${initialData.id}`, payload);
      } else {
        // For creation
        if (useExistingUser && data.userId) {
          payload.userId = data.userId;
        } else {
          payload.firstName = data.firstName;
          payload.lastName = data.lastName;
          payload.email = data.email;
        }
        await apiClient.post('/students', payload);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving student:', error);
      setError(error.response?.data?.message || 'Failed to save student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          placeholder="e.g., STU001"
          {...register('studentId')}
          disabled={isLoading || isEditing}
        />
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId.message}</p>
        )}
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label>User Account</Label>
          <Select onValueChange={handleUserSelection} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Create New User</SelectItem>
              {users.length > 0 && (
                <>
                  <SelectItem value="divider" disabled>
                    ──── Or Select Existing ────
                  </SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {(!useExistingUser || isEditing) && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
                disabled={isLoading || useExistingUser}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
                disabled={isLoading || useExistingUser}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                {...register('email')}
                disabled={isLoading || useExistingUser}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={watch('department')}
          onValueChange={(value) => setValue('department', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Information Technology">Information Technology</SelectItem>
            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-sm text-red-500">{errors.department.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Select
          value={watch('year')?.toString()}
          onValueChange={(value) => setValue('year', parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
          </SelectContent>
        </Select>
        {errors.year && (
          <p className="text-sm text-red-500">{errors.year.message}</p>
        )}
      </div>

      {!isEditing && !useExistingUser && (
        <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
          A new user account will be created with default password: <strong>student123</strong>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Update Student' : 'Create Student'
          )}
        </Button>
      </div>
    </form>
  );
}