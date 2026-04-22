import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { toast } from "sonner";
import {
  X,
  Pencil,
  Trash2,
  Users,
  Settings,
  MapPin,
  Plus,
  Shield,
  UserCircle,
  KeyRound,
} from "lucide-react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Suspended";
}

const roleColorMap: Record<string, string> = {
  Hospital: "bg-blue-100 text-blue-800 border border-blue-300",
  Patient: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  Ambulance: "bg-purple-100 text-purple-800 border border-purple-300",
};

const initialUsers: SystemUser[] = [
  { id: "u2", name: "Dhaka Medical College", email: "fatema@dhmc.gov.bd", phone: "+880-1711-000002", role: "Hospital", status: "Active" },
  { id: "u3", name: "Kamal Hasan", email: "kamal@cmch.gov.bd", phone: "+880-1711-000003", role: "Patient", status: "Active" },
  { id: "u4", name: "Rajshahi Medical College", email: "jahanara@rmch.gov.bd", phone: "+880-1711-000004", role: "Hospital", status: "Suspended" },
  { id: "u5", name: "Mizanur Rahman", email: "mizan@amb.gov.bd", phone: "+880-1711-000005", role: "Ambulance", status: "Active" },
];

const availableRoles = ["Hospital", "Patient", "Ambulance"];

const modules = ["Dashboard", "Hospital", "Ambulance", "Patient", "Transaction & Analytics", "Settings"];
const permissions = ["View", "Create", "Update", "Delete"];

type RolePermissions = Record<string, Record<string, boolean>>;

const defaultRolePermissions: Record<string, RolePermissions> = {
  Hospital: {
    Dashboard: { View: true, Create: false, Update: false, Delete: false },
    Hospital: { View: true, Create: false, Update: true, Delete: false },
    Ambulance: { View: true, Create: false, Update: false, Delete: false },
    Patient: { View: true, Create: true, Update: true, Delete: false },
    "Transaction & Analytics": { View: true, Create: false, Update: false, Delete: false },
    Settings: { View: false, Create: false, Update: false, Delete: false },
  },
  Ambulance: {
    Dashboard: { View: true, Create: false, Update: false, Delete: false },
    Hospital: { View: true, Create: false, Update: false, Delete: false },
    Ambulance: { View: true, Create: false, Update: true, Delete: false },
    Patient: { View: true, Create: false, Update: false, Delete: false },
    "Transaction & Analytics": { View: true, Create: false, Update: false, Delete: false },
    Settings: { View: false, Create: false, Update: false, Delete: false },
  },
  Patient: {
    Dashboard: { View: true, Create: false, Update: false, Delete: false },
    Hospital: { View: true, Create: false, Update: false, Delete: false },
    Ambulance: { View: true, Create: false, Update: false, Delete: false },
    Patient: { View: true, Create: false, Update: true, Delete: false },
    "Transaction & Analytics": { View: true, Create: false, Update: false, Delete: false },
    Settings: { View: false, Create: false, Update: false, Delete: false },
  },
};

