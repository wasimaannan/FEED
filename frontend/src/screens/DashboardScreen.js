import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Animated, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllDoctors, getAllVisits, getAllFarms, calcWeek } from "../api";
import { useAuth } from "../context/AuthContext";
import { fonts } from "../theme";

const COMPLAINTS_KEY = "feed_complaints_v1";

// ── Sunset gradient palette ──────────────────────────────────
const G = {
  header:     ["#FF6B6B", "#C2386E", "#5B2A86"],
  doctors:    ["#FF6B6B", "#C2386E"],
  visits:     ["#5B2A86", "#8B3FA8"],
  target:     ["#FF9472", "#F2542D"],
  complaints: ["#C2386E", "#8B3FA8"],
  qLog:       ["#FF6B6B", "#C2386E"],
  qDoctors:   ["#5B2A86", "#8B3FA8"],
  qComplaints:["#C2386E", "#FF6B6B"],
  qActivity:  ["#8B3FA8", "#5B2A86"],
};
const NEUTRAL = {
  bg: "#FAF7F8", surface: "#FFFFFF", border: "#F0E5EA",
  textPrimary: "#1F1320", textSec: "#7A5C6E", textTer: "#B89AAA",
};

function StatCard({ label, value, sub, gradient, icon, delay, onPress }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(18)).current;
  useEffect(()=>{
    Animated.parallel([
      Animated.timing(op,{toValue:1,duration:340,delay,useNativeDriver:true}),
      Animated.spring(ty,{toValue:0,delay,useNativeDriver:true,bounciness:5}),
    ]).start();
  },[]);
  return (
    <Animated.View style={[d.statCardWrap,{opacity:op,transform:[{translateY:ty}]}]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={!onPress}>
        <LinearGradient colors={gradient} start={{x:0,y:0}} end={{x:1,y:1}} style={d.statCard}>
          <View style={d.statIcon}><Text style={{fontSize:15,color:"#fff",fontWeight:"800"}}>{icon}</Text></View>
          <Text style={d.statVal}>{value}</Text>
          <Text style={d.statLbl}>{label}</Text>
          <Text style={d.statSub}>{sub}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [doctors,setDoctors]=useState([]);
  const [visits, setVisits] =useState([]);
  const [farms,  setFarms]  =useState([]);
  const [complaints, setComplaints] = useState([]);
  const [refresh,setRefresh]=useState(false);
  const [search, setSearch] =useState("");

  const today   = new Date();
  const weekNum = calcWeek(today.toISOString().split("T")[0]);
  const h       = today.getHours();
  const greet   = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const dateStr = today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  const loadComplaints = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(COMPLAINTS_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const mine = user?.enrollId ? all.filter(c => String(c.intEnroll) === String(user.enrollId) && !c.dtResolved) : all.filter(c => !c.dtResolved);
      setComplaints(mine);
    } catch (e) { setComplaints([]); }
  }, [user]);

  const load = useCallback(async()=>{
    try {
      const [dc,vs,fm] = await Promise.all([getAllDoctors().catch(()=>[]), getAllVisits().catch(()=>[]), getAllFarms().catch(()=>[])]);
      setDoctors(dc||[]); setVisits(vs||[]); setFarms(fm||[]);
      await loadComplaints();
    } finally { setRefresh(false); }
  },[loadComplaints]);

  useEffect(()=>{ load(); },[]);
  useFocusEffect(useCallback(() => { loadComplaints(); }, [loadComplaints]));

  const weekVisits   = visits.filter(v=>calcWeek(v.strDate||v.date)===weekNum);
  const targetPct    = Math.min(100,Math.round((weekVisits.length/Math.max(doctors.length,1))*100));
  const zoneCounts   = doctors.reduce((a,d)=>{const z=d.strZone||"Unassigned";a[z]=(a[z]||0)+1;return a;},{});
  const recentVisits = [...visits].sort((a,b)=>new Date(b.strDate||b.date)-new Date(a.strDate||a.date)).slice(0,4);

  const ZONE_COLORS  = ["#FF6B6B","#C2386E","#8B3FA8","#5B2A86","#F2542D"];

  const initials = user && user.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <ScrollView style={{flex:1,backgroundColor:NEUTRAL.bg}}
      contentContainerStyle={{paddingBottom:insets.bottom+88}}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true);load();}} tintColor="#C2386E" colors={["#C2386E"]}/>}
    >
      <LinearGradient colors={G.header} start={{x:0,y:0}} end={{x:1,y:1}} style={[d.header,{paddingTop:insets.top+16}]}>
        <View style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between"}}>
          <View style={{flex:1}}>
            <Text style={d.greet}>{greet}</Text>
            <Text style={d.title}>Dashboard</Text>
            <Text style={d.sub}>Week {weekNum} · {dateStr}</Text>
          </View>
          <View style={d.avatar}><Text style={d.avatarTxt}>{initials}</Text></View>
        </View>
        <View style={d.searchBar}>
          <Text style={{fontSize:15,color:"rgba(255,255,255,0.65)",marginRight:8}}>⌕</Text>
          <TextInput style={{flex:1,fontFamily:fonts.body,fontSize:14,color:"#fff"}} placeholder="Search doctors, visits…" placeholderTextColor="rgba(255,255,255,0.55)" value={search} onChangeText={setSearch}/>
        </View>
      </LinearGradient>

      {search.trim().length > 0 ? (
        <>
          <View style={d.secHead}>
            <LinearGradient colors={G.doctors} style={d.secBar}/>
            <Text style={d.secTitle}>Search results ({
              doctors.filter(doc => 
                String(doc.EnrollID || doc.intEnroll || "").toLowerCase().includes(search.toLowerCase()) ||
                String(doc.FullName || doc.strDoctorName || "").toLowerCase().includes(search.toLowerCase())
              ).length
            })</Text>
            <TouchableOpacity onPress={() => setSearch("")}><Text style={[d.secAction,{color:"#C2386E"}]}>Clear</Text></TouchableOpacity>
          </View>
          <View style={[d.card,{marginHorizontal:16}]}>
            {(() => {
              const matches = doctors.filter(doc => 
                String(doc.EnrollID || doc.intEnroll || "").toLowerCase().includes(search.toLowerCase()) ||
                String(doc.FullName || doc.strDoctorName || "").toLowerCase().includes(search.toLowerCase())
              );
              return matches.length === 0 ? (
                <Text style={d.empty}>No matching doctors found</Text>
              ) : (
                matches.slice(0, 10).map((doc, idx) => (
                  <TouchableOpacity key={doc.DoctorID || idx} style={[d.visitRow, idx < Math.min(matches.length, 10) - 1 && {borderBottomWidth:1,borderBottomColor:NEUTRAL.border}]}
                    onPress={() => {
                      setSearch("");
                      navigation.navigate("LogVisit", { enrollId: doc.EnrollID || doc.intEnroll });
                    }}
                    activeOpacity={0.7}
                  >
                    <LinearGradient colors={G.doctors} style={d.visitBadge}><Text style={d.visitBadgeTxt}>#{doc.EnrollID || doc.intEnroll}</Text></LinearGradient>
                    <View style={{flex:1}}>
                      <Text style={d.visitName}>{doc.FullName || doc.strDoctorName}</Text>
                      <Text style={d.visitMeta}>{doc.Specialization || doc.strSpecialization} · {doc.ZoneName || doc.strZone}</Text>
                    </View>
                    <Text style={[d.visitDate, {color: "#C2386E", fontWeight: "600"}]}>Log Visit ➔</Text>
                  </TouchableOpacity>
                ))
              );
            })()}
          </View>
        </>
      ) : (
        <>
          <View style={d.grid}>
            <StatCard icon="✦" label="Doctors"    value={doctors.length}      sub="All active"  gradient={G.doctors}    delay={0}   onPress={()=>navigation.navigate("Doctors")} />
            <StatCard icon="◎" label="Visits"     value={weekVisits.length}   sub="This week"   gradient={G.visits}     delay={60}  onPress={()=>navigation.navigate("LogVisit")} />
            <StatCard icon="%" label="Target"     value={`${targetPct}%`}     sub="On track"    gradient={G.target}     delay={120} />
            <StatCard icon="⚑" label="Complaints" value={complaints.length}   sub="Open"        gradient={G.complaints} delay={180} onPress={()=>navigation.navigate("Complaints")} />
          </View>

          {complaints.length > 0 && (
            <>
              <View style={d.secHead}>
                <LinearGradient colors={G.complaints} style={d.secBar}/>
                <Text style={d.secTitle}>Open complaints</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Complaints")}><Text style={[d.secAction,{color:"#C2386E"}]}>View all</Text></TouchableOpacity>
              </View>
              <View style={[d.card,{marginHorizontal:16,borderColor:"#F5D9E2"}]}>
                {complaints.slice(0,3).map((c,i)=>(
                  <TouchableOpacity key={c.id} onPress={()=>navigation.navigate("Complaints")} activeOpacity={0.7}
                    style={[d.complaintRow, i<Math.min(complaints.length,3)-1&&{borderBottomWidth:1,borderBottomColor:NEUTRAL.border}]}>
                    <View style={d.complaintDot}/>
                    <View style={{flex:1}}>
                      <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:4}}>
                        <Text style={d.complaintTag}>{c.strFarmType}</Text>
                        <Text style={d.complaintSep}>›</Text>
                        <Text style={d.complaintTag}>{c.strCategory}</Text>
                      </View>
                      <Text style={d.complaintName}>{c.strComplaint}</Text>
                    </View>
                    <Text style={d.complaintDate}>{c.dtReported}</Text>
                  </TouchableOpacity>
                ))}
                {complaints.length > 3 && (
                  <TouchableOpacity style={d.moreRow} onPress={()=>navigation.navigate("Complaints")}>
                    <Text style={d.moreTxt}>+{complaints.length - 3} more open complaint{complaints.length-3>1?"s":""}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          <View style={d.secHead}><LinearGradient colors={G.doctors} style={d.secBar}/><Text style={d.secTitle}>Quick actions</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:10,paddingBottom:4,paddingRight:26}} decelerationRate="fast">
            {[
              {label:"Log visit",     sub:"Record today's visit", screen:"LogVisit",   icon:"▤",  gradient:G.qLog},
              {label:"Doctors",       sub:"Master data",          screen:"Doctors",    icon:"✦",  gradient:G.qDoctors},
              {label:"Complaints",    sub:"Register / resolve",   screen:"Complaints", icon:"⚑",  gradient:G.qComplaints},
              {label:"Activity log",  sub:"Audit · sheet sync",   screen:"Activity",   icon:"◎",  gradient:G.qActivity},
            ].map(item=>(
              <TouchableOpacity key={item.label} style={d.quickCardWrap} onPress={()=>navigation.navigate(item.screen)} activeOpacity={0.85}>
                <View style={d.quickCard}>
                  <LinearGradient colors={item.gradient} style={d.quickIcon}><Text style={{fontSize:18,color:"#fff"}}>{item.icon}</Text></LinearGradient>
                  <Text style={d.quickLabel}>{item.label}</Text>
                  <Text style={d.quickSub}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={d.secHead}><LinearGradient colors={G.visits} style={d.secBar}/><Text style={d.secTitle}>Zone performance</Text></View>
          <View style={[d.card,{marginHorizontal:16}]}>
            {Object.keys(zoneCounts).length===0
              ? <Text style={d.empty}>No data yet — pull to refresh</Text>
              : Object.entries(zoneCounts).map(([zone,count],i,arr)=>{
                  const pct = Math.round((count/doctors.length)*100);
                  const col = ZONE_COLORS[i%ZONE_COLORS.length];
                  return (
                    <View key={zone} style={[d.zoneRow, i<arr.length-1&&{borderBottomWidth:1,borderBottomColor:NEUTRAL.border}]}>
                      <View style={[d.zoneDot,{backgroundColor:col}]}/>
                      <View style={{flex:1}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:6}}>
                          <Text style={d.zoneName}>{zone}</Text>
                          <Text style={[d.zonePct,{color:col}]}>{count} dr · {pct}%</Text>
                        </View>
                        <View style={d.progBg}><View style={[d.progFill,{width:`${pct}%`,backgroundColor:col}]}/></View>
                      </View>
                    </View>
                  );
                })
            }
          </View>

          <View style={d.secHead}>
            <LinearGradient colors={G.target} style={d.secBar}/>
            <Text style={d.secTitle}>Recent visits</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Activity")}><Text style={[d.secAction,{color:"#F2542D"}]}>View all</Text></TouchableOpacity>
          </View>
          <View style={[d.card,{marginHorizontal:16}]}>
            {recentVisits.length===0
              ? <Text style={d.empty}>No visits logged yet</Text>
              : recentVisits.map((v,i)=>(
                  <View key={i} style={[d.visitRow, i<recentVisits.length-1&&{borderBottomWidth:1,borderBottomColor:NEUTRAL.border}]}>
                    <LinearGradient colors={G.doctors} style={d.visitBadge}><Text style={d.visitBadgeTxt}>#{v.intEnroll||v.enroll}</Text></LinearGradient>
                    <View style={{flex:1}}>
                      <Text style={d.visitName}>Enrol #{v.intEnroll||v.enroll}</Text>
                      <Text style={d.visitMeta}>{v.strFirmType||v.firmType} · Wk {v.intWeek||v.week}</Text>
                    </View>
                    <Text style={d.visitDate}>{v.strDate||v.date}</Text>
                  </View>
                ))
            }
          </View>
        </>
      )}
    </ScrollView>
  );
}

