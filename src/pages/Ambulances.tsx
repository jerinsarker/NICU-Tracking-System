import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Ambulance } from "lucide-react";
import { toast } from "sonner";

const catchmentAreas = ["Tangail", "Gazipur", "Dhaka", "Mymensingh", "Narsingdi", "Manikganj"];

const Ambulances = () => {
  const [regNumber, setRegNumber] = useState("");
  const [ownership, setOwnership] = useState("individual");
  const [ownerName, setOwnerName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [contact, setContact] = useState("+880");
  const [vehicleName, setVehicleName] = useState("");
  const [nicuFacility, setNicuFacility] = useState("no");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ambulance registered successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-header">Ambulance Registration</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-primary" />
            Ambulance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input
                placeholder="e.g. Dhaka Metro-Cha-11-2233"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Ownership Type</Label>
              <Select value={ownership} onValueChange={setOwnership}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual/Own</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {ownership === "individual" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input
                    placeholder="Full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Agency Name</Label>
                  <Input
                    placeholder="Agency name"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Vehicle Name</Label>
              <Input
                placeholder="e.g. Toyota Hiace"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                Vehicle Photos (2-3 photos)
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                Click to upload or drag and drop
              </div>
            </div>

            <div className="space-y-3">
              <Label>NICU/ICU Facilities</Label>
              <RadioGroup value={nicuFacility} onValueChange={setNicuFacility} className="flex gap-6">
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
              <Label>Service Area (Catchment)</Label>
              <Select onValueChange={(val) => setSelectedAreas((prev) => prev.includes(val) ? prev : [...prev, val])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select catchment area" />
                </SelectTrigger>
                <SelectContent>
                  {catchmentAreas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAreas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground cursor-pointer"
                      onClick={() => setSelectedAreas((prev) => prev.filter((a) => a !== area))}
                    >
                      {area} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-2">
              <Ambulance className="h-4 w-4" /> Register Ambulance
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ambulances;
