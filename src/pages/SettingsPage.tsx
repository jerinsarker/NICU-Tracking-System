import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Plus,
  Pencil,
  Trash2,
  Shield,
  Users,
  Settings,
  UserCog,
  Save,
} from "lucide-react";

// ─── Types ───
interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Suspended";
}

interface Permission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Record<string, Permission>;
}

// ─── Seed Data ───
const systemModules = [
  "Hospital Management",
  "Bed Tracking",
  "Referrals & Transfers",
  "Ambulance Management",
  "Reports & Analytics",
  "User Management",
  "System Settings",
];

const defaultPermission = (): Permission => ({
  view: false,
  create: false,
  update: false,
  delete: false,
});

const initialRoles: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    permissions: Object.fromEntries(
      systemModules.map((m) => [m, { view: true, create: true, update: true, delete: true }])
    ),
  },
  {
    id: "r2",
    name: "Hospital",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    permissions: Object.fromEntries(
      systemModules.map((m) => [
        m,
        {
          view: true,
          create: ["Hospital Management", "Bed Tracking", "Referrals & Transfers"].includes(m),
          update: ["Hospital Management", "Bed Tracking", "Referrals & Transfers"].includes(m),
          delete: false,
        },
      ])
    ),
  },
  {
    id: "r3",
    name: "Patient",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    permissions: Object.fromEntries(
      systemModules.map((m) => [
        m,
        {
          view: true,
          create: ["Bed Tracking"].includes(m),
          update: ["Bed Tracking"].includes(m),
          delete: false,
        },
      ])
    ),
  },
  {
    id: "r4",
    name: "Ambulance",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    permissions: Object.fromEntries(
      systemModules.map((m) => [
        m,
        {
          view: ["Ambulance Management", "Hospital Management"].includes(m),
          create: false,
          update: ["Ambulance Management"].includes(m),
          delete: false,
        },
      ])
    ),
  },
];

const initialUsers: SystemUser[] = [
  { id: "u1", name: "Dr. Rahim Uddin", email: "rahim@nicu.gov.bd", phone: "+880-1711-000001", role: "Super Admin", status: "Active" },
  { id: "u2", name: "Dhaka Medical College", email: "fatema@dhmc.gov.bd", phone: "+880-1711-000002", role: "Hospital", status: "Active" },
  { id: "u3", name: "Kamal Hasan", email: "kamal@cmch.gov.bd", phone: "+880-1711-000003", role: "Patient", status: "Active" },
  { id: "u4", name: "Rajshahi Medical College", email: "jahanara@rmch.gov.bd", phone: "+880-1711-000004", role: "Hospital", status: "Suspended" },
  { id: "u5", name: "Mizanur Rahman", email: "mizan@amb.gov.bd", phone: "+880-1711-000005", role: "Ambulance", status: "Active" },
];

const roleColorMap: Record<string, string> = {
  "Super Admin": "bg-amber-100 text-amber-800 border border-amber-300",
  "Hospital": "bg-blue-100 text-blue-800 border border-blue-300",
  "Patient": "bg-emerald-100 text-emerald-800 border border-emerald-300",
  "Ambulance": "bg-purple-100 text-purple-800 border border-purple-300",
};

