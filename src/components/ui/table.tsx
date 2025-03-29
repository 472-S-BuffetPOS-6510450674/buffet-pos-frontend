import * as React from "react";

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full border-collapse border border-gray-300">{children}</table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100">{children}</thead>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="flex justify-around border-b border-gray-300">{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="p-2 text-left font-semibold">{children}</th>
);

const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-2">{children}</td>
);

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };
