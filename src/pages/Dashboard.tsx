import { useNavigate } from "react-router-dom";
import { Building2, BedDouble, Ambulance, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Registered Hospitals",
    icon: Building2,
    value: "124",
    sub: "With NICU: 87 | Without NICU: 37",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Total NICU Beds",
    icon: BedDouble,
    value: "1,240",
    sub: "Available: 342 | Occupied: 898",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Total Ambulances",
    icon: Ambulance,
    value: "256",
    sub: "Active: 198 | Inactive: 58",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Total Patient",
    icon: Users,
    value: "3,892",
    sub: "",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="page-header">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.title} className="dashlet-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm font-medium text-foreground/80 mt-1">{s.title}</p>
            {s.sub && (
              <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-md px-2 py-1">
                {s.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <p className="section-label mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/hospitals")} className="gap-2">
            <Plus className="h-4 w-4" /> Add New Hospital
          </Button>
          <Button onClick={() => navigate("/ambulances")} variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
            <Plus className="h-4 w-4" /> Add New Ambulance
          </Button>
          <Button onClick={() => navigate("/consumers")} variant="outline" className="gap-2 border-secondary/30 text-secondary hover:bg-secondary/5">
            <Plus className="h-4 w-4" /> Add New Consumer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