// ─── Component ───
const SettingsPage = () => {
  // Tab 1: User Management
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", password: "", role: "" });

  // Tab 2: Role Management
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0].id);
  const [roleModal, setRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [editedPermissions, setEditedPermissions] = useState<Record<string, Permission>>({});

  // Tab 3: Profile & Security
  // Tab 4: System Variables
  const [districts, setDistricts] = useState(["Dhaka", "Gazipur", "Tangail", "Mymensingh", "Narsingdi", "Manikganj"]);
  const [newDistrict, setNewDistrict] = useState("");
  const [phoneCode, setPhoneCode] = useState("+880");

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // ─── User Handlers ───
  const openEditUser = (u: SystemUser) => {
    setEditingUser(u);
    setUserForm({ name: u.name, email: u.email, phone: u.phone, password: "", role: u.role });
    setUserModal(true);
  };

  const saveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.role) {
      toast.error("Please fill Name, Email, and Role");
      return;
    }
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...userForm, status: u.status } : u)));
      toast.success("User updated successfully!");
    }
    setUserModal(false);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      toast.success("User deleted.");
      setDeleteUserId(null);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
    );
  };

  // ─── Role Handlers ───
  const selectRole = (id: string) => {
    setSelectedRoleId(id);
    const role = roles.find((r) => r.id === id);
    if (role) setEditedPermissions(JSON.parse(JSON.stringify(role.permissions)));
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setNewRoleName("");
    setRoleModal(true);
  };

  const openEditRole = (r: Role) => {
    setEditingRole(r);
    setNewRoleName(r.name);
    setRoleModal(true);
  };

  const saveRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (editingRole) {
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, name: newRoleName.trim() } : r)));
      toast.success("Role renamed!");
    } else {
      const newRole: Role = {
        id: `r${Date.now()}`,
        name: newRoleName.trim(),
        color: "bg-gray-100 text-gray-800 border-gray-300",
        permissions: Object.fromEntries(systemModules.map((m) => [m, defaultPermission()])),
      };
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      setEditedPermissions(JSON.parse(JSON.stringify(newRole.permissions)));
      toast.success("New role created!");
    }
    setRoleModal(false);
  };

  const confirmDeleteRole = () => {
    if (deleteRoleId) {
      setRoles((prev) => prev.filter((r) => r.id !== deleteRoleId));
      if (selectedRoleId === deleteRoleId && roles.length > 1) {
        const next = roles.find((r) => r.id !== deleteRoleId);
        if (next) selectRole(next.id);
      }
      toast.success("Role deleted.");
      setDeleteRoleId(null);
    }
  };

  const togglePermission = (module: string, action: keyof Permission) => {
    setEditedPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module][action] },
    }));
  };

  const savePermissions = () => {
    setRoles((prev) =>
      prev.map((r) => (r.id === selectedRoleId ? { ...r, permissions: JSON.parse(JSON.stringify(editedPermissions)) } : r))
    );
    toast.success("Permissions saved for " + (selectedRole?.name ?? "role") + "!");
  };

  // Init edited permissions on mount
  useState(() => {
    if (selectedRole) setEditedPermissions(JSON.parse(JSON.stringify(selectedRole.permissions)));
  });

  // ─── District helpers ───
  const addDistrict = () => {
    if (newDistrict.trim() && !districts.includes(newDistrict.trim())) {
      setDistricts([...districts, newDistrict.trim()]);
      setNewDistrict("");
    }
  };

  const removeDistrict = (d: string) => setDistricts(districts.filter((x) => x !== d));

  // Dynamic label for name field based on selected role
  const getNameLabel = () => {
    if (userForm.role === "Hospital") return "Hospital Name";
    return "Full Name";
  };

  const getNamePlaceholder = () => {
    if (userForm.role === "Hospital") return "e.g. Dhaka Medical College";
    return "e.g. Dr. Rahim Uddin";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="page-header">Settings & Administration</h1>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 h-11">
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-4 w-4" /> Roles & Access
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
            <UserCog className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5 text-xs sm:text-sm">
            <Settings className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════
            TAB 1 — USER MANAGEMENT
        ═══════════════════════════════════════════ */}
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
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3">
                            <Badge className={`text-xs ${roleColorMap[u.role] ?? "bg-muted text-muted-foreground"}`}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant={u.status === "Active" ? "default" : "destructive"}
                              className="cursor-pointer text-xs"
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditUser(u)}>
                                <Pencil className="h-4 w-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteUserId(u.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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

        {/* ═══════════════════════════════════════════
            TAB 2 — ROLE & ACCESS MANAGEMENT
        ═══════════════════════════════════════════ */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel — Role List */}
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Roles
                </CardTitle>
                <Button size="sm" onClick={openCreateRole} className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> New Role
                </Button>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      selectedRoleId === r.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"
                    }`}
                    onClick={() => selectRole(r.id)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.color.split(" ")[0]}`} />
                      <span className="font-medium text-sm text-foreground">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditRole(r);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteRoleId(r.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Right Panel — Permissions Matrix */}
            <Card className="lg:col-span-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  Access Matrix —{" "}
                  <Badge className={`ml-1 ${selectedRole?.color ?? ""}`}>
                    {selectedRole?.name ?? "Select a role"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRole && Object.keys(editedPermissions).length > 0 ? (
                  <>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold text-foreground">Module</th>
                            <th className="text-center px-3 py-3 font-semibold text-foreground">View</th>
                            <th className="text-center px-3 py-3 font-semibold text-foreground">Create</th>
                            <th className="text-center px-3 py-3 font-semibold text-foreground">Update</th>
                            <th className="text-center px-3 py-3 font-semibold text-foreground">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {systemModules.map((mod) => (
                            <tr key={mod} className="border-t border-border hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium text-foreground">{mod}</td>
                              {(["view", "create", "update", "delete"] as (keyof Permission)[]).map((action) => (
                                <td key={action} className="text-center px-3 py-3">
                                  <Checkbox
                                    checked={editedPermissions[mod]?.[action] ?? false}
                                    onCheckedChange={() => togglePermission(mod, action)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button onClick={savePermissions} className="gap-1.5">
                        <Save className="h-4 w-4" /> Save Access Permissions
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Select a role to configure permissions.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════
            TAB 3 — PROFILE & SECURITY
        ═══════════════════════════════════════════ */}
        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input value="admin@nicu.gov.bd" readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input placeholder="+880-1XXX-XXXXXX" />
              </div>
              <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════
            TAB 4 — SYSTEM VARIABLES
        ═══════════════════════════════════════════ */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg">Default Phone Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Country Code</Label>
                <Input value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className="max-w-[120px]" />
              </div>
              <Button size="sm" onClick={() => toast.success("Phone code updated!")}>
                Update
              </Button>
            </CardContent>
          </Card>

          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg">Catchment Areas / Districts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {districts.map((d) => (
                  <Badge key={d} variant="secondary" className="gap-1 pr-1">
                    {d}
                    <button onClick={() => removeDistrict(d)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add district"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDistrict()}
                  className="max-w-xs"
                />
                <Button size="sm" variant="outline" onClick={addDistrict}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════ */}

      {/* Edit User Modal */}
      <Dialog open={userModal} onOpenChange={setUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update this user's information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{getNameLabel()}</Label>
              <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder={getNamePlaceholder()} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="user@hospital.gov.bd" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+880-1XXX-XXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Password <span className="text-muted-foreground text-xs">(leave blank to keep)</span></Label>
                <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={userForm.role} onValueChange={(val) => setUserForm({ ...userForm, role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Role Modal */}
      <Dialog open={roleModal} onOpenChange={setRoleModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role Name" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Rename this role." : "Enter a name for the new role."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Role Name</Label>
            <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Nurse Supervisor" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole}>{editingRole ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? Users with this role will need reassignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
