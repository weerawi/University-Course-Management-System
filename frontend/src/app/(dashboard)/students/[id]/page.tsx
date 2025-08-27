'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Calendar,
  BookOpen,
  Pencil,
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import EnrollmentTable from '@/components/students/EnrollmentTable';

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: number;
  enrolledCourses: number;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchStudentData(params.id as string);
    }
  }, [params.id]);

  const fetchStudentData = async (id: string) => {
    try {
      setLoading(true);
      const [studentResponse, coursesResponse] = await Promise.all([
        apiClient.get(`/students/${id}`),
        apiClient.get(`/students/${id}/courses`),
      ]);
      setStudent(studentResponse.data);
      setCourses(coursesResponse.data || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStudentProfile = user?.role === 'STUDENT' && user?.id === student?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Student not found</h2>
        <p className="mt-2 text-gray-600">The student you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button className="mt-4" onClick={() => router.push('/students')}>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => router.push('/students')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{student.firstName} {student.lastName}</h1>
          <p className="text-gray-600">{student.studentId}</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => router.push(`/students/edit/${student.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Student
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Full Name</div>
              <div>{student.firstName} {student.lastName}</div>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <div>{student.email}</div>
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
              <div>{student.department}</div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <div>Year {student.year}</div>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
              <div>{student.enrolledCourses} Enrolled Courses</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>
              View and manage course enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="enrolled">
              <TabsList className="mb-4">
                <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                {isStudentProfile && (
                  <TabsTrigger value="available">Available Courses</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="enrolled">
                <EnrollmentTable 
                  courses={courses}
                  studentId={student.id}
                  onCourseAction={fetchStudentData.bind(null, params.id as string)}
                  isStudentProfile={isStudentProfile}
                />
              </TabsContent>
              {isStudentProfile && (
                <TabsContent value="available">
                  {/* Available Courses component would go here */}
                  <p>Available courses to enroll...</p>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}