import { IconEyeFilled, IconUserFilled } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CollegeItem = {
  id: string;
  name: string;
  code: string | null;
  sessions: {
    id: string;
    name: string;
    fees: string;
    _count?: {
      candidateEducations: number;
    };
  }[];
  _count?: {
    candidateEducations: number;
  };
};

export function CollegeListSection({ colleges }: { colleges: CollegeItem[] }) {
  if (!colleges.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No colleges found</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Add college information to see details here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {colleges.map((college) => {
        const totalStudents =
          college._count?.candidateEducations ??
          college.sessions.reduce(
            (acc, s) => acc + (s._count?.candidateEducations ?? 0),
            0,
          );

        return (
          <Card key={college.id} className="h-full justify-between">
            <CardHeader className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2">
                  {college.name} {college.code ? `[${college.code}]` : ""}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="shrink-0 gap-1 font-normal"
                  title="Total registered students"
                >
                  <IconUserFilled className="size-5" />
                  <span>{totalStudents}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Total Registered:{" "}
                <span className="font-medium text-foreground">
                  {totalStudents}
                </span>{" "}
                {totalStudents === 1 ? "student" : "students"}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Session & associated fee
                </p>
                {college.sessions.length ? (
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-1.5 text-sm">
                    <p className="font-medium text-muted-foreground">Session</p>
                    <p className="text-right font-medium text-muted-foreground">
                      Students
                    </p>
                    <p className="text-right font-medium text-muted-foreground">
                      Fee
                    </p>
                    {college.sessions.map((session) => {
                      const sessionStudents =
                        session._count?.candidateEducations ?? 0;
                      return (
                        <div key={session.id} className="contents">
                          <p className="truncate font-medium">{session.name}</p>
                          <p className="text-right font-medium tabular-nums text-muted-foreground">
                            {sessionStudents}
                          </p>
                          <p className="text-right tabular-nums">
                            {session.fees}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm">-</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t">
              <Button
                variant="link"
                className="px-0 text-muted-foreground"
                asChild
              >
                <Link href={`/dashboard/registered-students/${college.id}`}>
                  <IconEyeFilled className="size-5" />
                  View registered students ({totalStudents})
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
