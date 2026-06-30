import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllVisits, calcWeek } from "../api";
import { colors, fonts } from "../theme";
import { FadeIn, ScreenHeader, EmptyState } from "../components";
import { Ionicons } from "@expo/vector-icons";

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [visits,setVisits]=useState([]);
  const [refresh,setRefresh]=useState(false);
  const [filter,setFilter]=useState("all");

  const load = useCallback(async()=>{
    try { const v=await getAllVisits().catch(()=>[]); setVisits(v||[]); }
    finally { setRefresh(false); }
  },[]);

  useEffect(()=>{load();},[]);

  const today   = new Date();
  const weekNum = calcWeek(today.toISOString().split("T")[0]);
  const filtered = filter==="week" ? visits.filter(v=>calcWeek(v.strDate||v.date)===weekNum) : visits;
  const sorted   = [...filtered].sort((a,b)=>new Date(b.strDate||b.date||0)-new Date(a.strDate||a.date||0));

  return (
    <View style={{flex:1,backgroundColor:colors.bg}}>
      <View>
        <ScreenHeader title="Visit Log" sub="All transactions · activity" icon={<Ionicons name="bar-chart-outline" size={22} color="#fff" />}/>
      </View>

      {/* Filter tabs */}
      <View style={act.filterRow}>
        {["all","week"].map(f=>(
          <TouchableOpacity key={f} style={[act.filterBtn, filter===f&&act.filterBtnOn]} onPress={()=>setFilter(f)}>
            <Text style={[act.filterTxt, filter===f&&act.filterTxtOn]}>{f==="all"?"All Visits":"This Week"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{padding:16, paddingBottom:insets.bottom+88}}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true);load();}} tintColor={colors.brand} colors={[colors.brand]}/>}
      >
        {sorted.length===0
          ? <EmptyState icon={<Ionicons name="bar-chart-outline" size={28} color="#B89AAA" />} title="No visits yet" sub="Visit records will appear here once logged"/>
          : sorted.map((v,i)=>{
              const enroll = v.intEnroll||v.enroll;
              const ft     = v.strFirmType||v.firmType||"—";
              const wk     = v.intWeek||v.week||"—";
              const dt     = v.strDate||v.date||"—";
              const target = v.intVisitTarget||0;
              const newV   = v.intNewVisitTarget||0;
              const rep    = v.intRepVisitTarget||0;
              return (
                <FadeIn key={i} delay={i*30}>
                  <View style={act.card}>
                    <View style={act.cardTop}>
                      <View style={act.enrollBadge}><Text style={act.enrollTxt}>#{enroll}</Text></View>
                      <View style={{flex:1, marginLeft:10}}>
                        <Text style={act.cardTitle}>Enrol #{enroll}</Text>
                        <Text style={act.cardMeta}>{ft} · Week {wk}</Text>
                      </View>
                      <Text style={act.cardDate}>{dt}</Text>
                    </View>
                    <View style={act.statsRow}>
                      {[["Target",target],["New",newV],["Repeat",rep],["Prob",v.intProblemSolveTarget||0]].map(([lbl,val])=>(
                        <View key={lbl} style={act.stat}>
                          <Text style={act.statVal}>{val}</Text>
                          <Text style={act.statLbl}>{lbl}</Text>
                        </View>
                      ))}
                    </View>
                    {(v.strAchievement||v.strChallenges)&&(
                      <View style={act.notes}>
                        {v.strAchievement&&<Text style={act.noteText} numberOfLines={1}>✓ {v.strAchievement}</Text>}
                        {v.strChallenges&&<Text style={act.noteText} numberOfLines={1}>↯ {v.strChallenges}</Text>}
                      </View>
                    )}
                  </View>
                </FadeIn>
              );
            })
        }
      </ScrollView>
    </View>
  );
}

const act = StyleSheet.create({
  filterRow:    { flexDirection:"row", paddingHorizontal:16, paddingVertical:10, gap:8, backgroundColor:colors.surface, borderBottomWidth:1, borderBottomColor:colors.border },
  filterBtn:    { paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:colors.surfaceUp, borderWidth:1.5, borderColor:colors.border },
  filterBtnOn:  { backgroundColor:colors.brand, borderColor:colors.brand },
  filterTxt:    { fontFamily:fonts.label, fontSize:12.5, fontWeight:"700", color:colors.textSec },
  filterTxtOn:  { color:"#fff" },
  card:         { backgroundColor:colors.surface, borderRadius:16, marginBottom:12, borderWidth:1, borderColor:colors.border, overflow:"hidden", shadowColor:"#000", shadowOpacity:0.04, shadowRadius:6, elevation:1 },
  cardTop:      { flexDirection:"row", alignItems:"center", padding:14, borderBottomWidth:1, borderBottomColor:colors.border },
  enrollBadge:  { width:44, height:44, borderRadius:12, backgroundColor:colors.surfaceUp, alignItems:"center", justifyContent:"center", borderWidth:1.5, borderColor:colors.brandBorder },
  enrollTxt:    { fontFamily:fonts.mono, fontSize:9.5, color:colors.brand, fontWeight:"700" },
  cardTitle:    { fontFamily:fonts.body, fontSize:14, color:colors.textPrimary, fontWeight:"700" },
  cardMeta:     { fontFamily:fonts.body, fontSize:11, color:colors.textSec, marginTop:2 },
  cardDate:     { fontFamily:fonts.mono, fontSize:10, color:colors.textTer },
  statsRow:     { flexDirection:"row", paddingHorizontal:14, paddingVertical:12, gap:0 },
  stat:         { flex:1, alignItems:"center" },
  statVal:      { fontFamily:fonts.display, fontSize:18, fontWeight:"700", color:colors.brand },
  statLbl:      { fontFamily:fonts.label, fontSize:9, color:colors.textTer, textTransform:"uppercase", letterSpacing:0.7, marginTop:2 },
  notes:        { paddingHorizontal:14, paddingBottom:12, gap:4 },
  noteText:     { fontFamily:fonts.body, fontSize:12, color:colors.textSec, lineHeight:17 },
});
