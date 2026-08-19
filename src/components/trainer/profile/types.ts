export type ProfileSectionKey = "personal" | "address" | "documents" | "social" | "official" | "security";

export const PROFILE_SECTION_FIELDS: Record<ProfileSectionKey, string[]> = {
  personal: ["name", "email", "mobileNumber", "altPhone", "gender", "dob"],
  address: ["city", "district", "state", "pincode", "landmark", "permanentSameAsLocal"],
  documents: ["aadharNumber", "aadharFile", "profilePicture", "about", "resume", "otherDocument"],
  social: ["facebookUsername", "twitterUsername", "instagramUsername", "linkedinUsername", "youtubeUsername", "github"],
  official: [
    "jobStatus",
    "joinedOn",
    "role",
    "designation",
    "salary",
    "companyEmail",
    "visitingCard",
    "idCard",
    "offerLetter",
    "letterhead",
    "promocode",
  ],
  security: ["password", "remarks", "agreedToTerms"],
};
