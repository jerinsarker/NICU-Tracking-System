import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Upload, AlertTriangle, Send, BedDouble } from "lucide-react";
import { toast } from "sonner";

const nearbyHospitals = [
  { name: "City Hospital", beds: 3 },
  { name: "National NICU Center", beds: 7 },
  { name: "Dhaka Medical College", beds: 2 },
];

const Hospitals = () => {
  const [nicuYes] = useState("yes");
  const [nicuNo] = useState("no");
  const [totalBeds, setTotalBeds] = useState(3);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [admissionModal, setAdmissionModal] = useState<string | null>(null);
  const [babyName, setBabyName] = useState("");
  const [relation, setRelation] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("+880");

  const handleGenerateQR = () => {
    setQrGenerated(true);
    toast.success(`${totalBeds} QR codes generated successfully!`);
  };

  const handleConfirmAdmission = () => {
    toast.success(`Bed ${admissionModal} is now occupied!`);
    setAdmissionModal(null);
    setBabyName("");
    setRelation("");
    setContactName("");
    setPhone("+880");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Add New Hospital</h1>

      <Tabs defaultValue="with-nicu" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="with-nicu">Hospital With NICU</TabsTrigger>
          <TabsTrigger value="without-nicu">Hospital Without NICU</TabsTrigger>
        </TabsList>

        {/* TAB 1: With NICU */}
        <TabsContent value="with-nicu" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hospital Identity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Hospital Name</Label>
                <Input placeholder="e.g. City Hospital" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g. Dhaka, Bangladesh" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+880-XX-XXXX" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>NICU Available?</Label>
                <RadioGroup value={nicuYes} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="nicu-yes" />
                    <Label htmlFor="nicu-yes">Yes</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="nicu-no" />
                    <Label htmlFor="nicu-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-accent/50 border border-border">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    Upload NICU Bed Pictures
                  </Label>
                  <div className="flex gap-3">
                    <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                      Bed 1 Photo
                    </div>
                    <div className="flex-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                      Bed 2 Photo
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <Label>Enter Total NICU Beds</Label>
                  <Input
                    type="number"
                    min={1}
                    value={totalBeds}
                    onChange={(e) => setTotalBeds(Number(e.target.value))}
                  />
                </div>

                <Button onClick={handleGenerateQR} className="gap-2">
                  <QrCode className="h-4 w-4" /> Save & Generate QR Codes
                </Button>
              </div>

              {qrGenerated && (
                <div className="space-y-3">
                  <p className="section-label">Generated QR Codes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array.from({ length: totalBeds }, (_, i) => {
                      const label = `NICU-${String(i + 1).padStart(2, "0")}`;
                      return (
                        <button
                          key={label}
                          onClick={() => setAdmissionModal(label)}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                            <QrCode className="h-10 w-10 text-primary/70" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click a QR code to simulate scanning and open the Quick Admission Form.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Without NICU */}
        <TabsContent value="without-nicu" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hospital Identity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Hospital Name</Label>
                <Input placeholder="e.g. Upazila Health Complex" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g. Tangail, Bangladesh" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+880-XX-XXXX" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>NICU Available?</Label>
                <RadioGroup value={nicuNo} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="nicu-yes-2" />
                    <Label htmlFor="nicu-yes-2">Yes</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="nicu-no-2" />
                    <Label htmlFor="nicu-no-2">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  This hospital will act as a <strong>Referral Point</strong> only. No QR codes will be generated.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-base font-semibold text-foreground flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-primary" />
                  Nearby NICU Availability List
                </p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Hospital Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Available Beds</th>
                        <th className="text-right px-4 py-3 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nearbyHospitals.map((h) => (
                        <tr key={h.name} className="border-t border-border">
                          <td className="px-4 py-3 text-foreground">{h.name}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
                              {h.beds}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs border-primary/30 text-primary hover:bg-primary/5"
                              onClick={() => toast.success(`Referral request sent to ${h.name}`)}
                            >
                              <Send className="h-3 w-3" /> Send Referral
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
      </Tabs>

      {/* Admission Modal */}
      <Dialog open={!!admissionModal} onOpenChange={() => setAdmissionModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Bed ID: {admissionModal}{" "}
              <span className="text-success font-normal text-sm">(Ready for Admission)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label>Baby Name</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter baby name (optional)"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  className="font-semibold"
                  onClick={() => setBabyName("")}
                >
                  SKIP
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">Guardian Info</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select value={relation} onValueChange={setRelation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    placeholder="Full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone No</Label>
                  <Input
                    placeholder="+880-XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleConfirmAdmission}
              className="w-full h-12 text-base font-bold gap-2"
            >
              <BedDouble className="h-5 w-5" />
              Confirm & Occupy Bed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hospitals;
