// src/screens/FarmsScreen.js
import React, { useState, useRef, useCallback } from "react";
import {
  View, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFarmsByEnroll, saveFarm } from "../api";
import { S, FIRM_TYPES, colors } from "../theme";
import {
  FadeIn, SearchPanel, TagLabel, SectionDivider,
  LockedField, FormField, PickerField,
  FirmTypePills, InfoBanner, ValidationBox,
  PrimaryBtn, GhostBtn, Toast, EmptyState, HeaderBand,
} from "../components";

export default function FarmsScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);

  const [badge,        setBadge]        = useState("new");
  const [searching,    setSearching]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [searchId,     setSearchId]     = useState("");

  const [record,       setRecord]       = useState(null);
  const [allFirmTypes, setAllFirmTypes] = useState([]);
  const [selFt,        setSelFt]        = useState("");

  const [firmType,     setFirmType]     = useState("");
  const [activeFarm,   setActiveFarm]   = useState("");
  const [underService, setUnderService] = useState("");
  const [underTarget,  setUnderTarget]  = useState("");
  const [errors,       setErrors]       = useState([]);

  const validateNums = useCallback((af, us, ut) => {
    const a = Number(af) || 0, s = Number(us) || 0, t = Number(ut) || 0;
    const errs = [];
    if (a > 0 && s > a) errs.push(`Under Service (${s}) exceeds Active Farms (${a})`);
    if (a > 0 && t > a) errs.push(`Under Service Target (${t}) exceeds Active Farms (${a})`);
    setErrors(errs);
  }, []);

  const loadFarmRow = useCallback((row) => {
    setFirmType(row.strFirmType || "");
    setActiveFarm(row.intActiveFarm   != null ? String(row.intActiveFarm)               : "");
    setUnderService(row.intUnderService != null ? String(row.intUnderService)            : "");
    setUnderTarget(row.intUnderServiceTarget != null ? String(row.intUnderServiceTarget) : "");
    validateNums(row.intActiveFarm, row.intUnderService, row.intUnderServiceTarget);
  }, [validateNums]);

  const lookupFarm = useCallback(async () => {
    if (!searchId.trim()) { toastRef.current?.show("Enter an Enrol ID first", "err"); return; }
    setSearching(true);
    try {
      const rows  = await getFarmsByEnroll(searchId.trim());
      const first = rows[0];
      const types = [...new Set(rows.map(r => r.strFirmType).filter(Boolean))];

      setRecord({ enroll: first.enroll, name_of_doctor: first.name_of_doctor, zone: first.zone, allRows: rows });
      setAllFirmTypes(types);
      setSelFt("");
      setBadge("edit");

      if (types.length === 1) {
        setSelFt(types[0]);
        loadFarmRow(rows[0]);
        toastRef.current?.show("Record loaded — update and save", "ok");
      } else {
        setFirmType(""); setActiveFarm(""); setUnderService(""); setUnderTarget(""); setErrors([]);
        toastRef.current?.show(`${types.length} firm types found — select one`, "warn");
      }
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSearching(false); }
  }, [searchId, loadFarmRow]);

  const selectFirmType = useCallback((ft) => {
    setSelFt(ft);
    const row = record?.allRows.find(r => r.strFirmType === ft);
    if (row) loadFarmRow(row);
  }, [record, loadFarmRow]);

  const clearFarm = useCallback(() => {
    setSearchId(""); setRecord(null); setAllFirmTypes([]); setSelFt("");
    setFirmType(""); setActiveFarm(""); setUnderService(""); setUnderTarget("");
    setErrors([]); setBadge("new");
  }, []);

  const handleSave = useCallback(async () => {
    if (!record)    { toastRef.current?.show("No record loaded — search first", "err"); return; }
    if (!firmType)  { toastRef.current?.show("Select a Firm Type first", "err"); return; }
    if (errors.length) { toastRef.current?.show("Fix errors before saving", "err"); return; }
    setSaving(true);
    try {
      await saveFarm({
        enroll:                record.enroll,
        name_of_doctor:        record.name_of_doctor,
        zone:                  record.zone,
        strFirmType:           firmType,
        intActiveFarm:         Number(activeFarm)   || 0,
        intUnderService:       Number(underService) || 0,
        intUnderServiceTarget: Number(underTarget)  || 0,
      });
      setBadge("ok");
      toastRef.current?.show("Farm record updated!", "ok");
    } catch (e) {
      toastRef.current?.show(e.message, "err");
    } finally { setSaving(false); }
  }, [record, firmType, activeFarm, underService, underTarget, errors]);

  return (
    <KeyboardAvoidingView
      style={S.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>
        <HeaderBand navigation={navigation}
          color={colors.wheat}
          icon="🌿"
          title="Farms"
          sub="Under-service tracking"
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
                title="Find by Enrol ID"
                value={searchId}
                onChangeText={setSearchId}
                onSearch={lookupFarm}
                onClear={clearFarm}
                loading={searching}
              />

              {!record ? (
                <EmptyState
                  icon="🌾"
                  title="No record loaded"
                  sub="Enter an Enrol ID above to load the farm record"
                />
              ) : (
                <FadeIn delay={40}>
                  <TagLabel text="Record Info" />
                  <View style={S.grid2}>
                    <LockedField label="Enrol ID" value={String(record.enroll)} mono style={{ flex: 1 }} />
                    <LockedField label="Zone"      value={record.zone}           style={{ flex: 1 }} />
                  </View>
                  <LockedField label="Doctor Name" value={record.name_of_doctor} />

                  <FirmTypePills types={allFirmTypes} selected={selFt} onSelect={selectFirmType} />

                  <FadeIn delay={80}>
                    <SectionDivider label="Editable Fields" />
                    <InfoBanner text="All fields below are editable. Update the values and save." />
                    <ValidationBox errors={errors} />

                    <PickerField
                      label="Firm Type"
                      value={firmType}
                      onValueChange={(val) => {
                        setFirmType(val); setSelFt(val);
                        const row = record.allRows.find(r => r.strFirmType === val);
                        if (row) loadFarmRow(row);
                      }}
                      items={FIRM_TYPES}
                      required
                    />

                    <View style={S.grid3}>
                      <View style={S.grid3item}>
                        <FormField
                          label="Active Farms"
                          value={activeFarm}
                          onChangeText={(v) => { setActiveFarm(v); validateNums(v, underService, underTarget); }}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                      <View style={S.grid3item}>
                        <FormField
                          label="Under Svc"
                          value={underService}
                          onChangeText={(v) => { setUnderService(v); validateNums(activeFarm, v, underTarget); }}
                          keyboardType="numeric"
                          placeholder="0"
                          error={Number(underService) > Number(activeFarm) && Number(activeFarm) > 0 ? "Exceeds" : null}
                        />
                      </View>
                      <View style={S.grid3item}>
                        <FormField
                          label="US Target"
                          value={underTarget}
                          onChangeText={(v) => { setUnderTarget(v); validateNums(activeFarm, underService, v); }}
                          keyboardType="numeric"
                          placeholder="0"
                          error={Number(underTarget) > Number(activeFarm) && Number(activeFarm) > 0 ? "Exceeds" : null}
                        />
                      </View>
                    </View>

                    <View style={S.btnRow}>
                      <GhostBtn label="Clear" onPress={clearFarm} />
                      <PrimaryBtn label="Save Changes" onPress={handleSave} loading={saving} />
                    </View>
                  </FadeIn>
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
