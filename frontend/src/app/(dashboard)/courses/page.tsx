'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth.store';
import apiClient from '@/lib/api/client';
import { Plus, Search, Users, Clock, BookOpen, Trash, Edit, Eye, Check } from 'lucide-react';
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
  instructorId?: number;
}

export default function CoursesPage() {
  const router = useRouter(); // Add router initialization
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (user?.role === 'STUDENT') {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const studentProfile = await apiClient.get('/students/me');
      if (studentProfile.data && studentProfile.data.id) {
        const coursesResponse = await apiClient.get(`/students/${studentProfile.data.id}/courses`);
        const enrolledIds = coursesResponse.data.map((course: any) => course.id);
        setEnrolledCourses(enrolledIds);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await apiClient.post(`/students/enroll/${courseId}`);
      alert('Successfully enrolled in course!');
      fetchCourses();
      fetchEnrolledCourses();
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to enroll in course';
      alert(errorMessage);
    }
  };

  const handleUnenroll = async (courseId: number) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    
    try {
      await apiClient.delete(`/students/drop/${courseId}`);
      alert('Successfully dropped the course!');
      fetchCourses();
      fetchEnrolledCourses();
    } catch (error: any) {
      console.error('Error dropping course:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to drop course';
      alert(errorMessage);
    }
  };
  
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedCourse) return;
    
    try {
      await apiClient.delete(`/courses/${selectedCourse.id}`);
      fetchCourses();
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Cannot delete course. Please remove all enrollments and results first.');
    }
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEnrolled = (courseId: number) => enrolledCourses.includes(courseId);

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
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setIsEditing(false);
              setSelectedCourse(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update course details' : 'Add a new course to the system'}
                </DialogDescription>
              </DialogHeader>
              <CourseForm
                onSuccess={() => {
                  setDialogOpen(false);
                  setIsEditing(false);
                  setSelectedCourse(null);
                  fetchCourses();
                }}
                initialData={selectedCourse}
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
                  {user?.role === 'STUDENT' && isEnrolled(course.id) && (
                    <div className="flex items-center text-sm text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      Enrolled
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {user?.role === 'STUDENT' && (
                  <div className="flex gap-2 w-full">
                    {isEnrolled(course.id) ? (
                      <>
                        <Button
                          className="flex-1"
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleUnenroll(course.id)}
                        >
                          Drop Course
                        </Button>
                      </>
                    ) : (
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
                  </div>
                )}
                
                {user?.role === 'INSTRUCTOR' && course.instructorId === user.id && (
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View My Course
                  </Button>
                )}
                
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(course)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}