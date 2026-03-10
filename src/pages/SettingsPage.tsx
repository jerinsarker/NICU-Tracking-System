import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X } from "lucide-react";

const roles = [
  { name: "Super Admin", permissions: "Full Access", users: 2 },
  { name: "Hospital Staff", permissions: "View & Admit Only", users: 87 },
];

const SettingsPage = () => {
  const [districts, setDistricts] = useState([
    "Dhaka", "Gazipur", "Tangail", "Mymensingh", "Narsingdi", "Manikganj",
  ]);
  const [newDistrict, setNewDistrict] = useState("");
  const [phoneCode, setPhoneCode] = useState("+880");

  const addDistrict = () => {
    if (newDistrict.trim() && !districts.includes(newDistrict.trim())) {
      setDistricts([...districts, newDistrict.trim()]);
      setNewDistrict("");
    }
  };

  const removeDistrict = (d: string) => {
    setDistricts(districts.filter((x) => x !== d));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="profile">Profile & Security</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="system">System Variables</TabsTrigger>
        </TabsList>

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
              <Button onClick={() => toast.success("Profile updated!")}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Permissions</th>
                      <th className="text-right px-4 py-3 font-semibold text-foreground">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r) => (
                      <tr key={r.name} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.permissions}</td>
                        <td className="px-4 py-3 text-right text-foreground">{r.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg">Default Phone Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Country Code</Label>
                <Input
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="max-w-[120px]"
                />
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
                    <button
                      onClick={() => removeDistrict(d)}
                      className="ml-1 hover:text-destructive"
                    >
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
    </div>
  );
};

export default SettingsPage;
