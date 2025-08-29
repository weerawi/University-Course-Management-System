'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const courseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Course title is required'),
  description: z.string().optional(),
  credits: z.number().min(1).max(6),
  capacity: z.number().min(1),
  instructorId: z.number().optional().nullable(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export default function CourseForm({ onSuccess, initialData }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData ? {
      code: initialData.code,
      title: initialData.title,
      description: initialData.description || '',
      credits: initialData.credits,
      capacity: initialData.capacity,
      instructorId: initialData.instructorId,
    } : {
      description: '',
      credits: 3,
      capacity: 30,
      instructorId: null,
    },
  });

  useEffect(() => {
    fetchInstructors();
    
    if (initialData) {
      reset({
        code: initialData.code,
        title: initialData.title,
        description: initialData.description || '',
        credits: initialData.credits,
        capacity: initialData.capacity,
        instructorId: initialData.instructorId,
      });
      setSelectedInstructorId(initialData.instructorId ? initialData.instructorId.toString() : '');
    }
  }, [initialData, reset]);

  const fetchInstructors = async () => {
    try {
      const response = await apiClient.get('/users?role=INSTRUCTOR');
      console.log('Instructors fetched:', response.data);
      setInstructors(response.data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        instructorId: selectedInstructorId && selectedInstructorId !== 'none' 
          ? parseInt(selectedInstructorId) 
          : null
      };

      console.log('Submitting course data:', payload);

      if (initialData?.id) {
        await apiClient.put(`/courses/${initialData.id}`, payload);
      } else {
        await apiClient.post('/courses', payload);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.message || 'Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorChange = (value: string) => {
    setSelectedInstructorId(value);
    setValue('instructorId', value === 'none' ? null : parseInt(value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Course Code</Label>
          <Input
            id="code"
            placeholder="CS101"
            {...register('code')}
            disabled={isLoading}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            {...register('credits', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.credits && (
            <p className="text-sm text-red-500">{errors.credits.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          placeholder="Introduction to Computer Science"
          {...register('title')}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Course description..."
          {...register('description')}
          disabled={isLoading}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.capacity && (
            <p className="text-sm text-red-500">{errors.capacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Select
            value={selectedInstructorId}
            onValueChange={handleInstructorChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id.toString()}>
                  {instructor.firstName} {instructor.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
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
            initialData?.id ? 'Update Course' : 'Save Course'
          )}
        </Button>
      </div>
    </form>
  );
}