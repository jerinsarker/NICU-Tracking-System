import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Users, Plus, Pencil, Trash2, Send, MapPin, BedDouble, Search } from "lucide-react";
import { toast } from "sonner";
import { ListSearchBar, ListPagination, useListPagination } from "@/components/ListSearchPagination";
import {
  sharedHospitals,
  divisionDistricts,
  availableBedsCount,
  type Hospital,
} from "@/data/hospitalsData";

interface Patient {
  id: string;
  guardianName: string;
  mobile: string;
  relationship: string;
  status: "Admitted" | "Discharged" | "Referred";
  referredTo?: string;
}

const initialPatients: Patient[] = [
  { id: "p1", guardianName: "Kamal Hasan", mobile: "+880-1711-123456", relationship: "Father", status: "Admitted" },
  { id: "p2", guardianName: "Fatema Begum", mobile: "+880-1812-654321", relationship: "Mother", status: "Discharged" },
  { id: "p3", guardianName: "Rahim Uddin", mobile: "+880-1911-987654", relationship: "Father", status: "Referred", referredTo: "National NICU Center" },
];

const Consumers = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [registerModal, setRegisterModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  const [formGuardian, setFormGuardian] = useState("");
  const [formMobile, setFormMobile] = useState("+880");
  const [formRelationship, setFormRelationship] = useState("");

  // Refer flow state
  const [referPatient, setReferPatient] = useState<Patient | null>(null);
  const [referDivision, setReferDivision] = useState<string>("all");
  const [referDistrict, setReferDistrict] = useState<string>("all");
  const [referSearch, setReferSearch] = useState("");
  const [referConfirm, setReferConfirm] = useState<{ patient: Patient; hospital: Hospital } | null>(null);

  // Search & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filterFn = (p: Patient, q: string) =>
    p.guardianName.toLowerCase().includes(q) || p.mobile.toLowerCase().includes(q);

  const { paginatedData, totalPages, safePage, startIndex, filtered } = useListPagination(
    patients, searchQuery, filterFn, pageSize, currentPage
  );

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

  // ---- Refer flow ----
  const openReferModal = (p: Patient) => {
    setReferPatient(p);
    setReferDivision("all");
    setReferDistrict("all");
    setReferSearch("");
  };

  // Hospitals available for referral: NICU enabled AND at least 1 available bed
  const referableHospitals = useMemo(() => {
    return sharedHospitals.filter((h) => h.nicuAvailable && availableBedsCount(h) > 0);
  }, []);

  const filteredReferHospitals = useMemo(() => {
    const q = referSearch.trim().toLowerCase();
    return referableHospitals.filter((h) => {
      if (referDivision !== "all" && h.division !== referDivision) return false;
      if (referDistrict !== "all" && h.district !== referDistrict) return false;
      if (q && !h.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [referableHospitals, referDivision, referDistrict, referSearch]);

  const handleReferSelect = (h: Hospital) => {
    if (!referPatient) return;
    setReferConfirm({ patient: referPatient, hospital: h });
  };

  const confirmReferral = () => {
    if (!referConfirm) return;
    const { patient, hospital } = referConfirm;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id ? { ...p, status: "Referred", referredTo: hospital.name } : p
      )
    );
    toast.success(`${patient.guardianName}'s patient referred to ${hospital.name}`);
    setReferConfirm(null);
    setReferPatient(null);
  };

  const statusBadge = (s: Patient["status"]) => {
    if (s === "Admitted") return "bg-blue-100 text-blue-800 border-blue-300";
    if (s === "Discharged") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    return "bg-amber-100 text-amber-800 border-amber-300";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="page-header">Patient List</h1>
        </div>
        <Button onClick={openRegister} className="gap-2">
          <Plus className="h-4 w-4" /> New Patient Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <ListSearchBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              searchPlaceholder="Search by guardian name or phone..."
            />
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Guardian Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Mobile</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Relationship</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((p, idx) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{p.guardianName}</span>
                          {p.status === "Referred" && p.referredTo && (
                            <span className="text-xs text-amber-700 mt-0.5">→ Referred to {p.referredTo}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.mobile}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.relationship}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => openReferModal(p)}
                          >
                            <Send className="h-3.5 w-3.5" /> Refer
                          </Button>
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
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        {searchQuery ? "No patients found." : "No patients registered yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ListPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
            totalItems={filtered.length}
            startIndex={startIndex}
            endIndex={startIndex + pageSize}
          />
        </CardContent>
      </Card>

      {/* Register / Edit modal */}
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

      {/* Refer Modal */}
      <Dialog open={!!referPatient} onOpenChange={(open) => !open && setReferPatient(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Refer Patient {referPatient && `— ${referPatient.guardianName}`}
            </DialogTitle>
            <DialogDescription>
              Select a hospital below. Only hospitals with available NICU beds are shown.
            </DialogDescription>
          </DialogHeader>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Division</Label>
              <Select
                value={referDivision}
                onValueChange={(v) => { setReferDivision(v); setReferDistrict("all"); }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All divisions</SelectItem>
                  {Object.keys(divisionDistricts).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">District</Label>
              <Select
                value={referDistrict}
                onValueChange={setReferDistrict}
                disabled={referDivision === "all"}
              >
                <SelectTrigger><SelectValue placeholder="All districts" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {(divisionDistricts[referDivision] || []).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Search hospital</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Hospital name..."
                  value={referSearch}
                  onChange={(e) => setReferSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Hospital list */}
          <div className="mt-4 space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            {filteredReferHospitals.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground border rounded-lg border-dashed">
                No hospital with available NICU beds matches your filters.
              </div>
            )}
            {filteredReferHospitals.map((h) => {
              const avail = availableBedsCount(h);
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {h.district}, {h.division} · {h.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 gap-1">
                      <BedDouble className="h-3 w-3" />
                      {avail} available
                    </Badge>
                    <Button size="sm" className="gap-1.5" onClick={() => handleReferSelect(h)}>
                      <Send className="h-3.5 w-3.5" /> Refer Here
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Refer confirmation */}
      <AlertDialog open={!!referConfirm} onOpenChange={(open) => !open && setReferConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Referral</AlertDialogTitle>
            <AlertDialogDescription>
              {referConfirm && (
                <>
                  Are you sure you want to refer{" "}
                  <span className="font-semibold text-foreground">{referConfirm.patient.guardianName}</span>'s patient to{" "}
                  <span className="font-semibold text-foreground">{referConfirm.hospital.name}</span>{" "}
                  ({referConfirm.hospital.district}, {referConfirm.hospital.division})?
                  <br />
                  <span className="text-xs mt-2 block">The patient status will be updated to "Referred" and the hospital will be notified.</span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReferral}>Confirm Refer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
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
