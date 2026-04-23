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
  { name: "Available", value: 342, color: "hsl(174, 42%, 51%)" },
];

const barData = [
  { division: "Dhaka", beds: 520 },
  { division: "Chattogram", beds: 410 },
  { division: "Rajshahi", beds: 280 },
  { division: "Khulna", beds: 240 },
  { division: "Barishal", beds: 150 },
  { division: "Sylhet", beds: 200 },
  { division: "Rangpur", beds: 220 },
  { division: "Mymensingh", beds: 180 },
];

const hospitalReportData = [
  { hospital: "Dhaka Medical College", division: "Dhaka", district: "Dhaka", registered: 120, occupied: 98, available: 22 },
  { hospital: "Gazipur General Hospital", division: "Dhaka", district: "Gazipur", registered: 80, occupied: 55, available: 25 },
  { hospital: "Tangail Sadar Hospital", division: "Dhaka", district: "Tangail", registered: 60, occupied: 42, available: 18 },
  { hospital: "Mymensingh Medical College", division: "Mymensingh", district: "Mymensingh", registered: 100, occupied: 78, available: 22 },
  { hospital: "Narsingdi District Hospital", division: "Dhaka", district: "Narsingdi", registered: 45, occupied: 30, available: 15 },
  { hospital: "Manikganj General Hospital", division: "Dhaka", district: "Manikganj", registered: 35, occupied: 20, available: 15 },
];

const Reports = () => {
  const handleExportTotalReport = () => {
    const headers = ["SN", "Hospital Name", "Division", "District", "Total Registered NICU Beds", "Total Occupied Beds", "Available Beds"];
    const rows = hospitalReportData.map((r, i) => [
      i + 1, r.hospital, r.division, r.district, r.registered, r.occupied, r.available,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "NICU_Total_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Transaction & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Occupied vs Available NICU Beds</CardTitle>
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
            <CardTitle className="text-base">NICU Beds by Division</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 90%)" />
                <XAxis dataKey="division" tick={{ fontSize: 12 }} />
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
          <CardTitle className="text-base">Summary Reports</CardTitle>
          <Button onClick={handleExportTotalReport} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export Total Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Hospital Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Division</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">District</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Registered Beds</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Occupied Beds</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Available Beds</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalReportData.map((row, idx) => (
                    <tr key={idx} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{row.hospital}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.division}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.district}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{row.registered}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{row.occupied}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{row.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
