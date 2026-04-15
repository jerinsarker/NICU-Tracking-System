import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Ambulance, Plus, Pencil, Trash2, Upload } from "lucide-react";
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

interface AmbulanceRecord {
  id: string;
  ownershipType: "individual" | "agency";
  ownerName: string;
  contactNumber: string;
  regNumber: string;
  driverName: string;
  driverContact: string;
  vehicleName: string;
  nicuFacility: boolean;
  division: string;
  district: string;
  status: "Active" | "Inactive";
}

const initialAmbulances: AmbulanceRecord[] = [
  { id: "a1", ownershipType: "individual", ownerName: "Mizanur Rahman", contactNumber: "+880-1711-555001", regNumber: "Dhaka Metro-Cha-11-2233", driverName: "Rafiq Islam", driverContact: "+880-1811-555002", vehicleName: "Toyota Hiace", nicuFacility: true, division: "Dhaka", district: "Dhaka", status: "Active" },
  { id: "a2", ownershipType: "agency", ownerName: "LifeLine Ambulance Service", contactNumber: "+880-1911-555003", regNumber: "CTG Metro-Ka-22-4455", driverName: "Abdul Karim", driverContact: "+880-1611-555004", vehicleName: "Ford Transit", nicuFacility: false, division: "Chattogram", district: "Chattogram", status: "Active" },
  { id: "a3", ownershipType: "individual", ownerName: "Jamal Uddin", contactNumber: "+880-1511-555005", regNumber: "Raj-Ga-33-6677", driverName: "Saiful Alam", driverContact: "+880-1411-555006", vehicleName: "Mitsubishi L300", nicuFacility: false, division: "Rajshahi", district: "Rajshahi", status: "Inactive" },
];

