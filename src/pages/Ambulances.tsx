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
import { Ambulance, Plus, Pencil, Trash2, Upload, Phone, Filter, X as XIcon, User, BadgeCheck, ChevronDown, ChevronRight } from "lucide-react";
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

  // Advanced search filters (Super Admin) — simplified: division & district only
  const [filterDivision, setFilterDivision] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");

  // Contact info modal (after selecting an ambulance)
  const [contactAmb, setContactAmb] = useState<AmbulanceRecord | null>(null);

  // Expanded owner groups
  const [expandedOwners, setExpandedOwners] = useState<Record<string, boolean>>({});
  const toggleOwner = (key: string) =>
    setExpandedOwners((prev) => ({ ...prev, [key]: !prev[key] }));

  const filterDistrictOptions = filterDivision !== "all" ? divisionDistricts[filterDivision] || [] : [];

  const resetFilters = () => {
    setFilterDivision("all");
    setFilterDistrict("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filterFn = (a: AmbulanceRecord, q: string) => {
    if (filterDivision !== "all" && a.division !== filterDivision) return false;
    if (filterDistrict !== "all" && a.district !== filterDistrict) return false;
    if (!q) return true;
    // Search restricted to Owner/Agency name & Registration number
    return (
      a.ownerName.toLowerCase().includes(q) ||
      a.regNumber.toLowerCase().includes(q)
    );
  };

  const { paginatedData, totalPages, safePage, startIndex, filtered } = useListPagination(
    ambulances, searchQuery, filterFn, pageSize, currentPage
  );

  // Group filtered ambulances by Owner/Agency (one row per owner, expandable for vehicles)
  const groupedByOwner = (() => {
    const map = new Map<string, { ownerName: string; ownershipType: "individual" | "agency"; contactNumber: string; vehicles: AmbulanceRecord[] }>();
    for (const a of paginatedData) {
      const key = `${a.ownershipType}::${a.ownerName.toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, { ownerName: a.ownerName, ownershipType: a.ownershipType, contactNumber: a.contactNumber, vehicles: [] });
      }
      map.get(key)!.vehicles.push(a);
    }
    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }));
  })();

  const activeFilterCount =
    (filterDivision !== "all" ? 1 : 0) +
    (filterDistrict !== "all" ? 1 : 0);

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
          <h1 className="page-header">Ambulance List</h1>
        </div>
        <Button onClick={openRegister} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Ambulance Register
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Advanced Search & Filter Bar (Super Admin) */}
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Filter className="h-4 w-4 text-primary" />
                Search & Filter Ambulance
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{activeFilterCount} active</Badge>
                )}
              </div>
              {(activeFilterCount > 0 || searchQuery) && (
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={resetFilters}>
                  <XIcon className="h-3.5 w-3.5" /> Clear all
                </Button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Division</Label>
                <Select value={filterDivision} onValueChange={(v) => { setFilterDivision(v); setFilterDistrict("all"); setCurrentPage(1); }}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {Object.keys(divisionDistricts).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">District</Label>
                <Select value={filterDistrict} onValueChange={(v) => { setFilterDistrict(v); setCurrentPage(1); }} disabled={filterDivision === "all"}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="All Districts" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {filterDistrictOptions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ListSearchBar
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              searchPlaceholder="Search by Owner / Agency name or Reg. number..."
            />

            <div className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {ambulances.length} ambulances
              {" · "}
              <span className="font-semibold text-foreground">{groupedByOwner.length}</span> owner{groupedByOwner.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Owner / Agency</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Reg. Number</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Contact</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((a, idx) => (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{a.ownerName}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{a.ownershipType}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.regNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.contactNumber}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => setContactAmb(a)}>
                            <Phone className="h-3.5 w-3.5 text-primary" /> Contact
                          </Button>
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
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {(searchQuery || activeFilterCount > 0) ? "No ambulances match your filters. Try adjusting or clearing them." : "No ambulances registered yet."}
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

      {/* Contact Info Modal — shown after Super Admin selects an ambulance */}
      <Dialog open={!!contactAmb} onOpenChange={(open) => !open && setContactAmb(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" /> Ambulance Contact Info
            </DialogTitle>
          </DialogHeader>
          {contactAmb && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Owner / Agency</div>
                    <div className="font-semibold text-foreground">{contactAmb.ownerName}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-0.5">{contactAmb.ownershipType}</div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {contactAmb.nicuFacility && (
                      <Badge className="text-xs gap-1"><BadgeCheck className="h-3 w-3" /> NICU</Badge>
                    )}
                    <Badge variant={contactAmb.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {contactAmb.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Reg. Number</div>
                    <div className="font-medium text-foreground">{contactAmb.regNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Vehicle</div>
                    <div className="font-medium text-foreground">{contactAmb.vehicleName || "—"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Service Area</div>
                    <div className="font-medium text-foreground">{contactAmb.district}, {contactAmb.division}</div>
                  </div>
                </div>
              </div>

              {/* Owner contact */}
              <div className="rounded-lg border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Owner Contact</div>
                    <div className="font-medium text-foreground">{contactAmb.contactNumber}</div>
                  </div>
                </div>
                <Button asChild size="sm" className="gap-1.5">
                  <a href={`tel:${contactAmb.contactNumber}`}>
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                </Button>
              </div>

              {/* Driver contact */}
              <div className="rounded-lg border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Ambulance className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Driver — {contactAmb.driverName}</div>
                    <div className="font-medium text-foreground">{contactAmb.driverContact || "—"}</div>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="gap-1.5" disabled={!contactAmb.driverContact}>
                  <a href={`tel:${contactAmb.driverContact}`}>
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ambulances;
