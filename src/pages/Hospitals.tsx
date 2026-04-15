import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  QrCode,
  AlertTriangle,
  BedDouble,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { ListSearchBar, ListPagination, useListPagination } from "@/components/ListSearchPagination";

const divisionDistricts: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Kishoreganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Brahmanbaria", "Noakhali", "Lakshmipur", "Feni", "Chandpur", "Rangamati", "Khagrachari", "Bandarban"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Magura", "Kushtia", "Meherpur", "Chuadanga", "Jhenaidah"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokathi", "Barguna"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon", "Panchagarh"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

interface HospitalBed {
  id: string;
  label: string;
  status: "available" | "occupied";
}

interface Hospital {
  id: string;
  name: string;
  division: string;
  district: string;
  phone: string;
  nicuAvailable: boolean;
  beds: HospitalBed[];
}

const initialHospitals: Hospital[] = [
  {
    id: "h1",
    name: "Dhaka Medical College",
    division: "Dhaka",
    district: "Dhaka",
    phone: "+880-2-55165001",
    nicuAvailable: true,
    beds: [
      { id: "b1", label: "NICU-01", status: "occupied" },
      { id: "b2", label: "NICU-02", status: "available" },
      { id: "b3", label: "NICU-03", status: "available" },
    ],
  },
  {
    id: "h2",
    name: "National NICU Center",
    division: "Chattogram",
    district: "Chattogram",
    phone: "+880-31-619890",
    nicuAvailable: true,
    beds: [
      { id: "b4", label: "NICU-01", status: "available" },
      { id: "b5", label: "NICU-02", status: "occupied" },
    ],
  },
  {
    id: "h3",
    name: "Upazila Health Complex",
    division: "Dhaka",
    district: "Tangail",
    phone: "+880-921-62345",
    nicuAvailable: false,
    beds: [],
  },
];

const Hospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [registerModal, setRegisterModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [deleteHospitalId, setDeleteHospitalId] = useState<string | null>(null);

  // Search & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDivision, setFormDivision] = useState("");
  const [formDistrict, setFormDistrict] = useState("");
  const [formPhone, setFormPhone] = useState("+880");
  const [formNicu, setFormNicu] = useState("yes");
  const [formTotalBeds, setFormTotalBeds] = useState(1);

  // Bed management in edit mode
  const [newBedCount, setNewBedCount] = useState(1);
  const [deleteBedId, setDeleteBedId] = useState<string | null>(null);

  // Admission modal
  const [admissionModal, setAdmissionModal] = useState<{ hospitalId: string; bedLabel: string } | null>(null);
  const [babyName, setBabyName] = useState("");
  const [relation, setRelation] = useState("");
  const [contactName, setContactName] = useState("");
  const [admPhone, setAdmPhone] = useState("+880");

  const filterFn = (h: Hospital, q: string) => h.name.toLowerCase().includes(q);

  const { paginatedData, totalPages, safePage, startIndex, filtered } = useListPagination(
    hospitals, searchQuery, filterFn, pageSize, currentPage
  );

  const availableFormDistricts = formDivision ? divisionDistricts[formDivision] || [] : [];

  const openRegister = () => {
    setEditingHospital(null);
    setFormName("");
    setFormDivision("");
    setFormDistrict("");
    setFormPhone("+880");
    setFormNicu("yes");
    setFormTotalBeds(1);
    setRegisterModal(true);
  };

  const openEdit = (h: Hospital) => {
    setEditingHospital(h);
    setFormName(h.name);
    setFormDivision(h.division);
    setFormDistrict(h.district);
    setFormPhone(h.phone);
    setFormNicu(h.nicuAvailable ? "yes" : "no");
    setFormTotalBeds(h.beds.length || 1);
    setNewBedCount(1);
    setRegisterModal(true);
  };

  const handleSubmit = () => {
    if (!formName || !formDivision || !formDistrict || !formPhone) {
      toast.error("Please fill all required fields");
      return;
    }
    const isNicu = formNicu === "yes";

    if (editingHospital) {
      setHospitals((prev) =>
        prev.map((h) =>
          h.id === editingHospital.id
            ? { ...h, name: formName, division: formDivision, district: formDistrict, phone: formPhone, nicuAvailable: isNicu }
            : h
        )
      );
      toast.success("Hospital updated successfully!");
    } else {
      const beds: HospitalBed[] = isNicu
        ? Array.from({ length: formTotalBeds }, (_, i) => ({
            id: `b${Date.now()}-${i}`,
            label: `NICU-${String(i + 1).padStart(2, "0")}`,
            status: "available" as const,
          }))
        : [];
      const newHospital: Hospital = {
        id: `h${Date.now()}`,
        name: formName,
        division: formDivision,
        district: formDistrict,
        phone: formPhone,
        nicuAvailable: isNicu,
        beds,
      };
      setHospitals((prev) => [...prev, newHospital]);
      toast.success("Hospital registered successfully!");
    }
    setRegisterModal(false);
  };

  const confirmDelete = () => {
    if (deleteHospitalId) {
      setHospitals((prev) => prev.filter((h) => h.id !== deleteHospitalId));
      toast.success("Hospital deleted.");
      setDeleteHospitalId(null);
    }
  };

  const addBedsToHospital = (hospitalId: string, count: number) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const startIdx = h.beds.length + 1;
        const newBeds: HospitalBed[] = Array.from({ length: count }, (_, i) => ({
          id: `b${Date.now()}-${i}`,
          label: `NICU-${String(startIdx + i).padStart(2, "0")}`,
          status: "available" as const,
        }));
        return { ...h, beds: [...h.beds, ...newBeds] };
      })
    );
    toast.success(`${count} bed(s) added!`);
  };

  const confirmDeleteBed = () => {
    if (deleteBedId && editingHospital) {
      setHospitals((prev) =>
        prev.map((h) =>
          h.id === editingHospital.id
            ? { ...h, beds: h.beds.filter((b) => b.id !== deleteBedId) }
            : h
        )
      );
      setEditingHospital((prev) =>
        prev ? { ...prev, beds: prev.beds.filter((b) => b.id !== deleteBedId) } : null
      );
      toast.success("Bed removed.");
      setDeleteBedId(null);
    }
  };

  const handleConfirmAdmission = () => {
    if (admissionModal) {
      setHospitals((prev) =>
        prev.map((h) =>
          h.id === admissionModal.hospitalId
            ? {
                ...h,
                beds: h.beds.map((b) =>
                  b.label === admissionModal.bedLabel ? { ...b, status: "occupied" as const } : b
                ),
              }
            : h
        )
      );
      toast.success(`${admissionModal.bedLabel} is now occupied!`);
      setAdmissionModal(null);
      setBabyName("");
      setRelation("");
      setContactName("");
      setAdmPhone("+880");
    }
  };

  const liveEditingHospital = editingHospital
    ? hospitals.find((h) => h.id === editingHospital.id) ?? editingHospital
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-7 w-7 text-primary" />
          <h1 className="page-header">Hospitals</h1>
        </div>
        <Button onClick={openRegister} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Hospital Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <ListSearchBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              searchPlaceholder="Search by hospital name..."
            />
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Hospital Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Division</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">District</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Phone</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">NICU</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Beds</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((h, idx) => (
                    <tr key={h.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{h.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{h.division}</td>
                      <td className="px-4 py-3 text-muted-foreground">{h.district}</td>
                      <td className="px-4 py-3 text-muted-foreground">{h.phone}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={h.nicuAvailable ? "default" : "secondary"} className="text-xs">
                          {h.nicuAvailable ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {h.nicuAvailable ? (
                          <span className="text-sm font-semibold text-foreground">{h.beds.length}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(h)}>
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteHospitalId(h.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        {searchQuery ? "No hospitals found." : "No hospitals registered yet."}
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

      {/* Register / Edit Modal */}
      <Dialog open={registerModal} onOpenChange={setRegisterModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {editingHospital ? "Edit Hospital" : "Add New Hospital Register"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Hospital Name *</Label>
                <Input placeholder="e.g. City Hospital" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input placeholder="+880-XX-XXXX" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Division *</Label>
                <Select value={formDivision} onValueChange={(v) => { setFormDivision(v); setFormDistrict(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(divisionDistricts).map((div) => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District *</Label>
                <Select value={formDistrict} onValueChange={setFormDistrict} disabled={!formDivision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormDistricts.map((dist) => (
                      <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>NICU Available?</Label>
              <RadioGroup value={formNicu} onValueChange={setFormNicu} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="reg-nicu-yes" />
                  <Label htmlFor="reg-nicu-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="reg-nicu-no" />
                  <Label htmlFor="reg-nicu-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {formNicu === "yes" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/50 border border-border">
                {!editingHospital ? (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        Upload NICU Bed Pictures
                      </Label>
                      <div className="flex gap-3">
                        <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">Bed 1 Photo</div>
                        <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">Bed 2 Photo</div>
                      </div>
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <Label>Total NICU Beds</Label>
                      <Input type="number" min={1} value={formTotalBeds} onChange={(e) => setFormTotalBeds(Number(e.target.value))} />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-primary" />
                      Manage NICU Beds ({liveEditingHospital?.beds.length ?? 0} total)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {liveEditingHospital?.beds.map((bed) => (
                        <div key={bed.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-primary/70" />
                            <span className="text-xs font-semibold">{bed.label}</span>
                            <Badge variant={bed.status === "available" ? "default" : "secondary"} className="text-[10px] px-1.5">{bed.status}</Badge>
                          </div>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setDeleteBedId(bed.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="space-y-2">
                        <Label>Add Beds</Label>
                        <Input type="number" min={1} value={newBedCount} onChange={(e) => setNewBedCount(Number(e.target.value))} className="w-24" />
                      </div>
                      <Button variant="outline" className="gap-1" onClick={() => { if (editingHospital) addBedsToHospital(editingHospital.id, newBedCount); }}>
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {formNicu === "no" && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  This hospital will act as a <strong>Referral Point</strong> only. No QR codes or beds will be generated.
                </p>
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full h-11 text-base font-bold gap-2">
              {editingHospital ? (<><Pencil className="h-4 w-4" /> Update Hospital</>) : (<><Plus className="h-4 w-4" /> Register Hospital</>)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteHospitalId} onOpenChange={() => setDeleteHospitalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hospital?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently remove the hospital and all associated beds.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteBedId} onOpenChange={() => setDeleteBedId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bed?</AlertDialogTitle>
            <AlertDialogDescription>This bed will be permanently removed from the hospital.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBed} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!admissionModal} onOpenChange={() => setAdmissionModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Bed ID: {admissionModal?.bedLabel}{" "}
              <span className="text-success font-normal text-sm">(Ready for Admission)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label>Baby Name</Label>
              <div className="flex gap-2">
                <Input placeholder="Enter baby name (optional)" value={babyName} onChange={(e) => setBabyName(e.target.value)} className="flex-1" />
                <Button variant="secondary" className="font-semibold" onClick={() => setBabyName("")}>SKIP</Button>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">Guardian Info</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select value={relation} onValueChange={setRelation}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input placeholder="Full name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone No</Label>
                  <Input placeholder="+880-XXXX" value={admPhone} onChange={(e) => setAdmPhone(e.target.value)} />
                </div>
              </div>
            </div>
            <Button onClick={handleConfirmAdmission} className="w-full h-12 text-base font-bold gap-2">
              <BedDouble className="h-5 w-5" /> Confirm & Occupy Bed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hospitals;
