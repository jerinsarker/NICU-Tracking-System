import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  guardianName: string;
  mobile: string;
  relationship: string;
  status: "Admitted" | "Discharged" | "Referred";
}

const initialPatients: Patient[] = [
  { id: "p1", guardianName: "Kamal Hasan", mobile: "+880-1711-123456", relationship: "Father", status: "Admitted" },
  { id: "p2", guardianName: "Fatema Begum", mobile: "+880-1812-654321", relationship: "Mother", status: "Discharged" },
  { id: "p3", guardianName: "Rahim Uddin", mobile: "+880-1911-987654", relationship: "Father", status: "Referred" },
];

const Consumers = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [registerModal, setRegisterModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  const [formGuardian, setFormGuardian] = useState("");
  const [formMobile, setFormMobile] = useState("+880");
  const [formRelationship, setFormRelationship] = useState("");

  const openRegister = () => {
    setEditingPatient(null);
    setFormGuardian("");
    setFormMobile("+880");
    setFormRelationship("");
    setRegisterModal(true);
  };

  const openEdit = (p: Patient) => {
    setEditingPatient(p);
    setFormGuardian(p.guardianName);
    setFormMobile(p.mobile);
    setFormRelationship(p.relationship);
    setRegisterModal(true);
  };

  const handleSubmit = () => {
    if (!formGuardian || !formMobile || !formRelationship) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editingPatient.id
            ? { ...p, guardianName: formGuardian, mobile: formMobile, relationship: formRelationship }
            : p
        )
      );
      toast.success("Patient updated successfully!");
    } else {
      const newPatient: Patient = {
        id: `p${Date.now()}`,
        guardianName: formGuardian,
        mobile: formMobile,
        relationship: formRelationship,
        status: "Admitted",
      };
      setPatients((prev) => [...prev, newPatient]);
      toast.success("Patient registered successfully!");
    }
    setRegisterModal(false);
  };

  const confirmDelete = () => {
    if (deletePatientId) {
      setPatients((prev) => prev.filter((p) => p.id !== deletePatientId));
      toast.success("Patient deleted.");
      setDeletePatientId(null);
    }
  };

  const statusColor = (s: string) => {
    if (s === "Admitted") return "default";
    if (s === "Discharged") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="page-header">Patient</h1>
        </div>
        <Button onClick={openRegister} className="gap-2">
          <Plus className="h-4 w-4" /> New Patient Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Guardian Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Mobile</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Relationship</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, idx) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.guardianName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.mobile}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.relationship}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={statusColor(p.status)} className="text-xs">{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeletePatientId(p.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No patients registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={registerModal} onOpenChange={setRegisterModal}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {editingPatient ? "Edit Patient" : "New Patient Register"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Parent / Guardian Name *</Label>
              <Input placeholder="Full name" value={formGuardian} onChange={(e) => setFormGuardian(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <Input placeholder="+880-1XXX-XXXXXX" value={formMobile} onChange={(e) => setFormMobile(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Relationship *</Label>
              <Select value={formRelationship} onValueChange={setFormRelationship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} className="w-full gap-2">
              <Users className="h-4 w-4" /> {editingPatient ? "Update Patient" : "Register Patient"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this patient? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Consumers;