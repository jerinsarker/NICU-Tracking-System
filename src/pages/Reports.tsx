import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const donutData = [
  { name: "Occupied", value: 898, color: "hsl(199, 89%, 38%)" },
  { name: "Vacant", value: 342, color: "hsl(174, 42%, 51%)" },
];

const barData = [
  { district: "Dhaka", beds: 320 },
  { district: "Gazipur", beds: 180 },
  { district: "Tangail", beds: 120 },
  { district: "Mymensingh", beds: 210 },
  { district: "Narsingdi", beds: 95 },
  { district: "Manikganj", beds: 75 },
];

const summaryData = [
  { metric: "Total Registered NICU Beds", value: 1240 },
  { metric: "Total Occupied", value: 898 },
  { metric: "Total Empty", value: 342 },
];

const Reports = () => {
  const handleExport = (metric: string, format: "csv" | "pdf") => {
    // Placeholder export
    const data = summaryData.find((r) => r.metric === metric);
    if (format === "csv") {
      const blob = new Blob([`Metric,Value\n${metric},${data?.value ?? ""}`], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${metric.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Transaction & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Occupied vs Vacant NICU Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">NICU Beds by District</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 90%)" />
                <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="beds" fill="hsl(199, 89%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Metric</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Value</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row) => (
                  <tr key={row.metric} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground">{row.metric}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{row.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 text-xs">
                            <Download className="h-3 w-3" /> Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleExport(row.metric, "csv")}>
                            Export as CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(row.metric, "pdf")}>
                            Export as PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
