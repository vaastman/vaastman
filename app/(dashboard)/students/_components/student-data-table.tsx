"use client";

import { IconDownload, IconSearch, IconX } from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadFilteredStudentsCsv } from "../lib/export-csv";
import type { FilteredStudentRow } from "../lib/zod-type/filter-students";
import { getStudentColumns } from "./student-columns";

interface StudentDataTableProps {
  students: FilteredStudentRow[];
  collegeName: string;
  domain?: string;
  sessionName?: string | null;
  onViewStudent: (student: FilteredStudentRow) => void;
}

export function StudentDataTable({
  students,
  collegeName,
  domain,
  sessionName,
  onViewStudent,
}: StudentDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.trim().toLowerCase();

    return students.filter((s) => {
      const aadharMatch = s.aadharNo?.toLowerCase().includes(q);
      const phoneMatch = s.phone?.toLowerCase().includes(q);
      const uniRollMatch = s.universityRoll?.toLowerCase().includes(q);
      const colRollMatch = s.collegeRoll?.toLowerCase().includes(q);
      const nameMatch = s.name?.toLowerCase().includes(q);
      const emailMatch = s.email?.toLowerCase().includes(q);

      return (
        aadharMatch ||
        phoneMatch ||
        uniRollMatch ||
        colRollMatch ||
        nameMatch ||
        emailMatch
      );
    });
  }, [students, searchQuery]);

  const columns = useMemo(
    () => getStudentColumns({ onViewStudent }),
    [onViewStudent],
  );

  const table = useReactTable({
    data: filteredStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Registered Students
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Search by Aadhar, phone number, university roll, or college roll.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadFilteredStudentsCsv({
                collegeName,
                domain,
                sessionName,
                students: filteredStudents,
              })
            }
            disabled={!filteredStudents.length}
            className="gap-1.5 text-xs"
          >
            <IconDownload className="size-5" />
            <span>Export CSV ({filteredStudents.length})</span>
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Aadhar, phone, university roll, college roll, name..."
              className="pl-9 pr-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="size-5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => onViewStudent(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? "No students match your search criteria."
                      : "No students registered under this selection."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing {filteredStudents.length} of {students.length} students
          </p>
          {searchQuery && (
            <p className="text-xs text-primary font-medium">
              Filter applied: &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
