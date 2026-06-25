import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme";
import { FadeIn, PopIn } from "../components";

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{flex:1,backgroundColor:colors.bg}} contentContainerStyle={{paddingBottom:insets.bottom+88}}>
      {/* Green header band */}
      <View style={[pr.header,{paddingTop:insets.top+20}]}>
        <View style={pr.headerAccent}/>
        <PopIn>
          <View style={pr.avatarWrap}>
            <View style={pr.avatar}><Text style={pr.avatarTxt}>AU</Text></View>
          </View>
        </PopIn>
        <FadeIn delay={80}>
          <Text style={pr.name}>Admin User</Text>
          <Text style={pr.role}>Administrator</Text>
          <View style={pr.idBadge}><Text style={pr.idTxt}>ID: AKJ-2024-001</Text></View>
        </FadeIn>
      </View>

      {/* Stats row */}
      <FadeIn delay={120}>
        <View style={pr.statsRow}>
          {[["42","Doctors managed"],["128","Visits this month"],["৳2.1Cr","Sales influenced"]].map(([val,lbl])=>(
            <View key={lbl} style={pr.statItem}>
              <Text style={pr.statVal}>{val}</Text>
              <Text style={pr.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>
      </FadeIn>

      {/* Menu */}
      <FadeIn delay={160}>
        <View style={pr.menuCard}>
          {[
            {icon:"🩺", label:"Manage doctors",       screen:"Doctors"},
            {icon:"📋", label:"All visit records",     screen:"Activity"},
            {icon:"📊", label:"Analytics dashboard",   screen:"Dashboard"},
          ].map((item,i,arr)=>(
            <TouchableOpacity key={item.label} style={[pr.menuRow, i<arr.length-1&&{borderBottomWidth:1,borderBottomColor:colors.border}]} onPress={()=>navigation.navigate(item.screen)} activeOpacity={0.75}>
              <View style={pr.menuIcon}><Text style={{fontSize:18}}>{item.icon}</Text></View>
              <Text style={pr.menuLabel}>{item.label}</Text>
              <Text style={{color:colors.textTer, fontSize:18}}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={200}>
        <TouchableOpacity style={pr.signOut} activeOpacity={0.8}>
          <Text style={pr.signOutTxt}>Sign out</Text>
        </TouchableOpacity>
      </FadeIn>
    </ScrollView>
  );
}

const pr = StyleSheet.create({
  header:      { backgroundColor:colors.brand, paddingHorizontal:24, paddingBottom:32, alignItems:"center" },
  headerAccent:{ height:0 },
  avatarWrap:  { marginBottom:14 },
  avatar:      { width:80, height:80, borderRadius:40, backgroundColor:"rgba(255,255,255,0.2)", alignItems:"center", justifyContent:"center", borderWidth:3, borderColor:"rgba(255,255,255,0.4)" },
  avatarTxt:   { color:"#fff", fontFamily:fonts.label, fontSize:28, fontWeight:"800" },
  name:        { fontFamily:fonts.display, fontSize:22, fontWeight:"700", color:"#fff", textAlign:"center" },
  role:        { fontFamily:fonts.body, fontSize:14, color:"rgba(255,255,255,0.75)", textAlign:"center", marginTop:3 },
  idBadge:     { marginTop:10, backgroundColor:"rgba(255,255,255,0.15)", borderRadius:20, paddingHorizontal:14, paddingVertical:5, borderWidth:1, borderColor:"rgba(255,255,255,0.25)" },
  idTxt:       { fontFamily:fonts.mono, fontSize:11, color:"rgba(255,255,255,0.9)", fontWeight:"600" },
  statsRow:    { flexDirection:"row", marginHorizontal:16, marginTop:-1, backgroundColor:colors.surface, borderRadius:16, borderWidth:1, borderColor:colors.border, overflow:"hidden", shadowColor:"#000", shadowOpacity:0.06, shadowRadius:10, elevation:3 },
  statItem:    { flex:1, alignItems:"center", paddingVertical:18, borderRightWidth:1, borderRightColor:colors.border },
  statVal:     { fontFamily:fonts.display, fontSize:20, fontWeight:"800", color:colors.brand },
  statLbl:     { fontFamily:fonts.body, fontSize:10.5, color:colors.textSec, marginTop:3, textAlign:"center" },
  menuCard:    { margin:16, backgroundColor:colors.surface, borderRadius:16, borderWidth:1, borderColor:colors.border, overflow:"hidden" },
  menuRow:     { flexDirection:"row", alignItems:"center", paddingHorizontal:16, paddingVertical:16, gap:12 },
  menuIcon:    { width:38, height:38, borderRadius:10, backgroundColor:colors.surfaceUp, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:colors.border },
  menuLabel:   { fontFamily:fonts.body, fontSize:15, color:colors.textPrimary, fontWeight:"600", flex:1 },
  signOut:     { margin:16, marginTop:4, backgroundColor:colors.dangerBg, borderRadius:14, padding:16, alignItems:"center", borderWidth:1, borderColor:colors.dangerBorder },
  signOutTxt:  { fontFamily:fonts.label, fontSize:15, fontWeight:"700", color:colors.danger },
});
