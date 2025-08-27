'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api/client';
import { Trash, Loader2 } from 'lucide-react';

interface Course {
  id: number;
  code: string;
  title: string;
  instructorName: string;
  credits: number;
}

interface EnrollmentTableProps {
  courses: Course[];
  studentId: number;
  onCourseAction: () => void;
  isStudentProfile: boolean;
}

export default function EnrollmentTable({
  courses,
  studentId,
  onCourseAction,
  isStudentProfile,
}: EnrollmentTableProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleDropCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    
    try {
      setLoading(courseId);
      await apiClient.delete(`/students/drop/${courseId}`);
      onCourseAction();
    } catch (error) {
      console.error('Error dropping course:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead className="text-right">Credits</TableHead>
            {isStudentProfile && <TableHead className="w-[100px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isStudentProfile ? 5 : 4} className="text-center py-6 text-gray-500">
                No courses enrolled
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-mono">{course.code}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.instructorName || 'TBA'}</TableCell>
                <TableCell className="text-right">{course.credits}</TableCell>
                {isStudentProfile && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDropCourse(course.id)}
                      disabled={loading === course.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      {loading === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}