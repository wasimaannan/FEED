// src/screens/ComplaintScreen.js
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity, StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, S } from "../theme";
import {
  FadeIn, ScreenHeader, TagLabel, FormField,
  PickerField, PillGroup, WarnBanner, PrimaryBtn,
  GhostBtn, Toast, SectionDivider, EmptyState,
} from "../components";
import { useAuth } from "../context/AuthContext";

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

// ── Local storage (no backend) ──────────────────────────────────
const STORAGE_KEY = "feed_complaints_v1";
const todayStr = () => new Date().toISOString().split("T")[0];

async function loadAllComplaints() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
async function saveAllComplaints(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function ComplaintScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
  const { user }  = useAuth();

  const [saving,      setSaving]      = useState(false);
  const [openList,    setOpenList]    = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [farmType,    setFarmType]    = useState("");
  const [segment,     setSegment]     = useState("");
  const [category,    setCategory]    = useState("");
  const [complaint,   setComplaint]   = useState("");
  const [rootCause,   setRootCause]   = useState("");
  const [description, setDescription] = useState("");
  const [reportedDate,setReportedDate]= useState(todayStr());

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
    const all = await loadAllComplaints();
    setOpenList(all.filter(c => String(c.intEnroll) === String(user.enrollId) && !c.dtResolved));
    setLoadingList(false);
  }, [user]);

  useEffect(() => { refreshOpenList(); }, [refreshOpenList]);

  const handleSubmit = useCallback(async () => {
    if (!user?.enrollId) { toastRef.current?.show("Not signed in", "err"); return; }
    if (!farmType || !category || !complaint) {
      toastRef.current?.show("Farm type, category and complaint are required", "err"); return;
    }
    setSaving(true);
    try {
      const all = await loadAllComplaints();
      const newEntry = {
        id: `c_${Date.now()}`,
        intEnroll: user.enrollId,
        strDoctorName: user.fullName || "",
        strFarmType: farmType,
        strSegment: segment || null,
        strCategory: category,
        strComplaint: complaint,
        strRootCause: rootCause || null,
        strDescription: description || null,
        dtReported: reportedDate,
        dtResolved: null,
      };
      await saveAllComplaints([newEntry, ...all]);
      toastRef.current?.show("Complaint registered", "ok");
      resetForm();
      await refreshOpenList();
    } catch (e) {
      toastRef.current?.show(e.message || "Failed to save", "err");
    } finally {
      setSaving(false);
    }
  }, [user, farmType, segment, category, complaint, rootCause, description, reportedDate, resetForm, refreshOpenList]);

  const handleResolve = useCallback(async (id) => {
    try {
      const all = await loadAllComplaints();
      const updated = all.map(c => c.id === id ? { ...c, dtResolved: todayStr() } : c);
      await saveAllComplaints(updated);
      toastRef.current?.show("Marked resolved", "ok");
      await refreshOpenList();
    } catch (e) {
      toastRef.current?.show(e.message || "Could not resolve", "err");
    }
  }, [refreshOpenList]);

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View>
        <ScreenHeader
          title="Complaint Register"
          sub={user ? `${user.fullName} · Enrol #${user.enrollId}` : "Farm complaints · root cause tracking"}
          icon="📢"
          badge={openList.length > 0 ? "edit" : "new"}
        />
      </View>

      <ScrollView contentContainerStyle={[S.scroll, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        <FadeIn>
          {openList.length > 0 && (
            <>
              <SectionDivider label={`Open Complaints (${openList.length})`} />
              {openList.map((c) => (
                <View key={c.id} style={cs.complaintCard}>
                  <View style={{ flex: 1 }}>
                    <View style={cs.breadcrumbRow}>
                      <Text style={cs.breadcrumb}>{c.strFarmType}</Text>
                      {c.strSegment ? <Text style={cs.breadcrumbSep}>›</Text> : null}
                      {c.strSegment ? <Text style={cs.breadcrumb}>{c.strSegment}</Text> : null}
                      <Text style={cs.breadcrumbSep}>›</Text>
                      <Text style={cs.breadcrumb}>{c.strCategory}</Text>
                    </View>
                    <Text style={cs.complaintTitle}>{c.strComplaint}</Text>
                    {c.strRootCause ? <Text style={cs.rootCause}>Root cause: {c.strRootCause}</Text> : null}
                    <Text style={cs.reportedDate}>Reported {c.dtReported}</Text>
                  </View>
                  <TouchableOpacity style={cs.resolveBtn} onPress={() => handleResolve(c.id)}>
                    <Text style={cs.resolveBtnText}>Mark resolved</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          <SectionDivider label="Register New Complaint" />

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
              items={ROOT_CAUSE_LIBRARY}
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
});