const Ambulances = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceRecord[]>(initialAmbulances);
  const [registerModal, setRegisterModal] = useState(false);
  const [editingAmb, setEditingAmb] = useState<AmbulanceRecord | null>(null);
  const [deleteAmbId, setDeleteAmbId] = useState<string | null>(null);

  const [formOwnership, setFormOwnership] = useState<"individual" | "agency">("individual");
  const [formOwnerName, setFormOwnerName] = useState("");
  const [formContact, setFormContact] = useState("+880");
  const [formRegNumber, setFormRegNumber] = useState("");
  const [formDriverName, setFormDriverName] = useState("");
  const [formDriverContact, setFormDriverContact] = useState("+880");
  const [formVehicleName, setFormVehicleName] = useState("");
  const [formNicu, setFormNicu] = useState("no");
  const [formDivision, setFormDivision] = useState("");
  const [formDistrict, setFormDistrict] = useState("");

  // Search & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filterFn = (a: AmbulanceRecord, q: string) =>
    a.ownerName.toLowerCase().includes(q) ||
    a.contactNumber.toLowerCase().includes(q) ||
    a.regNumber.toLowerCase().includes(q);

  const { paginatedData, totalPages, safePage, startIndex, filtered } = useListPagination(
    ambulances, searchQuery, filterFn, pageSize, currentPage
  );

  const openRegister = () => {
    setEditingAmb(null);
    setFormOwnership("individual");
    setFormOwnerName("");
    setFormContact("+880");
    setFormRegNumber("");
    setFormDriverName("");
    setFormDriverContact("+880");
    setFormVehicleName("");
    setFormNicu("no");
    setFormDivision("");
    setFormDistrict("");
    setRegisterModal(true);
  };

  const openEdit = (a: AmbulanceRecord) => {
    setEditingAmb(a);
    setFormOwnership(a.ownershipType);
    setFormOwnerName(a.ownerName);
    setFormContact(a.contactNumber);
    setFormRegNumber(a.regNumber);
    setFormDriverName(a.driverName);
    setFormDriverContact(a.driverContact);
    setFormVehicleName(a.vehicleName);
    setFormNicu(a.nicuFacility ? "yes" : "no");
    setFormDivision(a.division);
    setFormDistrict(a.district);
    setRegisterModal(true);
  };

  const handleSubmit = () => {
    if (!formOwnerName || !formContact || !formRegNumber || !formDriverName) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editingAmb) {
      setAmbulances((prev) =>
        prev.map((a) =>
          a.id === editingAmb.id
            ? { ...a, ownershipType: formOwnership, ownerName: formOwnerName, contactNumber: formContact, regNumber: formRegNumber, driverName: formDriverName, driverContact: formDriverContact, vehicleName: formVehicleName, nicuFacility: formNicu === "yes", division: formDivision, district: formDistrict }
            : a
        )
      );
      toast.success("Ambulance updated successfully!");
    } else {
      const newAmb: AmbulanceRecord = {
        id: `a${Date.now()}`,
        ownershipType: formOwnership,
        ownerName: formOwnerName,
        contactNumber: formContact,
        regNumber: formRegNumber,
        driverName: formDriverName,
        driverContact: formDriverContact,
        vehicleName: formVehicleName,
        nicuFacility: formNicu === "yes",
        division: formDivision,
        district: formDistrict,
        status: "Active",
      };
      setAmbulances((prev) => [...prev, newAmb]);
      toast.success("Ambulance registered successfully!");
    }
    setRegisterModal(false);
  };

  const confirmDelete = () => {
    if (deleteAmbId) {
      setAmbulances((prev) => prev.filter((a) => a.id !== deleteAmbId));
      toast.success("Ambulance deleted.");
      setDeleteAmbId(null);
    }
  };

  const availableDistricts = formDivision ? divisionDistricts[formDivision] || [] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ambulance className="h-7 w-7 text-primary" />
          <h1 className="page-header">Ambulances</h1>
        </div>
        <Button onClick={openRegister} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Ambulance Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <ListSearchBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              searchPlaceholder="Search by owner name, contact or reg number..."
            />
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Owner/Agency</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Reg. Number</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Driver</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Vehicle</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">NICU</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Area</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((a, idx) => (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{a.ownerName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.regNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.driverName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.vehicleName}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={a.nicuFacility ? "default" : "secondary"} className="text-xs">
                          {a.nicuFacility ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{a.district}, {a.division}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={a.status === "Active" ? "default" : "secondary"} className="text-xs">{a.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(a)}>
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteAmbId(a.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        {searchQuery ? "No ambulances found." : "No ambulances registered yet."}
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

      <Dialog open={registerModal} onOpenChange={setRegisterModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-primary" />
              {editingAmb ? "Edit Ambulance" : "Add New Ambulance Register"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Ownership Type *</Label>
              <Select value={formOwnership} onValueChange={(v: "individual" | "agency") => setFormOwnership(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual/Own</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{formOwnership === "agency" ? "Agency Name *" : "Owner Name *"}</Label>
                <Input placeholder={formOwnership === "agency" ? "Agency name" : "Full name"} value={formOwnerName} onChange={(e) => setFormOwnerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contact Number *</Label>
                <Input value={formContact} onChange={(e) => setFormContact(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Registration Number *</Label>
                <Input placeholder="e.g. Dhaka Metro-Cha-11-2233" value={formRegNumber} onChange={(e) => setFormRegNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Driver Name *</Label>
                <Input placeholder="Driver full name" value={formDriverName} onChange={(e) => setFormDriverName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Driver Contact Number</Label>
                <Input value={formDriverContact} onChange={(e) => setFormDriverContact(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Name</Label>
                <Input placeholder="e.g. Toyota Hiace" value={formVehicleName} onChange={(e) => setFormVehicleName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                Vehicle Photos (2-3 photos)
              </Label>
              <div className="flex gap-3">
                <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">Photo 1</div>
                <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">Photo 2</div>
                <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">Photo 3</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>NICU/ICU Facilities</Label>
              <RadioGroup value={formNicu} onValueChange={setFormNicu} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="amb-nicu-yes" />
                  <Label htmlFor="amb-nicu-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="amb-nicu-no" />
                  <Label htmlFor="amb-nicu-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Service Area (Catchment)</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Division</Label>
                  <Select value={formDivision} onValueChange={(v) => { setFormDivision(v); setFormDistrict(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(divisionDistricts).map((div) => (
                        <SelectItem key={div} value={div}>{div}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={formDistrict} onValueChange={setFormDistrict} disabled={!formDivision}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full gap-2">
              <Ambulance className="h-4 w-4" /> {editingAmb ? "Update Ambulance" : "Register Ambulance"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteAmbId} onOpenChange={() => setDeleteAmbId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ambulance?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this ambulance? This action cannot be undone.</AlertDialogDescription>
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

export default Ambulances;
