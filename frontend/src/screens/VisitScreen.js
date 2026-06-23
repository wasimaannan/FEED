// src/screens/VisitScreen.js
import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFarmsByEnroll, getAllDoctors, saveVisit, calcWeek } from "../api";
import { S, colors } from "../theme";
import {
  FadeIn, SearchPanel, TagLabel, SectionDivider,
  LockedField, FormField, FirmTypePills,
  InfoBanner, ValidationBox, TsPill,
  PrimaryBtn, GhostBtn, Toast, EmptyState, HeaderBand,
} from "../components";

export default function VisitScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);

  const [badge,        setBadge]        = useState("new");
  const [searching,    setSearching]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [searchId,     setSearchId]     = useState("");
  const [doctor,       setDoctor]       = useState(null);
  const [allFirmTypes, setAllFirmTypes] = useState([]);
  const [selFt,        setSelFt]        = useState("");
  const [showWeek,     setShowWeek]     = useState(false);

  const [date,         setDate]         = useState("");
  const [week,         setWeek]         = useState("");
  const [visitTarget,  setVisitTarget]  = useState("");
  const [newVisit,     setNewVisit]     = useState("");
  const [repVisit,     setRepVisit]     = useState("");
  const [problemSolve, setProblemSolve] = useState("");
  const [newOnboard,   setNewOnboard]   = useState("");
  const [savedAt,      setSavedAt]      = useState("");
  const [showTs,       setShowTs]       = useState(false);

  const subTotal    = useMemo(() => (Number(newVisit)||0)+(Number(repVisit)||0)+(Number(problemSolve)||0), [newVisit, repVisit, problemSolve]);
  const subTotalErr = useMemo(() => { const t = Number(visitTarget)||0; return t > 0 && subTotal > t; }, [visitTarget, subTotal]);
  const valErrors   = useMemo(() => subTotalErr ? [`New+Rep+Problem (${subTotal}) exceeds Visit Target (${Number(visitTarget)||0})`] : [], [subTotalErr, subTotal, visitTarget]);

  const handleDateChange = useCallback((val) => {
    setDate(val); setShowTs(false);
    const w = calcWeek(val);
    setWeek(w !== null ? String(w) : "");
  }, []);

  const clearVisitFields = useCallback(() => {
    setDate(""); setWeek("");
    setVisitTarget(""); setNewVisit(""); setRepVisit("");
    setProblemSolve(""); setNewOnboard("");
    setSavedAt(""); setShowTs(false);
  }, []);

  const clearVisit = useCallback(() => {
    setSearchId(""); setDoctor(null); setAllFirmTypes([]);
    setSelFt(""); setShowWeek(false); clearVisitFields(); setBadge("new");
  }, [clearVisitFields]);

  const lookupVisit = useCallback(async () => {
    if (!searchId.trim()) { toastRef.current?.show("Enter an Enrol ID first", "err"); return; }
    setSearching(true);
    try {
      let rows = [];
      try { rows = await getFarmsByEnroll(searchId.trim()); } catch (_) {}

      if (rows.length) {
        const first = rows[0];
        const types = [...new Set(rows.map(r => r.strFirmType).filter(Boolean))];
        setDoctor({ enroll: first.enroll, name_of_doctor: first.name_of_doctor, zone: first.zone, strFirmType: "" });
        setAllFirmTypes(types);
        setSelFt(""); clearVisitFields();
        if (types.length === 1) {
          setSelFt(types[0]);
          setDoctor(d => ({ ...d, strFirmType: types[0] }));
          setShowWeek(true);
          toastRef.current?.show("Doctor loaded — pick a date", "ok");
        } else {
          setShowWeek(false);
          toastRef.current?.show(`${types.length} firm types — pick one`, "warn");
        }
        setBadge("new");
        return;
      }

      const docs = await getAllDoctors();
      const dRow = docs.find(d => String(d.intEnroll) === String(searchId.trim()));
      if (dRow) {
        setDoctor({ enroll: dRow.intEnroll, name_of_doctor: dRow.strDoctorName, zone: dRow.strZone, strFirmType: "" });
        setAllFirmTypes([]); setSelFt(""); clearVisitFields();
        setShowWeek(true); setBadge("new");
        toastRef.current?.show("Doctor loaded — pick a date", "ok");
        return;
      }
      toastRef.current?.show("No record found for Enrol ID " + searchId, "err");
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSearching(false); }
  }, [searchId, clearVisitFields]);

  const selectFirmType = useCallback((ft) => {
    setSelFt(ft);
    setDoctor(d => ({ ...d, strFirmType: ft }));
    setShowWeek(true); clearVisitFields();
    toastRef.current?.show(`Firm type: ${ft} — pick a date`, "ok");
  }, [clearVisitFields]);

  const handleSave = useCallback(async () => {
    if (!doctor)        { toastRef.current?.show("No doctor loaded", "err"); return; }
    if (!date || !week) { toastRef.current?.show("Date is required", "err"); return; }
    if (subTotalErr)    { toastRef.current?.show("Fix sub-target error first", "err"); return; }
    setSaving(true);
    try {
      const result = await saveVisit({
        enroll:                  doctor.enroll,
        name_of_doctor:          doctor.name_of_doctor,
        zone:                    doctor.zone,
        strFirmType:             doctor.strFirmType || selFt,
        date,
        week:                    Number(week),
        intVisitTarget:          Number(visitTarget)  || 0,
        intNewVisitTarget:       Number(newVisit)     || 0,
        intRepVisitTarget:       Number(repVisit)     || 0,
        intProblemSolveTarget:   Number(problemSolve) || 0,
        intNewFirmOnboardTarget: Number(newOnboard)   || 0,
      });
      const ts = result.createdAt
        ? new Date(result.createdAt).toLocaleString("en-GB")
        : new Date().toLocaleString("en-GB");
      setSavedAt("Saved at: " + ts);
      setShowTs(true); setBadge("ok");
      toastRef.current?.show("Entry saved!", "ok");
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSaving(false); }
  }, [doctor, date, week, visitTarget, newVisit, repVisit, problemSolve, newOnboard, selFt, subTotalErr]);

  return (
    <KeyboardAvoidingView
      style={S.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ paddingTop: insets.top }}>
        <HeaderBand
          color="#7EB8FF"
          icon="📋"
          title="Visit Targets"
          sub="Weekly entries · auto-timestamped"
          badge={badge}
        />
      </View>

      <ScrollView
        contentContainerStyle={[S.scroll, { paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={60}>
          <View style={S.card}>
            <View style={S.cardBody}>
              <SearchPanel
                title="Find Enrol ID"
                value={searchId}
                onChangeText={setSearchId}
                onSearch={lookupVisit}
                onClear={clearVisit}
                loading={searching}
              />

              {!doctor ? (
                <EmptyState
                  icon="📋"
                  title="Search to begin"
                  sub="Enter an Enrol ID above and tap Go"
                />
              ) : (
                <FadeIn delay={40}>
                  <TagLabel text="Doctor Info" />
                  <View style={S.grid2}>
                    <LockedField label="Enrol ID" value={String(doctor.enroll)} mono style={{ flex: 1 }} />
                    <LockedField label="Zone"      value={doctor.zone}           style={{ flex: 1 }} />
                  </View>
                  <LockedField label="Doctor Name" value={doctor.name_of_doctor} />

                  <FirmTypePills types={allFirmTypes} selected={selFt} onSelect={selectFirmType} />

                  {showWeek && (
                    <FadeIn delay={80}>
                      <SectionDivider label="Date & Week" />
                      <View style={S.grid2}>
                        <FormField
                          label="Date"
                          value={date}
                          onChangeText={handleDateChange}
                          placeholder="YYYY-MM-DD"
                          keyboardType="numeric"
                          hint="e.g. 2026-05-03"
                          required
                          style={{ flex: 1 }}
                        />
                        <FormField
                          label="Week #"
                          value={week}
                          editable={false}
                          placeholder="—"
                          hint="Auto from date"
                          style={{ flex: 1 }}
                        />
                      </View>

                      <FadeIn delay={120}>
                        <SectionDivider label="Visit Targets" />
                        <InfoBanner text="New + Rep + Problem must not exceed Visit Target." />
                        <ValidationBox errors={valErrors} />

                        <FormField
                          label="Visit Target"
                          value={visitTarget}
                          onChangeText={setVisitTarget}
                          keyboardType="numeric"
                          placeholder="0"
                        />

                        <View style={S.grid3}>
                          <View style={S.grid3item}>
                            <FormField label="New Visit"     value={newVisit}     onChangeText={setNewVisit}     keyboardType="numeric" placeholder="0" />
                          </View>
                          <View style={S.grid3item}>
                            <FormField label="Rep Visit"     value={repVisit}     onChangeText={setRepVisit}     keyboardType="numeric" placeholder="0" />
                          </View>
                          <View style={S.grid3item}>
                            <FormField label="Problem Solve" value={problemSolve} onChangeText={setProblemSolve} keyboardType="numeric" placeholder="0" />
                          </View>
                        </View>

                        <FormField
                          label="New Farm Onboard Target"
                          value={newOnboard}
                          onChangeText={setNewOnboard}
                          keyboardType="numeric"
                          placeholder="0"
                        />

                        <View style={S.subTotalRow}>
                          <Text style={S.subTotalText}>Sub-total (New+Rep+Problem): {subTotal}</Text>
                          {subTotalErr && <Text style={S.subTotalErr}> — exceeds target!</Text>}
                        </View>

                        <TsPill timestamp={savedAt} show={showTs} />

                        <View style={S.btnRow}>
                          <GhostBtn label="Clear" onPress={clearVisit} />
                          <PrimaryBtn label="Save Entry" onPress={handleSave} loading={saving} />
                        </View>
                      </FadeIn>
                    </FadeIn>
                  )}
                </FadeIn>
              )}
            </View>
          </View>
        </FadeIn>
      </ScrollView>

      <Toast ref={toastRef} />
    </KeyboardAvoidingView>
  );
}
