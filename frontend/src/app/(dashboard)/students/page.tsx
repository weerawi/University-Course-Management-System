'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
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
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth.store';
import apiClient from '@/lib/api/client';
import { Plus, Search, Pencil, Trash, GraduationCap, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StudentForm from '@/components/forms/StudentForm';

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

export default function StudentsPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    router.push(`/students/${id}`);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-600 mt-1">
            Manage student records and enrollment
          </p>
        </div>

        {isAdmin && (
          <Dialog open={formOpen} onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setSelectedStudent(null);
              setIsEditing(false);
            }
          }}>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? 'Update student information in the system' 
                    : 'Create a new student record in the system'}
                </DialogDescription>
              </DialogHeader>
              <StudentForm
                initialData={selectedStudent}
                isEditing={isEditing}
                onSuccess={() => {
                  setFormOpen(false);
                  fetchStudents();
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
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{student.firstName} {student.lastName}</span>
                  <span className="text-sm bg-gray-100 rounded-full px-3 py-1">
                    {student.studentId}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {student.department}, Year {student.year}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {student.enrolledCourses} enrolled courses
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewDetails(student.id)}
                >
                  View Details
                </Button>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}