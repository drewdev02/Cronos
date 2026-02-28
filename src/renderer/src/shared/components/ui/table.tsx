import * as React from 'react';

export function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className="min-w-full divide-y divide-border" {...props}>{children}</table>;
}

export function TableHeader({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-muted" {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-border" {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="hover:bg-accent/40" {...props}>{children}</tr>;
}

export function TableHead({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props}>{children}</th>;
}

export function TableCell({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-2 whitespace-nowrap" {...props}>{children}</td>;
}
