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

const resultSchema = z.object({
  studentId: z.number().int().positive(),
  courseId: z.number().int().positive(),
  midtermScore: z.number().min(0).max(100),
  finalScore: z.number().min(0).max(100),
  semester: z.string().min(1, 'Semester is required'),
});

type ResultFormData = z.infer<typeof resultSchema>;

interface ResultFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export default function ResultForm({ initialData, onSuccess }: ResultFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<string[]>([
    'Fall 2023', 'Spring 2024', 'Summer 2024', 'Fall 2024'
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: initialData ? {
      studentId: initialData.studentId,
      courseId: initialData.courseId,
      midtermScore: initialData.midtermScore,
      finalScore: initialData.finalScore,
      semester: initialData.semester,
    } : {
      midtermScore: 0,
      finalScore: 0,
      semester: 'Fall 2024',
    },
  });

  const watchStudentId = watch('studentId');
  const watchCourseId = watch('courseId');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        courseId: initialData.courseId,
        midtermScore: initialData.midtermScore,
        finalScore: initialData.finalScore,
        semester: initialData.semester,
      });
    }
  }, [initialData, reset]);

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get('/students');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/courses');
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const onSubmit = async (data: ResultFormData) => {
    setIsLoading(true);
    try {
      if (initialData?.id) {
        await apiClient.put(`/results/${initialData.id}`, data);
      } else {
        await apiClient.post('/results', data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student</Label>
          <Select 
            value={watchStudentId?.toString()} 
            onValueChange={(value) => setValue('studentId', parseInt(value))}
            disabled={isLoading || !!initialData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.firstName} {student.lastName} ({student.studentId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-sm text-red-500">{errors.studentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseId">Course</Label>
          <Select 
            value={watchCourseId?.toString()} 
            onValueChange={(value) => setValue('courseId', parseInt(value))}
            disabled={isLoading || !!initialData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.code} - {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-500">{errors.courseId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="midtermScore">Midterm Score</Label>
          <Input
            id="midtermScore"
            type="number"
            step="0.1"
            min="0"
            max="100"
            {...register('midtermScore', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.midtermScore && (
            <p className="text-sm text-red-500">{errors.midtermScore.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalScore">Final Score</Label>
          <Input
            id="finalScore"
            type="number"
            step="0.1"
            min="0"
            max="100"
            {...register('finalScore', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.finalScore && (
            <p className="text-sm text-red-500">{errors.finalScore.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select 
            defaultValue={initialData?.semester || "Fall 2024"} 
            onValueChange={(value) => setValue('semester', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester && (
            <p className="text-sm text-red-500">{errors.semester.message}</p>
          )}
        </div>
      </div>

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
            initialData ? 'Update Result' : 'Create Result'
          )}
        </Button>
      </div>
    </form>
  );
}