// src/screens/DoctorsScreen.js
import React, { useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { getAllDoctors, saveDoctor } from "../api";
import { S, ZONES } from "../theme";
import {
  SearchPanel, SectionDivider, FormField, PickerField,
  ModeToggle, WarnBanner, PrimaryBtn, GhostBtn, Toast, Badge,
} from "../components";

export default function DoctorsScreen() {
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
      toastRef.current?.show("Zone, Enrol ID and Doctor Name are required", "err"); return;
    }
    setSaving(true);
    try {
      await saveDoctor({ intEnroll: Number(enroll), strDoctorName: name.trim(), strZone: zone });
      setBadge("ok");
      toastRef.current?.show(mode === "new" ? "New doctor added!" : "Doctor updated!", "ok");
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSaving(false); }
  }, [zone, enroll, name, mode]);

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={S.scroll}>
        <View style={S.card}>
          <View style={S.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={S.cardTitle}>Doctor Record</Text>
              <Text style={S.cardDesc}>Add new doctors or edit existing ones</Text>
            </View>
            <Badge mode={badge} />
          </View>
          <View style={S.cardBody}>
            <ModeToggle
              options={[{ label: "+ New Doctor", value: "new" }, { label: "✎ Edit Existing", value: "edit" }]}
              selected={mode}
              onSelect={handleModeSwitch}
            />
            {mode === "edit" && (
              <SearchPanel
                title="Find Existing Doctor"
                value={searchId}
                onChangeText={setSearchId}
                onSearch={lookupDoctor}
                onClear={clearForm}
                loading={searching}
              />
            )}
            <WarnBanner
              show={showOverwrite && mode === "new"}
              text="An existing doctor has this Enrol ID. Saving will update their record."
            />
            <SectionDivider label="Doctor Details" />
            <PickerField label="Zone" value={zone} onValueChange={setZone} items={ZONES} required />
            <FormField label="Enrol ID" value={enroll} onChangeText={checkEnrollExists} keyboardType="numeric" placeholder="e.g. 565609" required />
            <FormField label="Doctor Name" value={name} onChangeText={setName} placeholder="Dr. Full Name" required />
            <View style={S.btnRow}>
              <GhostBtn label="Clear" onPress={clearForm} />
              <PrimaryBtn label="💾  Save Doctor" onPress={handleSave} loading={saving} />
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast ref={toastRef} />
    </KeyboardAvoidingView>
  );
}
