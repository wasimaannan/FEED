import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getFarmsByEnroll, saveVisit, calcWeek } from "../api";
import { FIRM_TYPES, MORTALITY, FEED_QUALITY, colors, fonts } from "../theme";
import { S } from "../theme";
import { FadeIn, ScreenHeader, SearchPanel, TagLabel, SectionDivider, LockedField, FormField, PickerField, PillGroup, ValidationBox, TsPill, PrimaryBtn, GhostBtn, Toast, EmptyState, InfoBanner } from "../components";

export default function LogVisitScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const toastRef = useRef(null);
  const [searching,setSearching]=useState(false);
  const [saving,setSaving]=useState(false);
  const [searchId,setSearchId]=useState("");
  const [doctor,setDoctor]=useState(null);
  const [showTs,setShowTs]=useState(false);
  const [savedAt,setSavedAt]=useState("");
  const [badge,setBadge]=useState("new");

  // Visit fields
  const [date,setDate]=useState("");
  const [week,setWeek]=useState("");
  const [firmType,setFirmType]=useState("");
  const [visitTarget,setVisitTarget]=useState("");
  const [newVisit,setNewVisit]=useState("");
  const [repVisit,setRepVisit]=useState("");
  const [probSolve,setProbSolve]=useState("");
  const [newOnboard,setNewOnboard]=useState("");
  // Health
  const [mortality,setMortality]=useState("");
  const [feedQuality,setFeedQuality]=useState("");
  const [disease,setDisease]=useState("");
  const [retention,setRetention]=useState("");
  // Sales
  const [salesMT,setSalesMT]=useState("");
  const [salesCr,setSalesCr]=useState("");
  // Notes
  const [achievement,setAchievement]=useState("");
  const [challenges,setChallenges]=useState("");
  const [nextPlan,setNextPlan]=useState("");

  const subTotal    = useMemo(()=>(Number(newVisit)||0)+(Number(repVisit)||0)+(Number(probSolve)||0),[newVisit,repVisit,probSolve]);
  const subTotalErr = useMemo(()=>{ const t=Number(visitTarget)||0; return t>0&&subTotal>t; },[visitTarget,subTotal]);
  const valErrors   = useMemo(()=>subTotalErr?[`New+Rep+Problem (${subTotal}) exceeds Visit Target (${Number(visitTarget)||0})`]:[],[subTotalErr,subTotal,visitTarget]);

  const handleDate = useCallback(v=>{
    setDate(v); setShowTs(false);
    const w=calcWeek(v);
    setWeek(w!==null?String(w):"");
  },[]);

  const clearAll = useCallback(()=>{
    setSearchId("");setDoctor(null);setDate("");setWeek("");setFirmType("");
    setVisitTarget("");setNewVisit("");setRepVisit("");setProbSolve("");setNewOnboard("");
    setMortality("");setFeedQuality("");setDisease("");setRetention("");
    setSalesMT("");setSalesCr("");setAchievement("");setChallenges("");setNextPlan("");
    setShowTs(false);setSavedAt("");setBadge("new");
  },[]);

  const lookup = useCallback(async()=>{
    if (!searchId.trim()){toastRef.current?.show("Enter an Enrol ID","err");return;}
    setSearching(true);
    try {
      const docs=await getAllDoctors().catch(()=>[]);
      const row=docs.find(d=>String(d.intEnroll)===String(searchId.trim()));
      if (row){
        setDoctor({enroll:row.intEnroll,name:row.strDoctorName,zone:row.strZone});
        toastRef.current?.show("Doctor loaded — fill visit details","ok");
      } else {
        toastRef.current?.show("No doctor found for Enrol ID "+searchId,"err");
      }
    } catch(e){toastRef.current?.show(e.message,"err");}
    finally{setSearching(false);}
  },[searchId]);

  const handleSave = useCallback(async()=>{
    if (!doctor){toastRef.current?.show("Load a doctor first","err");return;}
    if (!date||!week){toastRef.current?.show("Date is required","err");return;}
    if (subTotalErr){toastRef.current?.show("Fix visit count error first","err");return;}
    setSaving(true);
    try {
      await saveVisit({
        enroll:doctor.enroll, name_of_doctor:doctor.name, zone:doctor.zone,
        strFirmType:firmType, date, week:Number(week),
        intVisitTarget:Number(visitTarget)||0, intNewVisitTarget:Number(newVisit)||0,
        intRepVisitTarget:Number(repVisit)||0, intProblemSolveTarget:Number(probSolve)||0,
        intNewFirmOnboardTarget:Number(newOnboard)||0,
        strMortality:mortality, strFeedQuality:feedQuality, strDisease:disease,
        intRetention:Number(retention)||0, salesMT:Number(salesMT)||0, salesCr:Number(salesCr)||0,
        strAchievement:achievement, strChallenges:challenges, strNextPlan:nextPlan,
      });
      const ts=new Date().toLocaleString("en-GB");
      setSavedAt("Saved at: "+ts); setShowTs(true); setBadge("ok");
      toastRef.current?.show("Visit logged!","ok");
    } catch(e){toastRef.current?.show(e.message,"err");}
    finally{setSaving(false);}
  },[doctor,date,week,firmType,visitTarget,newVisit,repVisit,probSolve,newOnboard,mortality,feedQuality,disease,retention,salesMT,salesCr,achievement,challenges,nextPlan,subTotalErr]);

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={{paddingTop:insets.top}}>
        <ScreenHeader title="Log Visit" sub="Record today's field visit" icon="📋" badge={badge}/>
      </View>
      <ScrollView contentContainerStyle={S.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FadeIn delay={60}>
          <View style={S.card}>
            <View style={S.cardAccent}/>
            <View style={S.cardBody}>
              <SearchPanel title="Find Doctor by Enrol ID" value={searchId} onChangeText={setSearchId} onSearch={lookup} onClear={clearAll} loading={searching}/>

              {!doctor
                ? <EmptyState icon="🩺" title="Search for a doctor" sub="Enter the Enrol ID above to start logging a visit"/>
                : <>
                    <FadeIn delay={40}>
                      <TagLabel text="Doctor Info"/>
                      <View style={S.grid2}>
                        <LockedField label="Enrol ID" value={String(doctor.enroll)} mono style={{flex:1}}/>
                        <LockedField label="Zone"     value={doctor.zone}           style={{flex:1}}/>
                      </View>
                      <LockedField label="Doctor Name" value={doctor.name}/>
                    </FadeIn>

                    <FadeIn delay={80}>
                      <SectionDivider label="Visit Details"/>
                      <View style={S.grid2}>
                        <FormField label="Date" value={date} onChangeText={handleDate} placeholder="YYYY-MM-DD" keyboardType="numeric" hint="e.g. 2026-06-25" required style={{flex:1}}/>
                        <FormField label="Week #" value={week} editable={false} placeholder="—" hint="Auto from date" style={{flex:1}}/>
                      </View>
                      <PickerField label="Farm Type" value={firmType} onValueChange={setFirmType} items={FIRM_TYPES}/>
                    </FadeIn>

                    <FadeIn delay={120}>
                      <SectionDivider label="Visit Counts"/>
                      <InfoBanner text="New + Rep + Problem must not exceed Visit Target"/>
                      <ValidationBox errors={valErrors}/>
                      <FormField label="Total Visit Target" value={visitTarget} onChangeText={setVisitTarget} keyboardType="numeric" placeholder="0"/>
                      <View style={S.grid3}>
                        <FormField label="New Visits"    value={newVisit}  onChangeText={setNewVisit}  keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                        <FormField label="Repeat Visits" value={repVisit}  onChangeText={setRepVisit}  keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                        <FormField label="Prob Solved"   value={probSolve} onChangeText={setProbSolve} keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                      </View>
                      <View style={S.subTotalRow}>
                        <Text style={S.subTotalText}>Sub-total: {subTotal}</Text>
                        {subTotalErr&&<Text style={S.subTotalErr}> — exceeds target!</Text>}
                      </View>
                      <FormField label="New Farms Onboarded" value={newOnboard} onChangeText={setNewOnboard} keyboardType="numeric" placeholder="0"/>
                    </FadeIn>

                    <FadeIn delay={160}>
                      <SectionDivider label="Farm Health"/>
                      <PickerField label="Mortality" value={mortality} onValueChange={setMortality} items={MORTALITY}/>
                      <PickerField label="Feed Quality" value={feedQuality} onValueChange={setFeedQuality} items={FEED_QUALITY}/>
                      <FormField label="Disease Observed" value={disease} onChangeText={setDisease} placeholder="e.g. Newcastle, none"/>
                      <FormField label="Customer Retention %" value={retention} onChangeText={setRetention} keyboardType="numeric" placeholder="0–100"/>
                    </FadeIn>

                    <FadeIn delay={200}>
                      <SectionDivider label="Sales Impact"/>
                      <View style={S.grid2}>
                        <FormField label="Sales (MT)"    value={salesMT} onChangeText={setSalesMT} keyboardType="numeric" placeholder="0" style={{flex:1}}/>
                        <FormField label="Sales (Crore)" value={salesCr} onChangeText={setSalesCr} keyboardType="numeric" placeholder="0.00" style={{flex:1}}/>
                      </View>
                    </FadeIn>

                    <FadeIn delay={240}>
                      <SectionDivider label="Field Notes"/>
                      <FormField label="Achievement"     value={achievement} onChangeText={setAchievement} multiline placeholder="What went well…"/>
                      <FormField label="Challenges"      value={challenges}  onChangeText={setChallenges}  multiline placeholder="Issues faced…"/>
                      <FormField label="Next Week Plan"  value={nextPlan}    onChangeText={setNextPlan}    multiline placeholder="Plan for next week…"/>
                    </FadeIn>

                    <TsPill timestamp={savedAt} show={showTs}/>
                    <View style={S.btnRow}>
                      <GhostBtn label="Clear" onPress={clearAll}/>
                      <PrimaryBtn label="Submit Visit Log" onPress={handleSave} loading={saving}/>
                    </View>
                  </>
              }
            </View>
          </View>
        </FadeIn>
      </ScrollView>
      <Toast ref={toastRef}/>
    </KeyboardAvoidingView>
  );
}
