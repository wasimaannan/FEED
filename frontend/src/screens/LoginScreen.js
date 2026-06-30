// src/screens/LoginScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { forgotUserPassword } from "../api";
import { PickerField } from "../components";

// ── Brand colors matching your existing theme ──────────────────
const C = {
  bg:       "#F4F6F4",
  surface:  "#FFFFFF",
  border:   "#D8E4DA",
  brand:    "#0F5432",
  brandMid: "#1A6B42",
  gold:     "#C8872A",
  goldLight:"#E4A84A",
  text:     "#1A2E1F",
  textSec:  "#4A6B52",
  textTer:  "#8AA894",
  danger:   "#C0392B",
};

// ── Dev bypass — set to true to skip login ─────────────────────
const DEV_BYPASS = true;

const AVAILABLE_ZONES = ["HQ", "East", "West", "North", "South", "Central"];

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login, signup, devBypassLogin } = useAuth();

  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState(""); // maps to Username
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState(""); // maps to FullName
  const [empId,    setEmpId]    = useState(""); // maps to EnrollID
  const [zone,     setZone]     = useState("HQ"); // maps to ZoneName
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const fadeIn  = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.spring(slideUp, { toValue:0, useNativeDriver:true, bounciness:5 }),
    ]).start();
  }, []);

  const goToApp = () => devBypassLogin();

  const handleSubmit = async () => {
    setError("");
    
    if (mode === "login") {
      if (!empId.trim() || !password.trim()) {
        setError("Please fill in Enroll ID and Password");
        return;
      }
      
      const parsedId = parseInt(empId.trim(), 10);
      if (isNaN(parsedId)) {
        setError("Enroll ID must be a valid number");
        return;
      }

      setLoading(true);
      try {
        await login(parsedId, password);
      } catch (err) {
        setError(err.message || "Invalid Enroll ID or Password");
      } finally {
        setLoading(false);
      }
    } else {
      // signup mode
      if (!name.trim() || !empId.trim() || !email.trim() || !password.trim()) {
        setError("Please fill in all fields");
        return;
      }

      const parsedId = parseInt(empId.trim(), 10);
      if (isNaN(parsedId)) {
        setError("Enroll ID must be a valid number");
        return;
      }

      setLoading(true);
      try {
        await signup(parsedId, email.trim(), name.trim(), password, zone);
      } catch (err) {
        setError(err.message || "Failed to create account");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!empId.trim()) {
      setError("Please enter your Enroll ID first to request a password reset");
      return;
    }

    const parsedId = parseInt(empId.trim(), 10);
    if (isNaN(parsedId)) {
      setError("Enroll ID must be a valid number");
      return;
    }

    setLoading(true);
    try {
      await forgotUserPassword(parsedId);
      Alert.alert("Success", "Password reset request has been sent.");
    } catch (err) {
      setError(err.message || "Forgot password request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:C.bg }} behavior={Platform.OS==="ios"?"padding":undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity:fadeIn, transform:[{translateY:slideUp}] }]}>
          <View style={styles.logoBox}>
            <Text style={styles.logoF}>F</Text>
          </View>
          <Text style={styles.appName}>FEED</Text>
          <Text style={styles.appSub}>Field Entry & Enrollment Data</Text>
          <Text style={styles.appOrg}>Akij Group · Field Operations</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View style={[styles.card, { opacity:fadeIn, transform:[{translateY:slideUp}] }]}>

          {/* Toggle */}
          <View style={styles.toggle}>
            {["login","signup"].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, mode===m && styles.toggleBtnOn]}
                onPress={() => { setMode(m); setError(""); }}
              >
                <Text style={[styles.toggleTxt, mode===m && styles.toggleTxtOn]}>
                  {m==="login" ? "Sign in" : "Create account"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Signup-only fields */}
          {mode === "signup" && (
            <>
              <Field label="Full name" value={name} onChange={setName} placeholder="e.g. Wasim Annan" />
              <Field label="Enroll ID" value={empId} onChange={setEmpId} placeholder="e.g. 1001" keyboardType="numeric" />
              <Field label="Username / Email" value={email} onChange={setEmail} placeholder="you@akijfeed.com" keyboardType="email-address" />
              
              <View style={{ marginBottom: 14 }}>
                <PickerField
                  label="Zone Name"
                  value={zone}
                  onValueChange={setZone}
                  items={AVAILABLE_ZONES}
                />
              </View>
            </>
          )}

          {/* Login-only fields */}
          {mode === "login" && (
            <Field label="Enroll ID" value={empId} onChange={setEmpId} placeholder="e.g. 1001" keyboardType="numeric" />
          )}

          <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" secure />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.btn, loading && {opacity:0.7}]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.btnTxt}>{mode==="login" ? "Sign in" : "Create account"}</Text>
            }
          </TouchableOpacity>

          {mode === "login" && (
            <TouchableOpacity style={styles.forgotWrap} onPress={handleForgotPassword}>
              <Text style={styles.forgotTxt}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Dev bypass */}
        {DEV_BYPASS && (
          <TouchableOpacity style={styles.devBtn} onPress={goToApp}>
            <Text style={styles.devTxt}>⚡ Dev — skip login</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>FEED Entry System · v1.0.1</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType, secure }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom:14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.textTer}
        keyboardType={keyboardType || "default"}
        secureTextEntry={!!secure}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:       { flexGrow:1, paddingHorizontal:24 },
  logoWrap:     { alignItems:"center", marginBottom:32 },
  logoBox:      { width:76, height:76, borderRadius:24, backgroundColor:C.brand, alignItems:"center", justifyContent:"center", marginBottom:16, shadowColor:C.brand, shadowOpacity:0.4, shadowRadius:18, shadowOffset:{width:0,height:8}, elevation:10 },
  logoF:        { fontSize:38, fontWeight:"800", color:"#fff", fontFamily:"serif" },
  appName:      { fontSize:30, fontWeight:"800", color:C.text, fontFamily:"serif", letterSpacing:4 },
  appSub:       { fontSize:12, color:C.textSec, marginTop:5, letterSpacing:0.3 },
  appOrg:       { fontSize:11, color:C.gold, marginTop:4, fontWeight:"600", letterSpacing:0.5 },
  card:         { backgroundColor:C.surface, borderRadius:24, padding:24, borderWidth:1, borderColor:C.border, shadowColor:"#000", shadowOpacity:0.06, shadowRadius:20, shadowOffset:{width:0,height:6}, elevation:4 },
  toggle:       { flexDirection:"row", backgroundColor:C.bg, borderRadius:14, padding:4, marginBottom:22, borderWidth:1, borderColor:C.border },
  toggleBtn:    { flex:1, paddingVertical:10, borderRadius:11, alignItems:"center" },
  toggleBtnOn:  { backgroundColor:C.brand, shadowColor:C.brand, shadowOpacity:0.3, shadowRadius:8, elevation:4 },
  toggleTxt:    { fontSize:13, fontWeight:"600", color:C.textTer },
  toggleTxtOn:  { color:"#fff", fontWeight:"700" },
  label:        { fontSize:11, fontWeight:"700", color:C.textSec, letterSpacing:1, textTransform:"uppercase", marginBottom:7 },
  input:        { backgroundColor:C.bg, borderWidth:1.5, borderColor:C.border, borderRadius:13, paddingHorizontal:14, paddingVertical:13, fontSize:15, color:C.text },
  inputFocused: { borderColor:C.brand, backgroundColor:C.surface },
  error:        { fontSize:12, color:C.danger, marginBottom:12, textAlign:"center" },
  btn:          { backgroundColor:C.brand, borderRadius:14, paddingVertical:15, alignItems:"center", marginTop:6, shadowColor:C.brand, shadowOpacity:0.35, shadowRadius:12, shadowOffset:{width:0,height:6}, elevation:6 },
  btnTxt:       { color:"#fff", fontSize:15, fontWeight:"700", letterSpacing:0.3 },
  forgotWrap:   { marginTop:14, alignItems:"center" },
  forgotTxt:    { fontSize:13, color:C.brandMid, fontWeight:"600" },
  devBtn:       { marginTop:20, alignSelf:"center", paddingHorizontal:18, paddingVertical:10, borderRadius:20, backgroundColor:C.surface, borderWidth:1, borderColor:C.border },
  devTxt:       { fontSize:12, color:C.gold, fontWeight:"700" },
  footer:       { textAlign:"center", color:C.textTer, fontSize:11, marginTop:28 },
});
