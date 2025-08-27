'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Book,
  GraduationCap,
  Calendar,
  BarChart3
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ResultForm from '@/components/forms/ResultForm';

interface Result {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
  grade: string;
  semester: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [params.id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/results/${params.id}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      await apiClient.delete(`/results/${params.id}`);
      router.push('/results');
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade?.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade?.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade?.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Result not found</h2>
        <p className="mt-2 text-gray-600">The result you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button className="mt-4" onClick={() => router.push('/results')}>
          Back to Results
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
          onClick={() => router.push('/results')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Result Details</h1>
          <p className="text-gray-600">{result.courseCode} - {result.semester}</p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Student details for this result
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">{result.studentName}</div>
                <div className="text-sm text-muted-foreground">Student</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">{result.courseTitle}</div>
                <div className="text-sm text-muted-foreground">{result.courseCode}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">{result.semester}</div>
                <div className="text-sm text-muted-foreground">Academic Period</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Breakdown of scores and final grade
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Midterm (40%)</div>
                <div className="text-2xl font-bold">{result.midtermScore.toFixed(1)}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Final (60%)</div>
                <div className="text-2xl font-bold">{result.finalScore.toFixed(1)}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total</div>
                <div className="text-2xl font-bold">{result.totalScore.toFixed(1)}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Final Grade</div>
                <Badge className={`text-lg px-4 py-2 ${getGradeBadgeColor(result.grade)}`}>
                  {result.grade}
                </Badge>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm font-medium mb-4">Score Distribution</div>
              <div className="h-10 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${result.totalScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
            <DialogDescription>
              Update student result information
            </DialogDescription>
          </DialogHeader>
          <ResultForm 
            initialData={result} 
            onSuccess={() => {
              setEditDialogOpen(false);
              fetchResult();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}