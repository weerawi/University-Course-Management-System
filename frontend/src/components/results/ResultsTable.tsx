'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface ResultsTableProps {
  results: Result[];
  canEdit: boolean;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export default function ResultsTable({
  results,
  canEdit,
  onDelete,
  onRefresh,
}: ResultsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof Result>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleSort = (field: keyof Result) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setEditDialogOpen(true);
  };

  const handleView = (id: number) => {
    router.push(`/results/${id}`);
  };

  const getGradeBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const SortIcon = ({ field }: { field: keyof Result }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline-block h-4 w-4 ml-1" /> 
      : <ChevronDown className="inline-block h-4 w-4 ml-1" />;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('studentName')}
              >
                Student <SortIcon field="studentName" />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('courseCode')}
              >
                Course <SortIcon field="courseCode" />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('semester')}
              >
                Semester <SortIcon field="semester" />
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer"
                onClick={() => handleSort('midtermScore')}
              >
                Midterm <SortIcon field="midtermScore" />
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer"
                onClick={() => handleSort('finalScore')}
              >
                Final <SortIcon field="finalScore" />
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer"
                onClick={() => handleSort('totalScore')}
              >
                Total <SortIcon field="totalScore" />
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer"
                onClick={() => handleSort('grade')}
              >
                Grade <SortIcon field="grade" />
              </TableHead>
              {canEdit && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 8 : 7} className="h-24 text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              sortedResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{result.courseTitle}</div>
                    <div className="text-xs text-muted-foreground">{result.courseCode}</div>
                  </TableCell>
                  <TableCell>{result.semester}</TableCell>
                  <TableCell className="text-center">{result.midtermScore.toFixed(1)}</TableCell>
                  <TableCell className="text-center">{result.finalScore.toFixed(1)}</TableCell>
                  <TableCell className="text-center font-medium">{result.totalScore.toFixed(1)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getGradeBadgeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(result.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(result)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(result.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
            <DialogDescription>
              Update student result information
            </DialogDescription>
          </DialogHeader>
          {editingResult && (
            <ResultForm 
              initialData={editingResult} 
              onSuccess={() => {
                setEditDialogOpen(false);
                onRefresh();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}