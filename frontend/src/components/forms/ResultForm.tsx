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
  year: z.number().int().min(1).max(4), // Add year field
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
  
  // Updated semester options with year-based structure
  const yearOptions = [1, 2, 3, 4];
  const semesterOptions = ['Semester 1', 'Semester 2'];

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
      year: initialData.year || 1,
      semester: initialData.semester,
    } : {
      midtermScore: 0,
      finalScore: 0,
      year: 1,
      semester: 'Semester 1',
    },
  });

  const watchStudentId = watch('studentId');
  const watchCourseId = watch('courseId');
  const watchYear = watch('year');
  const watchSemester = watch('semester');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);
  useEffect(() => {
    if (watchCourseId) {
      fetchStudents();
    }
  }, [watchCourseId]);

  useEffect(() => {
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        courseId: initialData.courseId,
        midtermScore: initialData.midtermScore,
        finalScore: initialData.finalScore,
        year: initialData.year || 1,
        semester: initialData.semester || 'Semester 1',
      });
    }
  }, [initialData, reset]);

  const fetchStudents = async () => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (currentUser?.role === 'INSTRUCTOR' && watchCourseId) {
        // Fetch only students enrolled in the selected course
        const response = await apiClient.get(`/courses/${watchCourseId}/students`);
        setStudents(response.data || []);
      } else {
        // Admin can see all students
        const response = await apiClient.get('/students');
        setStudents(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/courses');
      let courses = response.data || [];
      
      // If user is instructor, filter to only their courses
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'INSTRUCTOR') {
        courses = courses.filter((course: any) => 
          course.instructorId === currentUser.id
        );
      }
      
      setCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // ADD THE MISSING onSubmit FUNCTION
  const onSubmit = async (data: ResultFormData) => {
    setIsLoading(true);
    try {
      console.log('Submitting result data:', data);
      
      if (initialData?.id) {
        // Update existing result
        await apiClient.put(`/results/${initialData.id}`, data);
      } else {
        // Create new result
        await apiClient.post('/results', data);
      }
      
      console.log('Result saved successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving result:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to save result';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      alert(errorMessage);
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

      {/* Add Year and Semester Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Academic Year</Label>
          <Select 
            value={watchYear?.toString()} 
            onValueChange={(value) => setValue('year', parseInt(value))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select 
            value={watchSemester || "Semester 1"} 
            onValueChange={(value) => setValue('semester', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesterOptions.map((sem) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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