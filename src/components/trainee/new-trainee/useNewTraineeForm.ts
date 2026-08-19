import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { ApiError, registerNewTrainee } from "@/api/trainee";
import { STATES } from "@/data/states";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/components/training/add-training/formatting";

const randomDigits = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

const generatePassword = () => `TRN${randomDigits(4)}@${new Date().getFullYear()}`;

export function useNewTraineeForm() {
  const router = useRouter();
  const { adminToken, adminLogout } = useAuth();

  // Corporate Mapping
  const [zone, setZone] = useState("");
  const [region, setRegion] = useState("");
  const [company, setCompany] = useState("Samsung India");
  const [requestedByOption, setRequestedByOption] = useState("");
  const [requestedByOther, setRequestedByOther] = useState("");
  const requestedBy = requestedByOption === "Other" ? requestedByOther : requestedByOption;

  // Leadership Context
  const [trainerId, setTrainerId] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorDesignation, setSupervisorDesignation] = useState("");

  // Trainee Profile
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [traineeUid, setTraineeUid] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // Contact Info
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [altEmail, setAltEmail] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [district, setDistrict] = useState("");
  const selectedState = useMemo(() => STATES.find((item) => item.value === stateValue), [stateValue]);

  // Employment Details
  const [joinedOn, setJoinedOn] = useState(() => formatDate(new Date()));
  const [jobStatus, setJobStatus] = useState("Active");
  const [jobCity, setJobCity] = useState("");
  const [jobPincode, setJobPincode] = useState("");
  const [resignedOn, setResignedOn] = useState("");

  // System Access
  const [password] = useState(generatePassword);
  const [verified, setVerified] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const changeJobStatus = (value: string) => {
    setJobStatus(value);
    if (value !== "Resigned") setResignedOn("");
  };

  const handleSubmit = async () => {
    if (
      !zone || !region || !company || !requestedBy ||
      !trainerId || !supervisorId ||
      !traineeUid.trim() || !fullName.trim() || !designation || !gender ||
      !primaryEmail.trim() || !primaryPhone.trim() ||
      !stateValue || !district
    ) {
      setNotice("Please fill in all required (*) fields.");
      return;
    }
    if (primaryPhone.trim().length !== 10) {
      setNotice("Primary phone must be a 10 digit mobile number.");
      return;
    }
    if (!verified) {
      setNotice("Please verify that the information entered above is correct.");
      return;
    }
    if (!adminToken) {
      setNotice("Your session has expired. Please log in again.");
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      await registerNewTrainee(adminToken, {
        traineeUid: traineeUid.trim(),
        profilePhoto,
        agencyId: agencyId || null,
        fullName: fullName.trim(),
        designation,
        gender,
        dob: dob || null,
        primaryEmail: primaryEmail.trim(),
        primaryPhone: primaryPhone.trim(),
        altEmail: altEmail.trim() || null,
        altPhone: altPhone.trim() || null,
        address: address.trim() || null,
        state: stateValue,
        district,
        zone,
        region,
        company,
        requestedBy,
        trainerId,
        trainerName,
        supervisorId,
        supervisorName,
        supervisorDesignation: supervisorDesignation || null,
        joinedOn,
        jobStatus,
        jobCity: jobCity.trim() || null,
        jobPincode: jobPincode.trim() || null,
        resignedOn: resignedOn || null,
        username: traineeUid.trim(),
        password,
      });

      router.back();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        adminLogout();
        router.replace({ pathname: "/trainer_login", params: { reason: "session_expired" } });
        return;
      }
      setNotice(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    zone, setZone,
    region, setRegion,
    company, setCompany,
    requestedByOption, setRequestedByOption,
    requestedByOther, setRequestedByOther,
    requestedBy,

    trainerId, setTrainerId,
    trainerName, setTrainerName,
    supervisorId, setSupervisorId,
    supervisorName, setSupervisorName,
    supervisorDesignation, setSupervisorDesignation,

    profilePhoto, setProfilePhoto,
    traineeUid, setTraineeUid,
    agencyId, setAgencyId,
    fullName, setFullName,
    designation, setDesignation,
    gender, setGender,
    dob, setDob,

    primaryEmail, setPrimaryEmail,
    primaryPhone, setPrimaryPhone,
    altEmail, setAltEmail,
    altPhone, setAltPhone,
    address, setAddress,
    stateValue, setStateValue,
    district, setDistrict,
    selectedState,

    joinedOn, setJoinedOn,
    jobStatus, setJobStatus: changeJobStatus,
    jobCity, setJobCity,
    jobPincode, setJobPincode,
    resignedOn, setResignedOn,

    password,
    verified, setVerified,

    submitting, notice, handleSubmit,
  };
}

export type NewTraineeForm = ReturnType<typeof useNewTraineeForm>;
