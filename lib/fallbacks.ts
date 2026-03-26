export const fallbackCustomer = {
  email: "guest@placeholder.app", // a deterministic address so upserts reuse the same row
  first_name: "Guest",
  last_name: "User",
  state: null,
  verified_email: false,
  phone: null as string | null,
  tags: "guest",
  currency: null as string | null,
};

// Add your own fallback shipping/billing address below
export const fallbackShippingAddress = {
  address1: "",
  address2: null,
  city: "",
  province: "",
  province_code: "",
  country: "",
  country_code: "",
  zip: "",
  phone: "",
  company: "",
  first_name: "Guest",
  last_name: "User",
};

export const fallbackBillingAddress = {
  address1: "",
  address2: null,
  city: "",
  province: "",
  province_code: "",
  country: "",
  country_code: "",
  zip: "",
  phone: "",
  company: "",
  first_name: "Guest",
  last_name: "User",
};
