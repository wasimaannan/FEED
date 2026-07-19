import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import { FadeIn, PopIn } from "../components";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, changePassword } = useAuth();

  const [changePassVisible, setChangePassVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const initials = user && user.fullName 
    ? user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() 
    : "US";

  const handleChangePasswordSubmit = async () => {
    setModalError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setModalError("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setModalError("Password must be at least 6 characters long");
      return;
    }

    setModalLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setChangePassVisible(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password changed successfully");
    } catch (err) {
      setModalError(err.message || "Failed to change password");
    } finally {
      setModalLoading(false);
    }
  };

  const menuItems = [
    {icon:<Ionicons name="medkit-outline" size={18} color="#7A2415" />, label:"Manage doctors",       screen:"Doctors"},
    {icon:<Ionicons name="clipboard-outline" size={18} color="#7A2415" />, label:"All visit records",     screen:"Activity"},
    {icon:<Ionicons name="stats-chart-outline" size={18} color="#7A2415" />, label:"Analytics dashboard",   screen:"Dashboard"},
    {icon:<Ionicons name="key-outline" size={18} color="#7A2415" />, label:"Change password",       action: () => setChangePassVisible(true)},
  ];

  return (
    <ScrollView style={{flex:1,backgroundColor:colors.bg}} contentContainerStyle={{paddingBottom:insets.bottom+88}}>
      {/* Sunset header band */}
      <LinearGradient colors={["#4A1209","#7A2415","#B85A2A"]} start={{x:0,y:0}} end={{x:1,y:1}} style={[pr.header,{paddingTop:insets.top+20}]}>
        <PopIn>
          <View style={pr.avatarWrap}>
            <View style={pr.avatar}><Text style={pr.avatarTxt}>{initials}</Text></View>
          </View>
        </PopIn>
        <FadeIn delay={80}>
          <Text style={pr.name}>{user ? user.fullName : "Field Officer"}</Text>
          <Text style={pr.role}>{user ? (user.username || "Officer") : "Administrator"}</Text>
          <View style={pr.idBadge}><Text style={pr.idTxt}>ID: {user ? user.enrollId : "—"}</Text></View>
        </FadeIn>
      </LinearGradient>

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
          {menuItems.map((item,i,arr)=>(
            <TouchableOpacity 
              key={item.label} 
              style={[pr.menuRow, i<arr.length-1&&{borderBottomWidth:1,borderBottomColor:colors.border}]} 
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen);
                else if (item.action) item.action();
              }} 
              activeOpacity={0.75}
            >
              <View style={pr.menuIcon}>{item.icon}</View>
              <Text style={pr.menuLabel}>{item.label}</Text>
              <Text style={{color:colors.textTer, fontSize:18}}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={200}>
        <TouchableOpacity style={pr.signOut} activeOpacity={0.8} onPress={logout}>
          <Text style={pr.signOutTxt}>Sign out</Text>
        </TouchableOpacity>
      </FadeIn>

      {/* Change Password Modal */}
      <Modal visible={changePassVisible} transparent animationType="slide" onRequestClose={() => setChangePassVisible(false)}>
        <View style={pr.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ width: "100%", alignItems: "center" }}>
            <View style={pr.modalCard}>
              <Text style={pr.modalTitle}>Change Password</Text>
              {modalError ? <Text style={pr.modalError}>{modalError}</Text> : null}
              
              <Text style={pr.modalLabel}>Old Password</Text>
              <TextInput
                secureTextEntry
                style={pr.modalInput}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textTer}
              />

              <Text style={pr.modalLabel}>New Password</Text>
              <TextInput
                secureTextEntry
                style={pr.modalInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textTer}
              />

              <Text style={pr.modalLabel}>Confirm New Password</Text>
              <TextInput
                secureTextEntry
                style={pr.modalInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textTer}
              />

              <View style={pr.modalButtons}>
                <TouchableOpacity 
                  style={[pr.modalBtn, pr.modalBtnCancel]} 
                  onPress={() => { setChangePassVisible(false); setModalError(""); }}
                  disabled={modalLoading}
                >
                  <Text style={pr.modalBtnCancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[pr.modalBtn, pr.modalBtnSave, modalLoading && { opacity: 0.7 }]} 
                  onPress={handleChangePasswordSubmit}
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={pr.modalBtnSaveTxt}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const pr = StyleSheet.create({
  header:      { paddingHorizontal:24, paddingBottom:32, alignItems:"center" },
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
  // Modal layout
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalCard:    { backgroundColor: colors.surface, width: "100%", maxWidth: 340, borderRadius: 20, padding: 22, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 },
  modalTitle:   { fontFamily: fonts.display, fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 16, textAlign: "center" },
  modalLabel:   { fontFamily: fonts.label, fontSize: 11, fontWeight: "700", color: colors.textSec, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6, marginTop: 10 },
  modalInput:   { backgroundColor: colors.surfaceUp, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.textPrimary, marginBottom: 10 },
  modalError:   { fontSize: 12, color: colors.danger, marginBottom: 10, textAlign: "center" },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 22 },
  modalBtn:     { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  modalBtnCancel:{ borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceUp },
  modalBtnCancelTxt:{ color: colors.textSec, fontWeight: "600", fontSize: 14 },
  modalBtnSave:  { backgroundColor: colors.brand },
  modalBtnSaveTxt:{ color: "#fff", fontWeight: "700", fontSize: 14 },
});
