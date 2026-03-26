type LeadId = string;
type StaffId = string | number;

interface LeadToStaff {
  leadid: LeadId;
  staffids: StaffId[];
}

export const leadToStaff: LeadToStaff[] = [
  {
    leadid: "BT0193", // Lead is ARIF AFFENDI BIN ABDUL GHANI
    staffids: ["BTN0095", "BTN0155"],
  },

  {
    leadid: "BT0134", // Lead is ARVIND A/L KANAPATHY
    staffids: ["BT0141", "BT0150", "BT0187", "BT0189", "BT0191", "BT0193"],
  },
  {
    leadid: "BT0002", // Lead is CHOO SWEE KOON
    staffids: [
      "BTV0063",
      "BT0198",
      "BT0201",
      "BT0181",
      "BT0132",
      "BT0162",
      "BTN0153",
    ],
  },
  {
    leadid: "BT0004", // Lead is DENNIS LEE WAN-CHIEN
    staffids: ["BT0180", "BT0196"],
  },
  {
    leadid: "BT0187", // Lead is DINESH A/L PARAMASWARAN
    staffids: [249, 209, 89, 98, 367, 458],
  },
  {
    leadid: "BT0182", // Lead is Fabian Tan
    staffids: ["BT0206", "BTN0144", "BTN0161", "BTN0178", "BTV0060"],
  },

  {
    leadid: "BT0179", // Lead is KARTHIGGEYAN A/L MAVALAVAN
    staffids: ["BT0199", "BT0203"],
  },

  {
    leadid: "BT0184", // Lead is LIM YONG FEI
    staffids: ["BT0190"],
  },

  {
    leadid: "BT0191", // Lead is MUHAMAD AZIM BIN AZMAN
    staffids: [231, 360, 416, 176, 109, 256, 489],
  },
  {
    leadid: "BTN0095", // Lead is MUHAMMAD SYAZWAN BIN ISMAIL
    staffids: ["BT0166", "BTV0051"],
  },
  {
    leadid: "BT0136", // Lead is NUR SYAHIIRAH BINTI ZAINAL ABIDIN
    staffids: [116, 115, 269, 311, 348, 404, 112, 444, "BT0172", "BT0204"],
  },
  {
    leadid: "BT0150", // Lead is ONG JET HUEI
    staffids: [
      96, 196, 317, 358, 238, 349, 338, 240, 326, 102, 242, 324, 325, 99, 368,
      104, 316, 421, 436, 465, 228, 415, 469,
    ],
  },
  {
    leadid: "BTV0059", // Lead is TAM JUN XING
    staffids: ["BT0178"],
  },
  {
    leadid: "BT0152", // Lead is TAMILARASI A/P RAJENDRAN
    staffids: ["BT0170", "BT0143", "BT0205", "BTN0074", "BTN0152", "BTN0170"],
  },
  {
    leadid: "BT0189", // Lead is THIENG YU XIANG
    staffids: [91, 93, 213, 446],
  },
];

export function getLeadIdByStaffId(staffId: string | number): string | null {
  const lead = leadToStaff.find((entry) => entry.staffids.includes(staffId));
  return lead ? lead.leadid : null;
}

export function checkIsLead(leadId: string): boolean {
  return leadToStaff.some((entry) => entry.leadid === leadId);
}

export function checkStaffUnderLead(staffId: string | number): boolean {
  return leadToStaff.some((entry) => entry.staffids.includes(staffId));
}
