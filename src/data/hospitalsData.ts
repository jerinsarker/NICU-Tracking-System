// Shared mock hospital data used across pages (Hospitals list & Patient Refer flow).
// Replace with real backend (Lovable Cloud) when available.

export interface HospitalBed {
  id: string;
  label: string;
  status: "available" | "occupied";
}

export interface Hospital {
  id: string;
  name: string;
  division: string;
  district: string;
  phone: string;
  nicuAvailable: boolean;
  beds: HospitalBed[];
}

export const divisionDistricts: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Kishoreganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Brahmanbaria", "Noakhali", "Lakshmipur", "Feni", "Chandpur", "Rangamati", "Khagrachari", "Bandarban"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Magura", "Kushtia", "Meherpur", "Chuadanga", "Jhenaidah"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokathi", "Barguna"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon", "Panchagarh"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export const sharedHospitals: Hospital[] = [
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
  {
    id: "h4",
    name: "Sylhet MAG Osmani Medical",
    division: "Sylhet",
    district: "Sylhet",
    phone: "+880-821-713667",
    nicuAvailable: true,
    beds: [
      { id: "b6", label: "NICU-01", status: "available" },
      { id: "b7", label: "NICU-02", status: "available" },
      { id: "b8", label: "NICU-03", status: "available" },
      { id: "b9", label: "NICU-04", status: "occupied" },
    ],
  },
];

export const availableBedsCount = (h: Hospital) =>
  h.beds.filter((b) => b.status === "available").length;
