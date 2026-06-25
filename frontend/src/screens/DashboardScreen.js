import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Animated, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllDoctors, getAllVisits, getAllFarms, calcWeek } from "../api";
import { colors, fonts } from "../theme";

function StatCard({ label, value, sub, color, icon, delay }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(18)).current;
  useEffect(()=>{
    Animated.parallel([
      Animated.timing(op,{toValue:1,duration:340,delay,useNativeDriver:true}),
      Animated.spring(ty,{toValue:0,delay,useNativeDriver:true,bounciness:5}),
    ]).start();
  },[]);
  return (
    <Animated.View style={[d.statCard,{opacity:op,transform:[{translateY:ty}]}]}>
      <View style={[d.statBar,{backgroundColor:color}]}/>
      <View style={[d.statIcon,{backgroundColor:color+"1A"}]}>
        <Text style={{fontSize:15,color,fontWeight:"800"}}>{icon}</Text>
      </View>
      <Text style={[d.statVal,{color}]}>{value}</Text>
      <Text style={d.statLbl}>{label}</Text>
      <Text style={d.statSub}>{sub}</Text>
    </Animated.View>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [doctors,setDoctors]=useState([]);
  const [visits, setVisits] =useState([]);
  const [farms,  setFarms]  =useState([]);
  const [refresh,setRefresh]=useState(false);
  const [search, setSearch] =useState("");

  const today   = new Date();
  const weekNum = calcWeek(today.toISOString().split("T")[0]);
  const h       = today.getHours();
  const greet   = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const dateStr = today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  const load = useCallback(async()=>{
    try {
      const [dc,vs,fm] = await Promise.all([getAllDoctors().catch(()=>[]), getAllVisits().catch(()=>[]), getAllFarms().catch(()=>[])]);
      setDoctors(dc||[]); setVisits(vs||[]); setFarms(fm||[]);
    } finally { setRefresh(false); }
  },[]);

  useEffect(()=>{ load(); },[]);

  const weekVisits   = visits.filter(v=>calcWeek(v.strDate||v.date)===weekNum);
  const targetPct    = Math.min(100,Math.round((weekVisits.length/Math.max(doctors.length,1))*100));
  const zoneCounts   = doctors.reduce((a,d)=>{a[d.strZone]=(a[d.strZone]||0)+1;return a;},{});
  const recentVisits = [...visits].sort((a,b)=>new Date(b.strDate||b.date)-new Date(a.strDate||a.date)).slice(0,5);

  const ZONE_COLORS  = [colors.brand, colors.brandMid, colors.gold, colors.moduleAct, "#8B5CF6"];

  return (
    <ScrollView style={{flex:1,backgroundColor:colors.bg}}
      contentContainerStyle={{paddingBottom:insets.bottom+88}}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true);load();}} tintColor={colors.brand} colors={[colors.brand]}/>}
    >
      <View style={[d.header,{paddingTop:insets.top+16}]}>
        <View style={d.headerAccent}/>
        <View style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between"}}>
          <View style={{flex:1}}>
            <Text style={d.greet}>{greet}</Text>
            <Text style={d.title}>Dashboard</Text>
            <Text style={d.sub}>Week {weekNum} · {dateStr}</Text>
          </View>
          <View style={d.avatar}><Text style={d.avatarTxt}>AU</Text></View>
        </View>
        <View style={d.searchBar}>
          <Text style={{fontSize:15,color:colors.textTer,marginRight:8}}>⌕</Text>
          <TextInput style={{flex:1,fontFamily:fonts.body,fontSize:14,color:colors.textPrimary}} placeholder="Search doctors, visits…" placeholderTextColor={colors.textTer} value={search} onChangeText={setSearch}/>
        </View>
      </View>

      <View style={d.grid}>
        <StatCard icon="✦" label="Doctors"  value={doctors.length}    sub="All active"    color={colors.brand}     delay={0}  />
        <StatCard icon="◎" label="Visits"   value={weekVisits.length} sub="In progress"   color={colors.moduleAct} delay={60} />
        <StatCard icon="৳" label="Sales"    value="2.1 Cr"            sub="This week"     color={colors.gold}      delay={120}/>
        <StatCard icon="%" label="Target"   value={`${targetPct}%`}   sub="On track"      color={colors.success}   delay={180}/>
      </View>

      <View style={d.secHead}><View style={d.secBar}/><Text style={d.secTitle}>Quick actions</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:10,paddingBottom:4}}>
        {[
          {label:"Log visit",     sub:"Record today's visit", screen:"LogVisit",  icon:"📋", color:colors.brand},
          {label:"Doctors",       sub:"Master data",          screen:"Doctors",   icon:"🩺", color:colors.moduleAct},
          {label:"Visit log",     sub:"All transactions",     screen:"Activity",  icon:"📊", color:colors.gold},
          {label:"Activity log",  sub:"Audit · sheet sync",   screen:"Activity",  icon:"🔄", color:"#8B5CF6"},
        ].map(item=>(
          <TouchableOpacity key={item.label} style={[d.quickCard,{borderColor:item.color+"30"}]} onPress={()=>navigation.navigate(item.screen)} activeOpacity={0.85}>
            <View style={[d.quickIcon,{backgroundColor:item.color+"15"}]}><Text style={{fontSize:22}}>{item.icon}</Text></View>
            <Text style={[d.quickLabel,{color:item.color}]}>{item.label}</Text>
            <Text style={d.quickSub}>{item.sub}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={d.secHead}><View style={d.secBar}/><Text style={d.secTitle}>Zone performance</Text></View>
      <View style={[d.card,{marginHorizontal:16}]}>
        {Object.keys(zoneCounts).length===0
          ? <Text style={d.empty}>No data yet — pull to refresh</Text>
          : Object.entries(zoneCounts).map(([zone,count],i,arr)=>{
              const pct = Math.round((count/doctors.length)*100);
              const col = ZONE_COLORS[i%ZONE_COLORS.length];
              return (
                <View key={zone} style={[d.zoneRow, i<arr.length-1&&{borderBottomWidth:1,borderBottomColor:colors.border}]}>
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
        <View style={d.secBar}/>
        <Text style={d.secTitle}>Recent visits</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("Activity")}><Text style={d.secAction}>View all</Text></TouchableOpacity>
      </View>
      <View style={[d.card,{marginHorizontal:16}]}>
        {recentVisits.length===0
          ? <Text style={d.empty}>No visits logged yet</Text>
          : recentVisits.map((v,i)=>(
              <View key={i} style={[d.visitRow, i<recentVisits.length-1&&{borderBottomWidth:1,borderBottomColor:colors.border}]}>
                <View style={d.visitBadge}><Text style={d.visitBadgeTxt}>#{v.intEnroll||v.enroll}</Text></View>
                <View style={{flex:1}}>
                  <Text style={d.visitName}>Enrol #{v.intEnroll||v.enroll}</Text>
                  <Text style={d.visitMeta}>{v.strFirmType||v.firmType} · Wk {v.intWeek||v.week}</Text>
                </View>
                <Text style={d.visitDate}>{v.strDate||v.date}</Text>
              </View>
            ))
        }
      </View>
    </ScrollView>
  );
}

const d = StyleSheet.create({
  header:      { paddingHorizontal:20, paddingBottom:16, backgroundColor:colors.surface, borderBottomWidth:1, borderBottomColor:colors.border },
  headerAccent:{ height:3, backgroundColor:colors.brand, marginHorizontal:-20, marginBottom:16 },
  greet:       { fontFamily:fonts.body, fontSize:13, color:colors.textSec },
  title:       { fontFamily:fonts.display, fontSize:30, fontWeight:"800", color:colors.textPrimary, letterSpacing:-0.4, marginTop:2 },
  sub:         { fontFamily:fonts.mono, fontSize:11, color:colors.textTer, marginTop:4 },
  avatar:      { width:44, height:44, borderRadius:22, backgroundColor:colors.brand, alignItems:"center", justifyContent:"center", borderWidth:2, borderColor:colors.brandMid },
  avatarTxt:   { color:"#fff", fontFamily:fonts.label, fontSize:13, fontWeight:"800" },
  searchBar:   { flexDirection:"row", alignItems:"center", backgroundColor:colors.surfaceUp, borderRadius:12, paddingHorizontal:14, paddingVertical:10, marginTop:14, borderWidth:1.5, borderColor:colors.border },
  grid:        { flexDirection:"row", flexWrap:"wrap", paddingHorizontal:12, paddingTop:16, gap:10 },
  statCard:    { width:"47%", backgroundColor:colors.surface, borderRadius:16, padding:14, borderWidth:1, borderColor:colors.border, overflow:"hidden", shadowColor:"#000", shadowOpacity:0.04, shadowRadius:6, elevation:1 },
  statBar:     { position:"absolute", top:0, left:0, right:0, height:3, borderRadius:16 },
  statIcon:    { width:32, height:32, borderRadius:9, alignItems:"center", justifyContent:"center", marginBottom:8 },
  statVal:     { fontFamily:fonts.display, fontSize:26, fontWeight:"800", letterSpacing:-0.5 },
  statLbl:     { fontFamily:fonts.label, fontSize:10, color:colors.textSec, marginTop:3, textTransform:"uppercase", letterSpacing:0.9 },
  statSub:     { fontFamily:fonts.body, fontSize:10.5, color:colors.textTer, marginTop:2 },
  secHead:     { flexDirection:"row", alignItems:"center", gap:8, paddingHorizontal:20, marginTop:24, marginBottom:10 },
  secBar:      { width:3, height:14, backgroundColor:colors.brand, borderRadius:2 },
  secTitle:    { fontFamily:fonts.label, fontSize:11, fontWeight:"700", color:colors.textSec, textTransform:"uppercase", letterSpacing:1.1, flex:1 },
  secAction:   { fontFamily:fonts.body, fontSize:12, color:colors.brand, fontWeight:"600" },
  card:        { backgroundColor:colors.surface, borderRadius:16, borderWidth:1, borderColor:colors.border, overflow:"hidden" },
  empty:       { padding:22, color:colors.textTer, fontFamily:fonts.body, fontSize:13, textAlign:"center" },
  quickCard:   { width:140, backgroundColor:colors.surface, borderRadius:16, padding:14, borderWidth:1, shadowColor:"#000", shadowOpacity:0.04, shadowRadius:6, elevation:1 },
  quickIcon:   { width:44, height:44, borderRadius:13, alignItems:"center", justifyContent:"center", marginBottom:10 },
  quickLabel:  { fontFamily:fonts.label, fontSize:13, fontWeight:"700", marginBottom:3 },
  quickSub:    { fontFamily:fonts.body, fontSize:11, color:colors.textTer, lineHeight:15 },
  zoneRow:     { flexDirection:"row", alignItems:"center", gap:12, paddingHorizontal:14, paddingVertical:14 },
  zoneDot:     { width:8, height:8, borderRadius:4, flexShrink:0, marginTop:2 },
  zoneName:    { fontFamily:fonts.body, fontSize:13, color:colors.textPrimary, fontWeight:"600" },
  zonePct:     { fontFamily:fonts.mono, fontSize:11 },
  progBg:      { height:3, backgroundColor:colors.surfaceHigh, borderRadius:2 },
  progFill:    { height:3, borderRadius:2 },
  visitRow:    { flexDirection:"row", alignItems:"center", gap:12, paddingHorizontal:14, paddingVertical:14 },
  visitBadge:  { width:40, height:40, borderRadius:10, backgroundColor:colors.surfaceUp, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:colors.brandBorder },
  visitBadgeTxt:{ fontFamily:fonts.mono, fontSize:9, color:colors.brand, fontWeight:"700" },
  visitName:   { fontFamily:fonts.body, fontSize:13, color:colors.textPrimary, fontWeight:"600" },
  visitMeta:   { fontFamily:fonts.body, fontSize:11, color:colors.textSec, marginTop:2 },
  visitDate:   { fontFamily:fonts.mono, fontSize:10, color:colors.textTer },
});
