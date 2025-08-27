'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api/client';
import { Search, Plus, Loader2 } from 'lucide-react';

interface Course {
  id: number;
  code: string;
  title: string;
  instructorName: string;
  credits: number;
  capacity: number;
  enrolledStudents: number;
}

interface AvailableCoursesProps {
  studentId: number;
  onCourseAction: () => void;
}

export default function AvailableCourses({
  studentId,
  onCourseAction,
}: AvailableCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/courses/available');
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      setActionLoading(courseId);
      await apiClient.post(`/students/enroll/${courseId}`);
      onCourseAction();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructorName && course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No available courses found
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-mono">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.instructorName || 'TBA'}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    <span className={course.enrolledStudents >= course.capacity ? 'text-red-500' : ''}>
                      {course.enrolledStudents}/{course.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                      disabled={actionLoading === course.id || course.enrolledStudents >= course.capacity}
                      className="w-full"
                    >
                      {actionLoading === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Enroll
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}