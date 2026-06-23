// src/screens/DoctorsScreen.js
import React, { useState, useRef, useCallback } from "react";
import {
  View, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, saveDoctor } from "../api";
import { S, ZONES, colors } from "../theme";
import {
  FadeIn, SearchPanel, TagLabel, FormField, PickerField,
  ModeToggle, WarnBanner, PrimaryBtn, GhostBtn,
  Toast, HeaderBand,
} from "../components";

export default function DoctorsScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);

  const [mode,          setMode]          = useState("new");
  const [badge,         setBadge]         = useState("new");
  const [searching,     setSearching]     = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [searchId,      setSearchId]      = useState("");
  const [zone,          setZone]          = useState("");
  const [enroll,        setEnroll]        = useState("");
  const [name,          setName]          = useState("");
  const [showOverwrite, setShowOverwrite] = useState(false);

  const clearForm = useCallback(() => {
    setSearchId(""); setZone(""); setEnroll(""); setName("");
    setShowOverwrite(false); setBadge("new");
  }, []);

  const handleModeSwitch = useCallback((m) => { setMode(m); clearForm(); }, [clearForm]);

  const checkEnrollExists = useCallback(async (val) => {
    setEnroll(val);
    if (mode !== "new" || !val || val.length < 4) { setShowOverwrite(false); return; }
    try {
      const docs = await getAllDoctors();
      setShowOverwrite(docs.some(d => String(d.intEnroll) === String(val)));
    } catch (_) {}
  }, [mode]);

  const lookupDoctor = useCallback(async () => {
    if (!searchId.trim()) { toastRef.current?.show("Enter an Enrol ID first", "err"); return; }
    setSearching(true);
    try {
      const docs = await getAllDoctors();
      const row  = docs.find(d => String(d.intEnroll) === String(searchId.trim()));
      if (!row) { toastRef.current?.show("No doctor found for Enrol ID " + searchId, "err"); return; }
      setZone(row.strZone || "");
      setEnroll(String(row.intEnroll));
      setName(row.strDoctorName || "");
      setBadge("edit");
      toastRef.current?.show("Doctor loaded — edit and save", "ok");
    } catch (e) {
      toastRef.current?.show("Error: " + e.message, "err");
    } finally { setSearching(false); }
  }, [searchId]);

  const handleSave = useCallback(async () => {
    if (!zone || !enroll || !name.trim()) {
      toastRef.current?.show("Zone, Enrol ID and Name required", "err"); return;
    }
    setSaving(true);
    try {
      await saveDoctor({ intEnroll: Number(enroll), strDoctorName: name.trim(), strZone: zone });
      setBadge("ok");
      toastRef.current?.show(mode === "new" ? "Doctor added!" : "Doctor updated!", "ok");
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSaving(false); }
  }, [zone, enroll, name, mode]);

  return (
    <KeyboardAvoidingView
      style={S.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header — safe area top padding baked in */}
      <View style={{ paddingTop: insets.top }}>
        <HeaderBand
          color={colors.lime}
          icon="🩺"
          title="Doctors"
          sub="Enrollment & field records"
          badge={badge}
        />
      </View>

      <ScrollView
        contentContainerStyle={[S.scroll, { paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Mode toggle */}
        <FadeIn delay={80}>
          <View style={S.card}>
            <View style={S.cardBody}>
              <ModeToggle
                options={[{ label: "+ New Doctor", value: "new" }, { label: "Edit Existing", value: "edit" }]}
                selected={mode}
                onSelect={handleModeSwitch}
              />

              {mode === "edit" && (
                <FadeIn delay={40}>
                  <SearchPanel
                    title="Find doctor by Enrol ID"
                    value={searchId}
                    onChangeText={setSearchId}
                    onSearch={lookupDoctor}
                    onClear={clearForm}
                    loading={searching}
                  />
                </FadeIn>
              )}

              <WarnBanner
                show={showOverwrite && mode === "new"}
                text="This Enrol ID already exists — saving will overwrite the existing record."
              />

              <FadeIn delay={120}>
                <TagLabel text="Doctor Details" />
                <PickerField label="Zone" value={zone} onValueChange={setZone} items={ZONES} required />
                <FormField
                  label="Enrol ID"
                  value={enroll}
                  onChangeText={checkEnrollExists}
                  keyboardType="numeric"
                  placeholder="e.g. 565609"
                  required
                />
                <FormField
                  label="Doctor Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Dr. Full Name"
                  required
                />
              </FadeIn>

              <View style={S.btnRow}>
                <GhostBtn label="Clear" onPress={clearForm} />
                <PrimaryBtn label="Save Doctor" onPress={handleSave} loading={saving} />
              </View>
            </View>
          </View>
        </FadeIn>
      </ScrollView>

      <Toast ref={toastRef} />
    </KeyboardAvoidingView>
  );
}
