import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getDoctor, saveDoctor, getSettingsZones, getSettingsFarmTypes, adminAuthRequest } from "../api";
import { ZONES, SPECIALIZATIONS, colors } from "../theme";
import { FadeIn, ScreenHeader, SearchPanel, TagLabel, FormField, PickerField, PillGroup, ModeToggle, WarnBanner, PrimaryBtn, GhostBtn, Toast, SectionDivider } from "../components";
import { S } from "../theme";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function DoctorsScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
  const { user } = useAuth();

  // Broaden admin check to handle various API response formats
  // Prioritize the 'role' or 'Role' field from the user table as requested
  const isAdmin =
    String(user?.role || user?.Role || "").toLowerCase().includes('admin') ||
    user?.isAdmin === true ||
    user?.EnrollID === 56007 ||
    user?.EnrollID === 6767 ||
    user?.EnrollID === 1001 ||
    user?.EnrollID === 0 ||
    user?.EnrollID === 5600 ||
    user?.enrollId === 306007;

  console.log("DEBUG: DoctorsScreen User Role:", user?.role || user?.Role, "isAdmin:", isAdmin);

  const [mode,setMode]=useState("edit"); // Initial state
  const [badge,setBadge]=useState("new");
  const [searching,setSearching]=useState(false);
  const [saving,setSaving]=useState(false);
  const [searchId,setSearchId]=useState("");
  const [showOverwrite,setShowOverwrite]=useState(false);
  const [zone,setZone]=useState("");
  const [enroll,setEnroll]=useState("");
  const [name,setName]=useState("");
  const [spec,setSpec]=useState("");
  const [broiler,setBroiler]=useState("");
  const [layer,setLayer]=useState("");
  const [sonali,setSonali]=useState("");
  const [underSvc,setUnderSvc]=useState("");
  const [svcTarget,setSvcTarget]=useState("");

  // Sync mode with isAdmin once user is loaded
  const lastUserRef = useRef(null);
  useEffect(() => {
    if (user && user.enrollId !== lastUserRef.current) {
      setMode(isAdmin ? "new" : "edit");
      setBadge(isAdmin ? "new" : "edit");
      setSearchId(isAdmin ? "" : String(user?.enrollId || ""));
      setEnroll(isAdmin ? "" : String(user?.enrollId || ""));
      setName(isAdmin ? "" : (user?.fullName || ""));
      lastUserRef.current = user.enrollId;
    }
  }, [user, isAdmin]);

  const [zonesList, setZonesList] = useState(ZONES);
  const [rawZones, setRawZones] = useState([]);
  const [specializationsList, setSpecializationsList] = useState(["Broiler", "Layer", "Sonali", "Cattle", "Fish"]);

  const clearForm = useCallback(()=>{
    if (isAdmin) {
      setSearchId("");
      setZone("");
      setEnroll("");
      setName("");
      setSpec("");
    } else {
      setSearchId(String(user?.enrollId || ""));
      setEnroll(String(user?.enrollId || ""));
      setName(user?.fullName || "");
    }
    setBroiler("");setLayer("");setSonali("");setUnderSvc("");setSvcTarget("");
    setShowOverwrite(false);
    setBadge(isAdmin ? (mode === "new" ? "new" : "edit") : "edit");
  },[user, isAdmin, mode]);

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

  const checkEnroll = useCallback(async v=>{
    setEnroll(v);
    if (!isAdmin || mode!=="new"||!v||v.length<4){setShowOverwrite(false);return;}
    try {
      const res = await adminAuthRequest("/search?q=%25&limit=1000", { prefix: "/doctors", method: "GET" });
      const list = res.data || res.Data || res.payload || res.Payload || res.doctors || (Array.isArray(res) ? res : []);
      setShowOverwrite(list.some(d => String(d.EnrollID || d.enrollId || d.intEnroll) === String(v)));
    } catch(_){}
  },[mode, isAdmin]);

  const lookup = useCallback(async (idOverride) => {
    const finalId = idOverride || (isAdmin ? searchId.trim() : String(user?.enrollId));

    if (!finalId) {
      toastRef.current?.show("Enter an Enrol ID first", "err");
      return;
    }

    setSearching(true);
    try {
      const row = await getDoctor(finalId);
      if (row) {
        setZone(row.ZoneName || row.strZone || "");
        setEnroll(String(row.EnrollID || row.enrollId || row.intEnroll || finalId));
        setName(row.FullName || row.strDoctorName || row.fullName || (isAdmin ? "" : user?.fullName));
        setSpec(row.Specialization || row.strSpecialization || "");
        setUnderSvc(String(row.UnderService || row.intUnderService || ""));
        setSvcTarget(String(row.ServiceTarget || row.intServiceTarget || ""));
        setBadge("edit");
        if (isAdmin) toastRef.current?.show("Doctor loaded", "ok");
      } else if (!isAdmin) {
        setEnroll(String(user?.enrollId));
        setName(user?.fullName || "");
      } else {
        toastRef.current?.show("Doctor not found", "err");
      }
    } catch (e) {
      if (!isAdmin) {
        setEnroll(String(user?.enrollId));
        setName(user?.fullName || "");
      } else {
        toastRef.current?.show("Doctor not found", "err");
      }
      console.warn("Doctor lookup failed:", e.message);
    } finally {
      setSearching(false);
    }
  }, [searchId, user, isAdmin]);

  useEffect(() => {
    if (!isAdmin && user?.enrollId) {
      lookup(String(user.enrollId));
    }
  }, [user, isAdmin, lookup]);

  const handleSave = useCallback(async()=>{
    if (!zone||!enroll||!name.trim()){toastRef.current?.show("Zone, Enrol ID and Name required","err");return;}
    setSaving(true);

    const zoneObj = rawZones.find(z => (z.Zone || z.ZoneName || z.zoneName) === zone);
    const zoneId = zoneObj ? (zoneObj.ZoneID || zoneObj.zoneId) : 0;

    try {
      await saveDoctor({
        intEnroll:Number(enroll),
        strDoctorName:name.trim(),
        strZone:zone,
        ZoneID: zoneId,
        strSpecialization:spec,
        intBroiler:Number(broiler)||0,
        intLayer:Number(layer)||0,
        intSonali:Number(sonali)||0,
        intUnderService:Number(underSvc)||0,
        intServiceTarget:Number(svcTarget)||0,
        CreatedByUserID: user ? user.enrollId : 0
      }, mode);
      setBadge("ok"); toastRef.current?.show(mode==="new"?"Doctor added!":"Doctor updated!","ok");
    } catch(e){toastRef.current?.show(e.message,"err");}
    finally{setSaving(false);}
  },[zone,enroll,name,spec,broiler,layer,sonali,underSvc,svcTarget,mode,user,rawZones]);

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
              <ModeToggle
                options={isAdmin ? [{label:"+ Add Doctor",value:"new"},{label:"Edit Existing",value:"edit"}] : [{label:"My Doctor Profile",value:"edit"}]}
                selected={mode}
                onSelect={v=>{setMode(v);clearForm();}}
              />
              {(mode==="edit" && isAdmin) && <FadeIn delay={40}><SearchPanel title="Find by Enrol ID" value={searchId} onChangeText={setSearchId} onSearch={() => lookup()} onClear={clearForm} loading={searching}/></FadeIn>}
              <WarnBanner show={isAdmin && showOverwrite && mode==="new"} text="This Enrol ID already exists — saving will overwrite the existing record."/>

              <FadeIn delay={100}>
                <TagLabel text="Basic Information"/>
                <FormField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Dr. Full Name"
                  required
                  editable={isAdmin || mode === "new"}
                />
                <View style={S.grid2}>
                  <FormField
                    label="Enrol ID"
                    value={enroll}
                    onChangeText={checkEnroll}
                    keyboardType="numeric"
                    placeholder="e.g. 565609"
                    required
                    style={{flex:1}}
                    editable={isAdmin && mode === "new"}
                  />
                  <PickerField label="Zone" value={zone} onValueChange={setZone} items={zonesList} required style={{flex:1}} editable={isAdmin || mode === "new"}/>
                </View>
                <PickerField label="Specialization" value={spec} onValueChange={setSpec} items={specializationsList} editable={isAdmin || mode === "new"}/>
              </FadeIn>

              <FadeIn delay={160}>
                <SectionDivider label="Farm Coverage"/>
                <View style={S.grid3}>
                  <FormField label="Broiler" value={broiler} onChangeText={setBroiler} keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                  <FormField label="Layer"   value={layer}   onChangeText={setLayer}   keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                  <FormField label="Sonali"  value={sonali}  onChangeText={setSonali}  keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                </View>
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
