import React, { useState, useRef, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getDoctor, saveDoctor } from "../api";
import { ZONES, SPECIALIZATIONS, colors } from "../theme";
import { FadeIn, ScreenHeader, SearchPanel, TagLabel, FormField, PickerField, PillGroup, ModeToggle, WarnBanner, PrimaryBtn, GhostBtn, Toast, SectionDivider } from "../components";
import { S } from "../theme";

export default function DoctorsScreen() {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
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
  const [broiler,setBroiler]=useState("");
  const [layer,setLayer]=useState("");
  const [sonali,setSonali]=useState("");
  const [underSvc,setUnderSvc]=useState("");
  const [svcTarget,setSvcTarget]=useState("");

  const clearForm = useCallback(()=>{ setSearchId("");setZone("");setEnroll("");setName("");setSpec("");setBroiler("");setLayer("");setSonali("");setUnderSvc("");setSvcTarget("");setShowOverwrite(false);setBadge("new"); },[]);

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
      setBroiler("");
      setLayer("");
      setSonali("");
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
    try {
      await saveDoctor({intEnroll:Number(enroll),strDoctorName:name.trim(),strZone:zone,strSpecialization:spec,intBroiler:Number(broiler)||0,intLayer:Number(layer)||0,intSonali:Number(sonali)||0,intUnderService:Number(underSvc)||0,intServiceTarget:Number(svcTarget)||0});
      setBadge("ok"); toastRef.current?.show(mode==="new"?"Doctor added!":"Doctor updated!","ok");
    } catch(e){toastRef.current?.show(e.message,"err");}
    finally{setSaving(false);}
  },[zone,enroll,name,spec,broiler,layer,sonali,underSvc,svcTarget,mode]);

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={{paddingTop:insets.top}}>
        <ScreenHeader title="Doctors" sub="Master data · enrollment" icon="🩺" badge={badge}/>
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
                  <PickerField label="Zone" value={zone} onValueChange={setZone} items={ZONES} required style={{flex:1}}/>
                </View>
                <PickerField label="Specialization" value={spec} onValueChange={setSpec} items={SPECIALIZATIONS}/>
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
