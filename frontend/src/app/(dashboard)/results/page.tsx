'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/store/auth.store';
import apiClient from '@/lib/api/client';
import { Plus, Search, FileText } from 'lucide-react';
import ResultsTable from '@/components/results/ResultsTable';
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

export default function ResultsPage() {
  const user = useAuthStore((state) => state.user);
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      let response;

      if (user?.role === 'ADMIN') {
        response = await apiClient.get('/results');
      } else if (user?.role === 'INSTRUCTOR') {
        // Assuming there's an endpoint for instructor results
        response = await apiClient.get('/results/instructor');
      } else if (user?.role === 'STUDENT') {
        // For students, fetch only their results
        response = await apiClient.get(`/results/student/${user.id}`);
      }

      setResults(response?.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultCreated = () => {
    setDialogOpen(false);
    fetchResults();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await apiClient.delete(`/results/${id}`);
        fetchResults();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const filteredResults = results.filter((result) => {
    const searchText = searchTerm.toLowerCase();
    return (
      result.studentName.toLowerCase().includes(searchText) ||
      result.courseCode.toLowerCase().includes(searchText) ||
      result.courseTitle.toLowerCase().includes(searchText) ||
      result.grade.toLowerCase().includes(searchText) ||
      result.semester.toLowerCase().includes(searchText)
    );
  });

  const semesters = [...new Set(results.map(result => result.semester))];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Academic Results</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'STUDENT' 
              ? 'View your academic performance' 
              : 'Manage and view student results'}
          </p>
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Result</DialogTitle>
                <DialogDescription>
                  Enter student performance details for a course
                </DialogDescription>
              </DialogHeader>
              <ResultForm onSuccess={handleResultCreated} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search results..."
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
        <>
          {user?.role !== 'STUDENT' && semesters.length > 0 && (
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                {semesters.map(sem => (
                  <TabsTrigger key={sem} value={sem}>{sem}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                <ResultsTable 
                  results={filteredResults}
                  canEdit={user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR'} 
                  onDelete={handleDelete}
                  onRefresh={fetchResults}
                />
              </TabsContent>
              
              {semesters.map(sem => (
                <TabsContent key={sem} value={sem}>
                  <ResultsTable 
                    results={filteredResults.filter(r => r.semester === sem)}
                    canEdit={user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR'} 
                    onDelete={handleDelete}
                    onRefresh={fetchResults}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
          
          {user?.role === 'STUDENT' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Results Summary</CardTitle>
                <CardDescription>
                  Overview of your academic performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">Average Grade</div>
                    <div className="text-2xl font-bold mt-1">
                      {results.length > 0 
                        ? (results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(1)
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 font-medium">Best Grade</div>
                    <div className="text-2xl font-bold mt-1">
                      {results.length > 0 
                        ? results.sort((a, b) => b.totalScore - a.totalScore)[0].grade
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-purple-600 font-medium">Total Courses</div>
                    <div className="text-2xl font-bold mt-1">{results.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {(!semesters.length || user?.role === 'STUDENT') && (
            <ResultsTable 
              results={filteredResults}
              canEdit={user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR'} 
              onDelete={handleDelete}
              onRefresh={fetchResults}
            />
          )}
          
          {results.length === 0 && (
            <div className="text-center py-16 border rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No results found</h3>
              <p className="mt-2 text-gray-500">
                {user?.role === 'STUDENT'
                  ? 'You don\'t have any results recorded yet.'
                  : 'Start by adding results for students.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}