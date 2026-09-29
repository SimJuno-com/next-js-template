import { Skeleton } from "@next-js-template/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@next-js-template/ui/components/table";

import { CardFrame } from "@/components/card-frame";

export function OrdersTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <CardFrame>
      <Table aria-hidden="true" className="min-w-[640px] bg-background">
        <TableHeader className="bg-muted/30">
          <TableRow>
            {["Order", "Created (UTC)", "Status", "Amount", ""].map((label, index) => (
              <TableHead key={index} className="px-4 text-xs text-muted-foreground">
                <span className={label === "Amount" ? "block text-right" : undefined}>{label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-1 h-4 w-36" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-1 h-4 w-16" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="ml-auto h-5 w-16" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="size-9 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardFrame>
  );
}
