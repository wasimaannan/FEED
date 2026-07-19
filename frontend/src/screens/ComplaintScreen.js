// src/screens/ComplaintScreen.js
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity, StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, S } from "../theme";
import {
  FadeIn, ScreenHeader, TagLabel, FormField,
  PickerField, PillGroup, WarnBanner, PrimaryBtn,
  GhostBtn, Toast, SectionDivider, EmptyState,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { saveComplaint, getComplaintRootCauses, getAllComplaints, updateComplaint } from "../api";

// ── 5-Level Complaint Hierarchy (inline) ────────────────────────
const COMPLAINT_HIERARCHY = {
  "Broiler": {
    segments: null,
    categories: {
      "DOC Quality": ["Mortality of Chicks","Box Mortality","Paralyzed DOC","Shortage in Box","Blind DOC","3/4 Leg DOC","Weak DOC","Underweight DOC","Uneven Growth"],
      "Feed Quality": ["Pellet Size","Pellet Uniformity","Color","Smell","Dust","Hardness","Feed Intake","Cake/Fungus","Foreign Materials","Bag Stitch","Coating Oil"],
      "Disease": ["ND","IBD","CRD","Coccidiosis","Colibacillosis","Necrotic Enteritis"],
      "Management": ["Wet Litter","High Ammonia","Poor Ventilation","Heat Stress"],
    },
  },
  "Layer": {
    segments: null,
    categories: {
      "Disease": ["ND","IBD","Marek's","CRD","Coryza","EDS"],
      "Production": ["Low Egg Production","Thin Shell","Broken Egg","Prolapse"],
      "Feed Quality": ["Pellet Size","Smell","Dust","Cake/Fungus"],
    },
  },
  "Sonali": {
    segments: ["Chick","Grower","Adult"],
    categories: { "Disease": ["ND","IBD","CRD","Coryza","Fowl Cholera","Coccidiosis"] },
  },
  "Duck": {
    segments: null,
    categories: {
      "Complaints": ["Colour","Mortality","Weak Chick","Underweight Chick","Uneven Chick","Leg Problem","Blind Chick","Pellet Size","Smell","Color","Dust","Cake/Fungus","Feed Intake Problem","Foreign Material","Bag Stitch Issue"],
    },
  },
  "Cattle": {
    segments: ["Calf","Dairy","Fattening"],
    categories: {
      "Disease": ["Scours","Pneumonia","FMD","LSD","Mastitis","BQ","HS"],
      "Feed Quality": ["Moldy Feed","Poor Silage","Mineral Deficiency"],
      "Production": ["Low Milk Yield","Poor Weight Gain"],
    },
  },
  "Fish": {
    segments: ["Tilapia","Pangus","Koi","Magur","Shing","Gulsha","Pabda"],
    categories: {
      "Disease": ["Aeromoniasis","Edwardsiellosis","White Spot","Gill Disease","Argulosis"],
      "Feed Quality": ["Floating Capacity","Floating Duration","Water Stability","Plankton Making","Finishing"],
      "Water Quality": ["Low DO","High Ammonia","High Nitrite","pH Imbalance"],
    },
  },
};

const FARM_TYPES = Object.keys(COMPLAINT_HIERARCHY);

const ROOT_CAUSE_LIBRARY = [
  "Viral Infection","Bacterial Infection","Parasitic Infection","Fungal Infection",
  "Vaccination Failure","Poor Biosecurity","Poor Hygiene","Poor Ventilation",
  "Wet Litter","High Ammonia","Heat Stress","Cold Stress","Poor Feed Quality",
  "Wrong Feed Size","Mycotoxin Contamination","Water Quality Issue","Low DO",
  "High Nitrite","Management Failure","Overstocking",
];

const getSegments   = (ft) => COMPLAINT_HIERARCHY[ft]?.segments || null;
const getCategories = (ft) => Object.keys(COMPLAINT_HIERARCHY[ft]?.categories || {});
const getComplaints = (ft, cat) => COMPLAINT_HIERARCHY[ft]?.categories?.[cat] || [];

// ── Form Helpers ──────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];

export default function ComplaintScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
  const { user }  = useAuth();

  const [saving,      setSaving]      = useState(false);
  const [openList,    setOpenList]    = useState([]);
  const [resolvedList,setResolvedList]= useState([]);
  const [viewMode,    setViewMode]    = useState("open"); // "open" or "resolved"
  const [loadingList, setLoadingList] = useState(true);

  const [farmType,    setFarmType]    = useState("");
  const [segment,     setSegment]     = useState("");
  const [category,    setCategory]    = useState("");
  const [complaint,   setComplaint]   = useState("");
  const [rootCause,   setRootCause]   = useState("");
  const [description, setDescription] = useState("");
  const [reportedDate,setReportedDate]= useState(todayStr());
  const [rootCausesList, setRootCausesList] = useState(ROOT_CAUSE_LIBRARY);

  const [resID, setResID] = useState(null);
  const [resReason, setResReason] = useState("");

  useEffect(() => {
    async function loadRootCauses() {
      try {
        const rc = await getComplaintRootCauses();
        if (rc && Array.isArray(rc)) {
          const mapped = Array.from(new Set(rc.map(item => item.RootCause).filter(Boolean)));
          if (mapped.length > 0) setRootCausesList(mapped);
        }
      } catch (e) {
        console.warn("Failed to load root causes from API, using fallback:", e);
      }
    }
    loadRootCauses();
  }, []);

  const segments    = useMemo(() => getSegments(farmType), [farmType]);
  const categories  = useMemo(() => getCategories(farmType), [farmType]);
  const complaints  = useMemo(() => getComplaints(farmType, category), [farmType, category]);

  const resetForm = useCallback(() => {
    setFarmType(""); setSegment(""); setCategory(""); setComplaint("");
    setRootCause(""); setDescription(""); setReportedDate(todayStr());
  }, []);

  const refreshOpenList = useCallback(async () => {
    if (!user?.enrollId) return;
    setLoadingList(true);
    try {
      const all = await getAllComplaints();
      console.log("ComplaintScreen: Fetched total", all.length, "complaints");

      const isAdmin =
        String(user?.role || user?.Role || "").toLowerCase().includes('admin') ||
        user?.isAdmin === true ||
        user?.enrollId === 306007;

      // Filter based on role: Admin sees all, FieldUser sees only their own
      const userComplaints = all.filter(c => {
        if (isAdmin) return true;
        const creatorId = String(c.DoctorID || c.CreatedBy || c.RaisedByUserID || c.intEnroll || c.RaisedBy || "");
        return creatorId === String(user.enrollId);
      });

      console.log(`ComplaintScreen: After filtering for user ${user.enrollId} (isAdmin: ${isAdmin}), kept ${userComplaints.length} of ${all.length}`);

      const resolved = userComplaints.filter(c => {
        // Resolved if explicitly false, 0, or '0' OR if status is Resolved OR if there is a Resolution
        const isRes = c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' ||
                      String(c.IsActive).toLowerCase() === 'false' ||
                      c.Status === "Resolved" || (c.Resolution && c.Resolution !== "");
        return isRes;
      });

      const open = userComplaints.filter(c => {
        // Active if not resolved
        const isRes = c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' ||
                      String(c.IsActive).toLowerCase() === 'false' ||
                      c.Status === "Resolved" || (c.Resolution && c.Resolution !== "");
        return !isRes;
      });

      console.log(`ComplaintScreen: Split into ${open.length} Open and ${resolved.length} Resolved`);
      if (resolved.length > 0) console.log("ComplaintScreen: Sample resolved object:", resolved[0]);

      // Sort newest first
      const sortByDate = (a, b) => {
        const dateA = new Date(a.ComplaintDate || a.dtReported || a.CreatedAt || a.OpenDate || 0);
        const dateB = new Date(b.ComplaintDate || b.dtReported || b.CreatedAt || b.OpenDate || 0);
        return dateB - dateA;
      };

      setOpenList(open.sort(sortByDate));
      setResolvedList(resolved.sort(sortByDate));
    } catch (e) {
      console.warn("ComplaintScreen: Failed to refresh list:", e);
    } finally {
      setLoadingList(false);
    }
  }, [user]);

  useEffect(() => { refreshOpenList(); }, [refreshOpenList]);

  const handleSubmit = useCallback(async () => {
    if (!user?.enrollId) { toastRef.current?.show("Not signed in", "err"); return; }
    if (!farmType || !category || !complaint) {
      toastRef.current?.show("Farm type, category and complaint are required", "err"); return;
    }
    setSaving(true);
    try {
      console.log("ComplaintScreen: Submitting payload:", {
        intEnroll: user.enrollId,
        strDoctorName: user.fullName || "",
        strFarmType: farmType,
        strSegment: segment || null,
        strCategory: category,
        strComplaint: complaint,
        strRootCause: rootCause || null,
        strDescription: description || null,
        dtReported: reportedDate,
        strZoneName: user.zoneName || "HQ",
      });

      // Submit to the external API
      const result = await saveComplaint({
        intEnroll: user.enrollId,
        strDoctorName: user.fullName || "",
        strFarmType: farmType,
        strSegment: segment || null,
        strCategory: category,
        strComplaint: complaint,
        strRootCause: rootCause || null,
        strDescription: description || null,
        dtReported: reportedDate,
        strZoneName: user.zoneName || "HQ",
      });

      console.log("ComplaintScreen: Save result:", result);

      toastRef.current?.show("Complaint registered", "ok");
      resetForm();
      await refreshOpenList();
    } catch (e) {
      toastRef.current?.show(e.message || "Failed to save", "err");
    } finally {
      setSaving(false);
    }
  }, [user, farmType, segment, category, complaint, rootCause, description, reportedDate, resetForm, refreshOpenList]);

  const handleResolve = useCallback(async () => {
    if (!resReason.trim()) {
      toastRef.current?.show("Please provide a resolution reason", "err");
      return;
    }
    try {
      // resID will now be the intAutoID if possible
      await updateComplaint(resID, {
        IsActive: 0,
        resolution: resReason.trim()
      });
      toastRef.current?.show("Complaint resolved", "ok");
      setResID(null);
      setResReason("");
      await refreshOpenList();
    } catch (e) {
      toastRef.current?.show(e.message || "Could not resolve", "err");
    }
  }, [refreshOpenList, resID, resReason]);

  const insets2 = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View>
        <ScreenHeader
          title="Complaint Register"
          sub={user ? `${user.fullName} · Enrol #${user.enrollId}` : "Farm complaints · root cause tracking"}
          icon={<Ionicons name="flag-outline" size={22} color="#fff" />}
          badge={openList.length > 0 ? "edit" : "new"}
        />
      </View>

      <ScrollView contentContainerStyle={[S.scroll, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        <FadeIn>
          <View style={S.modeRow}>
            <TouchableOpacity style={[S.modeBtn, viewMode === "open" && S.modeBtnOn]} onPress={() => setViewMode("open")}>
              <Text style={[S.modeBtnText, viewMode === "open" && S.modeBtnTextOn]}>Open ({openList.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.modeBtn, viewMode === "resolved" && S.modeBtnOn]} onPress={() => setViewMode("resolved")}>
              <Text style={[S.modeBtnText, viewMode === "resolved" && S.modeBtnTextOn]}>Resolved ({resolvedList.length})</Text>
            </TouchableOpacity>
          </View>

          {viewMode === "open" ? (
            <>
              {openList.length > 0 && (
                <>
                  <SectionDivider label={`Pending Resolution`} />
                  {openList.map((c) => (
                    <View key={c.intAutoID || c.ComplaintID || c.id} style={cs.complaintCard}>
                      <View style={{ flex: 1 }}>
                        <View style={cs.breadcrumbRow}>
                          <Text style={cs.breadcrumb}>{c.FarmTypeName}</Text>
                          {c.ComplaintSegment ? <Text style={cs.breadcrumbSep}>›</Text> : null}
                          {c.ComplaintSegment ? <Text style={cs.breadcrumb}>{c.ComplaintSegment}</Text> : null}
                          <Text style={cs.breadcrumbSep}>›</Text>
                          <Text style={cs.breadcrumb}>{c.ComplaintType}</Text>
                        </View>
                        <Text style={cs.complaintTitle}>{c.ComplaintName || c.strComplaint || c.Subject || "No Title"}</Text>
                        {c.RootCause ? <Text style={cs.rootCause}>Root cause: {c.RootCause}</Text> : null}
                        <Text style={cs.reportedDate}>Reported {c.ComplaintDate ? c.ComplaintDate.split('T')[0] : (c.dtReported || "N/A")}</Text>

                        {resID === (c.intAutoID || c.ComplaintID) && (
                          <FadeIn style={{ marginTop: 12 }}>
                            <FormField
                              label="Resolution Details"
                              value={resReason}
                              onChangeText={setResReason}
                              placeholder="Describe how it was resolved..."
                              multiline
                              required
                            />
                            <View style={S.btnRow}>
                              <GhostBtn label="Cancel" onPress={() => { setResID(null); setResReason(""); }} />
                              <PrimaryBtn label="Submit Resolution" onPress={handleResolve} />
                            </View>
                          </FadeIn>
                        )}
                      </View>
                      {!resID && (
                        (String(user?.role || user?.Role || "").toLowerCase().includes('admin') || user?.isAdmin === true || user?.enrollId === 306007) ||
                        String(c.DoctorID || c.CreatedBy || c.RaisedByUserID || c.intEnroll || c.RaisedBy || "") === String(user?.enrollId)
                      ) && (
                        <TouchableOpacity style={cs.resolveBtn} onPress={() => setResID(c.intAutoID || c.ComplaintID)}>
                          <Text style={cs.resolveBtnText}>Resolve</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </>
              )}

              <SectionDivider label="Register New Complaint" />
              {/* Existing form fields... */}

          <TagLabel text="Step 1 · Farm Type" />
          <PillGroup
            items={FARM_TYPES}
            selected={farmType}
            onSelect={(v) => { setFarmType(v); setSegment(""); setCategory(""); setComplaint(""); }}
          />

          {segments && farmType ? (
            <>
              <TagLabel text="Step 2 · Segment / Stage" />
              <PillGroup items={segments} selected={segment} onSelect={setSegment} />
            </>
          ) : null}

          {farmType ? (
            <PickerField
              label="Complaint Category"
              value={category}
              onValueChange={(v) => { setCategory(v); setComplaint(""); }}
              items={categories}
              required
            />
          ) : null}

          {category ? (
            <PickerField
              label="Complaint"
              value={complaint}
              onValueChange={setComplaint}
              items={complaints}
              required
            />
          ) : null}

          {complaint ? (
            <PickerField
              label="Root Cause (optional)"
              value={rootCause}
              onValueChange={setRootCause}
              items={rootCausesList}
            />
          ) : null}

          <FormField
            label="Additional notes"
            value={description}
            onChangeText={setDescription}
            placeholder="Optional details about the complaint"
            multiline
          />

          <FormField
            label="Reported date"
            value={reportedDate}
            onChangeText={setReportedDate}
            placeholder="YYYY-MM-DD"
          />

          <WarnBanner show={!!farmType && !category} text="Select a complaint category to continue" />

          <View style={S.btnRow}>
            <GhostBtn label="Reset form" onPress={resetForm} />
            <PrimaryBtn label="Register complaint" onPress={handleSubmit} loading={saving} disabled={!farmType || !category || !complaint} />
          </View>
        </>
      ) : (
        <>
              <SectionDivider label="Resolution History" />
              {resolvedList.length === 0 ? (
                <EmptyState icon={<Ionicons name="checkmark-circle-outline" size={32} color={colors.textTer} />} title="No resolved complaints" sub="Completed issues will appear here" />
              ) : (
                resolvedList.map((c, i) => (
                  <View key={c.intAutoID || c.ComplaintID || i} style={[cs.complaintCard, { borderColor: colors.successBorder, borderLeftColor: colors.success }]}>
                    <View style={cs.breadcrumbRow}>
                      <Text style={cs.breadcrumb}>{c.FarmTypeName}{c.ComplaintSegment ? ` › ${c.ComplaintSegment}` : ""} › {c.ComplaintType}</Text>
                    </View>
                    <Text style={cs.complaintTitle}>{c.ComplaintName || c.strComplaint || c.Subject || "No Title"}</Text>

                    {/* Display Description - check all possible backend keys */}
                    {(c.ComplaintDescription || c.Description || c.strDescription || c.Subject) ? (
                      <View style={cs.descBox}>
                        <Text style={cs.resLabel}>Problem Description:</Text>
                        <Text style={cs.descText}>{c.ComplaintDescription || c.Description || c.strDescription || c.Subject}</Text>
                      </View>
                    ) : null}

                    {/* Display Resolution */}
                    <View style={cs.resBox}>
                      <Text style={cs.resLabel}>Resolution / Actions taken:</Text>
                      <Text style={cs.resText}>{c.Resolution || c.resolve || "Issue resolved successfully"}</Text>
                    </View>
                    <Text style={cs.reportedDate}>
                      Resolved on: {c.CloseDate ? c.CloseDate.split('T')[0] : (c.UpdatedDate ? c.UpdatedDate.split('T')[0] : "Recently")}
                    </Text>
                  </View>
                ))
              )}
            </>
          )}
        </FadeIn>
      </ScrollView>

      <Toast ref={toastRef} />
    </KeyboardAvoidingView>
  );
}

const cs = StyleSheet.create({
  complaintCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.dangerBorder, borderLeftWidth: 3, borderLeftColor: colors.danger },
  breadcrumbRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 4 },
  breadcrumb:    { fontSize: 10.5, color: colors.textTer, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  breadcrumbSep: { fontSize: 10.5, color: colors.textTer, marginHorizontal: 4 },
  complaintTitle:{ fontSize: 14.5, fontWeight: "700", color: colors.textPrimary, marginTop: 2 },
  rootCause:     { fontSize: 12, color: colors.textSec, marginTop: 4 },
  reportedDate:  { fontSize: 11, color: colors.textTer, marginTop: 6, fontFamily: "monospace" },
  resolveBtn:    { marginTop: 10, alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.successBg, borderWidth: 1, borderColor: colors.successBorder },
  resolveBtnText:{ fontSize: 12, fontWeight: "700", color: colors.success },
  resBox:        { backgroundColor: colors.surfaceUp, borderRadius: 10, padding: 10, marginTop: 10, borderLeftWidth: 3, borderLeftColor: colors.success },
  descBox:       { backgroundColor: colors.surfaceUp, borderRadius: 10, padding: 10, marginTop: 10, borderLeftWidth: 3, borderLeftColor: colors.textTer },
  resLabel:      { fontSize: 10, fontWeight: "800", color: colors.textSec, textTransform: "uppercase", marginBottom: 3 },
  resText:       { fontSize: 13, color: colors.textPrimary, lineHeight: 18 },
  descText:      { fontSize: 13, color: colors.textSec, lineHeight: 18 },
});