const defaultDivisionDistricts: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Kishoreganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Brahmanbaria", "Noakhali", "Lakshmipur", "Feni", "Chandpur", "Rangamati", "Khagrachari", "Bandarban"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Magura", "Kushtia", "Meherpur", "Chuadanga", "Jhenaidah"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokathi", "Barguna"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon", "Panchagarh"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const SettingsPage = () => {
  // Users
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "" });

  // New Role modal
  const [newRoleModal, setNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [rolesList, setRolesList] = useState<string[]>(availableRoles);

  // Role & Access
  const [rolePerms, setRolePerms] = useState<Record<string, RolePermissions>>(defaultRolePermissions);
  const [selectedRole, setSelectedRole] = useState<string>("Hospital");

  // System
  const [divisionDistricts, setDivisionDistricts] = useState<Record<string, string[]>>(defaultDivisionDistricts);
  const [newDivision, setNewDivision] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>(Object.keys(defaultDivisionDistricts)[0]);

  // User handlers
  const openEditUser = (u: SystemUser) => {
    setEditingUser(u);
    setUserForm({ name: u.name, email: u.email, phone: u.phone, password: "", confirmPassword: "", role: u.role });
    setUserModal(true);
  };

  const saveUser = () => {
    if (!userForm.phone || !userForm.role) {
      toast.error("Please fill Phone/Username and Role");
      return;
    }
    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, name: userForm.name, email: userForm.email, phone: userForm.phone, role: userForm.role, status: u.status } : u)));
      toast.success("Profile updated successfully!");
    }
    setUserModal(false);
  };

  const addNewRole = () => {
    const name = newRoleName.trim();
    if (!name) { toast.error("Role name required"); return; }
    if (rolesList.includes(name)) { toast.error("Role already exists"); return; }
    setRolesList((prev) => [...prev, name]);
    setRolePerms((prev) => ({
      ...prev,
      [name]: modules.reduce((acc, m) => {
        acc[m] = { View: false, Create: false, Update: false, Delete: false };
        return acc;
      }, {} as RolePermissions),
    }));
    setSelectedRole(name);
    setNewRoleName("");
    setNewRoleModal(false);
    toast.success(`Role "${name}" created!`);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      toast.success("User deleted.");
      setDeleteUserId(null);
    }
  };

  const changeUserStatus = (id: string, newStatus: "Active" | "Suspended") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    toast.success(`User status changed to ${newStatus}`);
  };

  // Role permission toggle
  const togglePermission = (mod: string, perm: string) => {
    setRolePerms((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [mod]: {
          ...prev[selectedRole][mod],
          [perm]: !prev[selectedRole][mod][perm],
        },
      },
    }));
  };

  const savePermissions = () => {
    toast.success(`Permissions saved for "${selectedRole}" role!`);
  };

  // Division/District
  const addDivision = () => {
    const name = newDivision.trim();
    if (name && !divisionDistricts[name]) {
      setDivisionDistricts((prev) => ({ ...prev, [name]: [] }));
      setSelectedDivision(name);
      setNewDivision("");
      toast.success(`Division "${name}" added!`);
    }
  };

  const removeDivision = (div: string) => {
    setDivisionDistricts((prev) => {
      const copy = { ...prev };
      delete copy[div];
      return copy;
    });
    if (selectedDivision === div) {
      const remaining = Object.keys(divisionDistricts).filter((d) => d !== div);
      setSelectedDivision(remaining[0] || "");
    }
    toast.success(`Division "${div}" removed.`);
  };

  const addDistrict = () => {
    const name = newDistrict.trim();
    if (name && selectedDivision && !divisionDistricts[selectedDivision]?.includes(name)) {
      setDivisionDistricts((prev) => ({
        ...prev,
        [selectedDivision]: [...(prev[selectedDivision] || []), name],
      }));
      setNewDistrict("");
      toast.success(`District "${name}" added to ${selectedDivision}!`);
    }
  };

  const removeDistrict = (dist: string) => {
    setDivisionDistricts((prev) => ({
      ...prev,
      [selectedDivision]: prev[selectedDivision].filter((d) => d !== dist),
    }));
  };

  const getNameLabel = () => (userForm.role === "Hospital" ? "Hospital Name" : "Full Name");
  const getNamePlaceholder = () => (userForm.role === "Hospital" ? "e.g. Dhaka Medical College" : "e.g. Dr. Rahim Uddin");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="page-header">Settings & Administration</h1>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 h-11">
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-4 w-4" /> Role & Access
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5 text-xs sm:text-sm">
            <MapPin className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        {/* TAB 1 — USERS */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground w-12">SN.</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Mobile No</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">Manage Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                          <td className="px-4 py-3">
                            <Badge className={`text-xs ${roleColorMap[u.role] ?? "bg-muted text-muted-foreground"}`}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Select value={u.status} onValueChange={(val) => changeUserStatus(u.id, val as "Active" | "Suspended")}>
                              <SelectTrigger className="h-8 w-28 mx-auto text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Suspended">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEditUser(u)}>
                              <Pencil className="h-3.5 w-3.5" /> Edit Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2 — ROLE & ACCESS */}
        <TabsContent value="roles" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Role & Access Permissions
                </CardTitle>
                <div className="flex gap-2 items-center">
                  {rolesList.map((role) => (
                    <Badge
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      className={`cursor-pointer text-sm px-4 py-1.5 ${selectedRole === role ? "" : "hover:bg-muted"}`}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </Badge>
                  ))}
                  <Button size="sm" className="gap-1.5 ml-2" onClick={() => setNewRoleModal(true)}>
                    <Plus className="h-3.5 w-3.5" /> New Role
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Module</th>
                        {permissions.map((p) => (
                          <th key={p} className="text-center px-4 py-3 font-semibold text-foreground">{p}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((mod) => (
                        <tr key={mod} className="border-t border-border hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{mod}</td>
                          {permissions.map((perm) => (
                            <td key={perm} className="px-4 py-3 text-center">
                              <Checkbox
                                checked={rolePerms[selectedRole]?.[mod]?.[perm] ?? false}
                                onCheckedChange={() => togglePermission(mod, perm)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={savePermissions} className="gap-2">
                  <Shield className="h-4 w-4" /> Save Access Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3 — SYSTEM */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Administration Units
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Divisions</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(divisionDistricts).map((div) => (
                    <Badge
                      key={div}
                      variant={selectedDivision === div ? "default" : "secondary"}
                      className="gap-1 pr-1 cursor-pointer"
                      onClick={() => setSelectedDivision(div)}
                    >
                      {div}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeDivision(div); }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="New division name"
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addDivision()}
                    className="max-w-xs"
                  />
                  <Button size="sm" variant="outline" onClick={addDivision} className="gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Division
                  </Button>
                </div>
              </div>

              {selectedDivision && (
                <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                  <Label className="text-sm font-semibold">
                    Districts under <span className="text-primary">{selectedDivision}</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(divisionDistricts[selectedDivision] || []).map((dist) => (
                      <Badge key={dist} variant="outline" className="gap-1 pr-1">
                        {dist}
                        <button onClick={() => removeDistrict(dist)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {(divisionDistricts[selectedDivision] || []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No districts added yet.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New district name"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDistrict()}
                      className="max-w-xs"
                    />
                    <Button size="sm" variant="outline" onClick={addDistrict} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add District
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={userModal} onOpenChange={setUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update phone/username, password, and role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Phone / Username *</Label>
              <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+880-1XXX-XXXXXX" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={userForm.confirmPassword} onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })} placeholder="••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Role *</Label>
              <Select value={userForm.role} onValueChange={(val) => setUserForm({ ...userForm, role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesList.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserModal(false)}>Cancel</Button>
            <Button onClick={saveUser}>Update Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Role Modal */}
      <Dialog open={newRoleModal} onOpenChange={setNewRoleModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Add a new role. You can configure permissions after creation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Role Name *</Label>
            <Input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNewRole()}
              placeholder="e.g. Supervisor"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleModal(false)}>Cancel</Button>
            <Button onClick={addNewRole} className="gap-1.5">
              <Plus className="h-4 w-4" /> Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this user? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;