'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth.store';
import apiClient from '@/lib/api/client';
import { Plus, Search, Users, Clock, BookOpen } from 'lucide-react';
import CourseForm from '@/components/forms/CourseForm';

interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  credits: number;
  capacity: number;
  enrolledStudents: number;
  instructorName: string;
}

export default function CoursesPage() {
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await apiClient.post(`/students/enroll/${courseId}`);
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage available courses
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to the system
                </DialogDescription>
              </DialogHeader>
              <CourseForm
                onSuccess={() => {
                  setDialogOpen(false);
                  fetchCourses();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {course.code}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{course.credits} Credits</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Instructor: {course.instructorName || 'TBA'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {course.enrolledStudents}/{course.capacity} Students
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {user?.role === 'STUDENT' && (
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(course.id)}
                    disabled={course.enrolledStudents >= course.capacity}
                  >
                    {course.enrolledStudents >= course.capacity
                      ? 'Course Full'
                      : 'Enroll Now'}
                  </Button>
                )}
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}