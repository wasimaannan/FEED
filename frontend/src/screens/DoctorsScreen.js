import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getDoctor, saveDoctor, getSettingsZones, getSettingsFarmTypes } from "../api";
import { ZONES, SPECIALIZATIONS, colors } from "../theme";
import { FadeIn, ScreenHeader, SearchPanel, TagLabel, FormField, PickerField, PillGroup, ModeToggle, WarnBanner, PrimaryBtn, GhostBtn, Toast, SectionDivider } from "../components";
import { S } from "../theme";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function DoctorsScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
  const { user } = useAuth();
  const [mode,setMode]=useState("new");
  const [badge,setBadge]=useState("new");
  const [searching,setSearching]=useState(false);
  const [saving,setSaving]=useState(false);
  const [searchId,setSearchId]=useState("");
  const [showOverwrite,setShowOverwrite]=useState(false);
  const [zone,setZone]=useState("");
  const [enroll,setEnroll]=useState("");
  const [name,setName]=useState("");
  const [spec,setSpec]=useState("");
  const [underSvc,setUnderSvc]=useState("");
  const [svcTarget,setSvcTarget]=useState("");

  const [zonesList, setZonesList] = useState(ZONES);
  const [rawZones, setRawZones] = useState([]);
  const [specializationsList, setSpecializationsList] = useState(["Broiler", "Layer", "Cattle", "Sonali"]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const zones = await getSettingsZones();
        if (zones && Array.isArray(zones)) {
          setRawZones(zones);
          const mappedZones = zones.map(z => z.Zone || z.ZoneName || z.zoneName).filter(Boolean);
          if (mappedZones.length > 0) setZonesList(mappedZones);
        }
      } catch (e) {
        console.warn("Failed to load zones dynamically, using fallback:", e);
      }
    }
    loadSettings();
  }, []);

  const clearForm = useCallback(()=>{ setSearchId("");setZone("");setEnroll("");setName("");setSpec("");setUnderSvc("");setSvcTarget("");setShowOverwrite(false);setBadge("new"); },[]);

  const checkEnroll = useCallback(async v=>{
    setEnroll(v);
    if (mode!=="new"||!v||v.length<4){setShowOverwrite(false);return;}
    try { const docs=await getAllDoctors(); setShowOverwrite(docs.some(d => String(d.EnrollID) === String(v))); } catch(_){}
  },[mode]);

  const lookup = useCallback(async () => {
    if (!searchId.trim()) {
      toastRef.current?.show("Enter an Enrol ID first", "err");
      return;
    }

    setSearching(true);

    try {
      const row = await getDoctor(searchId.trim());

      setZone(row.ZoneName || "");
      setEnroll(String(row.EnrollID));
      setName(row.FullName || "");
      setSpec(row.Specialization || "");

      // These columns don't exist yet in SQL
      setUnderSvc("");
      setSvcTarget(String(row.ServiceTarget || ""));

      setBadge("edit");
      toastRef.current?.show("Doctor loaded", "ok");
    } catch (e) {
      toastRef.current?.show("Doctor not found", "err");
    } finally {
      setSearching(false);
    }
  }, [searchId]);

  const handleSave = useCallback(async()=>{
    if (!zone||!enroll||!name.trim()){toastRef.current?.show("Zone, Enrol ID and Name required","err");return;}
    setSaving(true);

    // Find ZoneID from rawZones
    const zoneObj = rawZones.find(z => (z.Zone || z.ZoneName || z.zoneName) === zone);
    const zoneId = zoneObj ? (zoneObj.ZoneID || zoneObj.zoneId) : 0;

    try {
      await saveDoctor({
        intEnroll:Number(enroll),
        strDoctorName:name.trim(),
        strZone:zone,
        ZoneID: zoneId,
        strSpecialization:spec,
        intUnderService:Number(underSvc)||0,
        intServiceTarget:Number(svcTarget)||0,
        CreatedByUserID: user ? user.enrollId : 0
      }, mode);
      setBadge("ok"); toastRef.current?.show(mode==="new"?"Doctor added!":"Doctor updated!","ok");
    } catch(e){toastRef.current?.show(e.message,"err");}
    finally{setSaving(false);}
  },[zone,enroll,name,spec,underSvc,svcTarget,mode,user,rawZones]);

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View>
        <ScreenHeader title="Doctors" sub="Master data · enrollment" icon={<Ionicons name="medkit-outline" size={22} color="#fff" />} badge={badge}/>
      </View>
      <ScrollView contentContainerStyle={S.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FadeIn delay={60}>
          <View style={S.card}>
            <View style={S.cardAccent}/>
            <View style={S.cardBody}>
              <ModeToggle options={[{label:"+ Add Doctor",value:"new"},{label:"Edit Existing",value:"edit"}]} selected={mode} onSelect={v=>{setMode(v);clearForm();}}/>
              {mode==="edit"&&<FadeIn delay={40}><SearchPanel title="Find by Enrol ID" value={searchId} onChangeText={setSearchId} onSearch={lookup} onClear={clearForm} loading={searching}/></FadeIn>}
              <WarnBanner show={showOverwrite&&mode==="new"} text="This Enrol ID already exists — saving will overwrite the existing record."/>

              <FadeIn delay={100}>
                <TagLabel text="Basic Information"/>
                <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Dr. Full Name" required/>
                <View style={S.grid2}>
                  <FormField label="Enrol ID" value={enroll} onChangeText={checkEnroll} keyboardType="numeric" placeholder="e.g. 565609" required style={{flex:1}}/>
                  <PickerField label="Zone" value={zone} onValueChange={setZone} items={zonesList} required style={{flex:1}}/>
                </View>
                <PickerField label="Specialization" value={spec} onValueChange={setSpec} items={specializationsList}/>
              </FadeIn>

              <FadeIn delay={160}>
                <SectionDivider label="Farm Coverage"/>
                <View style={S.grid2}>
                  <FormField label="Under Service" value={underSvc}  onChangeText={setUnderSvc}  keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                  <FormField label="Svc Target"    value={svcTarget} onChangeText={setSvcTarget} keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                </View>
              </FadeIn>

              <View style={S.btnRow}>
                <GhostBtn label="Clear" onPress={clearForm}/>
                <PrimaryBtn label="Save Doctor" onPress={handleSave} loading={saving}/>
              </View>
            </View>
          </View>
        </FadeIn>
      </ScrollView>
      <Toast ref={toastRef}/>
    </KeyboardAvoidingView>
  );
}
