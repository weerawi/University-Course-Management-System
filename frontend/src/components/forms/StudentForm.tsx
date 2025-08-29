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

const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.number().int().min(1).max(4),
  userId: z.number().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess: () => void;
}

export default function StudentForm({ initialData, isEditing = false, onSuccess }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: '',
      department: '',
      year: 1,
      userId: undefined,
    },
  });

  useEffect(() => {
    fetchUsers();
    
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        department: initialData.department,
        year: initialData.year,
        userId: initialData.userId,
      });
    }
  }, [initialData, reset]);

  const fetchUsers = async () => {
    try {
      // Fetch users who don't already have a student profile
      const response = await apiClient.get('/users?role=STUDENT&unassigned=true');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && initialData?.id) {
        await apiClient.put(`/students/${initialData.id}`, data);
      } else {
        await apiClient.post('/students', data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          placeholder="e.g., CS2021001"
          {...register('studentId')}
          disabled={isLoading || isEditing} // Student ID shouldn't be editable once created
        />
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          placeholder="e.g., Computer Science"
          {...register('department')}
          disabled={isLoading}
        />
        {errors.department && (
          <p className="text-sm text-red-500">{errors.department.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          {...register('year', { valueAsNumber: true })}
          disabled={isLoading}
          min={1}
          max={4}
        />
        {errors.year && (
          <p className="text-sm text-red-500">{errors.year.message}</p>
        )}
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="userId">Assign User</Label>
          <Select 
            onValueChange={(value) => setValue('userId', Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName} ({user.email})
                </SelectItem>
              ))}
              {users.length === 0 && (
                <SelectItem value="none" disabled>
                  No available users
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select an existing user to assign to this student profile
          </p>
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