const d = StyleSheet.create({
  header:      { paddingHorizontal:20, paddingBottom:18, borderBottomLeftRadius:24, borderBottomRightRadius:24 },
  greet:       { fontFamily:fonts.body, fontSize:13, color:"rgba(255,255,255,0.75)" },
  title:       { fontFamily:fonts.display, fontSize:30, fontWeight:"800", color:"#fff", letterSpacing:-0.4, marginTop:2 },
  sub:         { fontFamily:fonts.mono, fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:4 },
  avatar:      { width:44, height:44, borderRadius:22, backgroundColor:"rgba(255,255,255,0.22)", alignItems:"center", justifyContent:"center", borderWidth:2, borderColor:"rgba(255,255,255,0.35)" },
  avatarTxt:   { color:"#fff", fontFamily:fonts.label, fontSize:13, fontWeight:"800" },
  searchBar:   { flexDirection:"row", alignItems:"center", backgroundColor:"rgba(255,255,255,0.15)", borderRadius:12, paddingHorizontal:14, paddingVertical:10, marginTop:14 },
  grid:        { flexDirection:"row", flexWrap:"wrap", paddingHorizontal:12, paddingTop:16, gap:10 },
  statCardWrap:{ width:"47%" },
  statCard:    { borderRadius:16, padding:14, overflow:"hidden" },
  statIcon:    { width:32, height:32, borderRadius:9, backgroundColor:"rgba(255,255,255,0.20)", alignItems:"center", justifyContent:"center", marginBottom:8 },
  statVal:     { fontFamily:fonts.display, fontSize:26, fontWeight:"800", letterSpacing:-0.5, color:"#fff" },
  statLbl:     { fontFamily:fonts.label, fontSize:10, color:"rgba(255,255,255,0.85)", marginTop:3, textTransform:"uppercase", letterSpacing:0.9 },
  statSub:     { fontFamily:fonts.body, fontSize:10.5, color:"rgba(255,255,255,0.6)", marginTop:2 },
  secHead:     { flexDirection:"row", alignItems:"center", gap:8, paddingHorizontal:20, marginTop:24, marginBottom:10 },
  secBar:      { width:3, height:14, borderRadius:2 },
  secTitle:    { fontFamily:fonts.label, fontSize:11, fontWeight:"700", color:NEUTRAL.textSec, textTransform:"uppercase", letterSpacing:1.1, flex:1 },
  secAction:   { fontFamily:fonts.body, fontSize:12, fontWeight:"600" },
  card:        { backgroundColor:NEUTRAL.surface, borderRadius:16, borderWidth:1, borderColor:NEUTRAL.border, overflow:"hidden" },
  empty:       { padding:22, color:NEUTRAL.textTer, fontFamily:fonts.body, fontSize:13, textAlign:"center" },
  quickCardWrap:{ width:148 },
  quickCard:   { backgroundColor:NEUTRAL.surface, borderRadius:16, padding:14, borderWidth:1, borderColor:NEUTRAL.border, shadowColor:"#000", shadowOpacity:0.04, shadowRadius:6, elevation:1 },
  quickIcon:   { width:44, height:44, borderRadius:13, alignItems:"center", justifyContent:"center", marginBottom:10 },
  quickLabel:  { fontFamily:fonts.label, fontSize:13, fontWeight:"700", marginBottom:3, color:NEUTRAL.textPrimary },
  quickSub:    { fontFamily:fonts.body, fontSize:11, color:NEUTRAL.textTer, lineHeight:15 },
  zoneRow:     { flexDirection:"row", alignItems:"center", gap:12, paddingHorizontal:14, paddingVertical:14 },
  zoneDot:     { width:8, height:8, borderRadius:4, flexShrink:0, marginTop:2 },
  zoneName:    { fontFamily:fonts.body, fontSize:13, color:NEUTRAL.textPrimary, fontWeight:"600" },
  zonePct:     { fontFamily:fonts.mono, fontSize:11 },
  progBg:      { height:3, backgroundColor:"#F4ECF0", borderRadius:2 },
  progFill:    { height:3, borderRadius:2 },
  visitRow:    { flexDirection:"row", alignItems:"center", gap:12, paddingHorizontal:14, paddingVertical:14 },
  visitBadge:  { width:40, height:40, borderRadius:10, alignItems:"center", justifyContent:"center" },
  visitBadgeTxt:{ fontFamily:fonts.mono, fontSize:9, color:"#fff", fontWeight:"700" },
  visitName:   { fontFamily:fonts.body, fontSize:13, color:NEUTRAL.textPrimary, fontWeight:"600" },
  visitMeta:   { fontFamily:fonts.body, fontSize:11, color:NEUTRAL.textSec, marginTop:2 },
  visitDate:   { fontFamily:fonts.mono, fontSize:10, color:NEUTRAL.textTer },
  complaintRow: { flexDirection:"row", alignItems:"center", gap:12, paddingHorizontal:14, paddingVertical:13 },
  complaintDot: { width:8, height:8, borderRadius:4, backgroundColor:"#C2386E", flexShrink:0 },
  complaintTag: { fontFamily:fonts.label, fontSize:9.5, fontWeight:"700", color:NEUTRAL.textTer, textTransform:"uppercase", letterSpacing:0.5 },
  complaintSep: { fontFamily:fonts.body, fontSize:9.5, color:NEUTRAL.textTer },
  complaintName:{ fontFamily:fonts.body, fontSize:13, color:NEUTRAL.textPrimary, fontWeight:"600", marginTop:2 },
  complaintDate:{ fontFamily:fonts.mono, fontSize:10, color:NEUTRAL.textTer },
  moreRow:     { paddingVertical:12, alignItems:"center", backgroundColor:"#FFF5F7" },
  moreTxt:     { fontFamily:fonts.body, fontSize:12, color:"#C2386E", fontWeight:"600" },
});
