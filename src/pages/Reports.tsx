import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Reports & Analytics</h1>

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Summary Metrics</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Download className="h-3 w-3" /> CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Download className="h-3 w-3" /> PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Metric</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row) => (
                  <tr key={row.metric} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground">{row.metric}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{row.value.toLocaleString()}</td>
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
