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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const C = {
  bg:"#FAF7F8", surface:"#FFFFFF", border:"#F0E5EA",
  brand:"#7A2415", brandMid:"#4A1209", gold:"#B85A2A",
  text:"#1F1320", textSec:"#6B5563", textTer:"#A89098", danger:"#D6336C",
};
const DEV_BYPASS = true;
const AVAILABLE_ZONES = ["HQ","East","West","North","South","Central"];
const SUNSET = ["#4A1209","#7A2415","#B85A2A"];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, signup, devBypassLogin } = useAuth();
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [empId,setEmpId]=useState("");
  const [zone,setZone]=useState("HQ");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(50)).current;
  useEffect(()=>{
    Animated.parallel([
      Animated.timing(fadeIn,{toValue:1,duration:450,useNativeDriver:true}),
      Animated.spring(sheetY,{toValue:0,useNativeDriver:true,bounciness:4}),
    ]).start();
  },[]);

  const handleSubmit = async () => {
    setError("");
    if (mode==="login") {
      if (!empId.trim()||!password.trim()){setError("Please fill in Enroll ID and Password");return;}
      const id=parseInt(empId.trim(),10);
      if (isNaN(id)){setError("Enroll ID must be a number");return;}
      setLoading(true);
      try { await login(id,password); }
      catch(e){ setError(e.message||"Invalid Enroll ID or Password"); }
      finally{ setLoading(false); }
    } else {
      if (!name.trim()||!empId.trim()||!email.trim()||!password.trim()){setError("Please fill in all fields");return;}
      const id=parseInt(empId.trim(),10);
      if (isNaN(id)){setError("Enroll ID must be a number");return;}
      setLoading(true);
      try { await signup(id,email.trim(),name.trim(),password,zone); }
      catch(e){ setError(e.message||"Failed to create account"); }
      finally{ setLoading(false); }
    }
  };

  const handleForgot = async () => {
    if (!empId.trim()){setError("Enter your Enrol ID first.");return;}
    if (!password.trim()){setError("Enter your phone number in the Password field first.");return;}
    const id=parseInt(empId.trim(),10);
    if (isNaN(id)){setError("Enrol ID must be a number");return;}
    setLoading(true);
    try {
      await forgotUserPassword({enrollId:id,phone:password.trim()});
      Alert.alert("Request sent","Check with your administrator for recovery.");
    } catch(e){ setError(e.message||"Request failed"); }
    finally{ setLoading(false); }
  };

  return (
    <View style={{flex:1,backgroundColor:"#5B2A86"}}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
        <ScrollView contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <LinearGradient colors={SUNSET} start={{x:0,y:0}} end={{x:1,y:1}} style={[st.hero,{paddingTop:insets.top+32}]}>
            <View style={st.heroDec1}/><View style={st.heroDec2}/>
            <Animated.View style={{opacity:fadeIn,alignItems:"center"}}>
              <View style={st.mark}>
                <Ionicons name="leaf" size={28} color="#fff"/>
              </View>
              <Text style={st.brandLbl}>AKIJ FEED · FIELD OPERATIONS</Text>
              <Text style={st.heroTitle}>FEED Entry System</Text>
              <Text style={st.heroSub}>
                {mode==="login"
                  ? "Sign in with your enrolled credentials to manage doctors, farms and visits"
                  : "Register your enrollment details to get started"}
              </Text>
            </Animated.View>
          </LinearGradient>

          {/* Sheet */}
          <Animated.View style={[st.sheet,{transform:[{translateY:sheetY}],opacity:fadeIn}]}>

            {/* Tabs */}
            <View style={st.tabs}>
              {["login","signup"].map(m=>(
                <TouchableOpacity key={m} style={{flex:1}} onPress={()=>{setMode(m);setError("");}}>
                  {mode===m
                    ? <LinearGradient colors={["#4A1209","#7A2415"]} start={{x:0,y:0}} end={{x:1,y:0}} style={st.tabOn}>
                        <Text style={st.tabTxtOn}>{m==="login"?"Sign in":"Create account"}</Text>
                      </LinearGradient>
                    : <View style={st.tabOff}><Text style={st.tabTxt}>{m==="login"?"Sign in":"Create account"}</Text></View>
                  }
                </TouchableOpacity>
              ))}
            </View>

            {mode==="signup"&&<>
              <Field icon="person-outline"      label="Full name"          value={name}     onChange={setName}     placeholder="Wasim Annan"/>
              <Field icon="finger-print-outline" label="Enroll ID"          value={empId}    onChange={setEmpId}    placeholder="1001" keyboardType="numeric"/>
              <Field icon="mail-outline"         label="Email or username"  value={email}    onChange={setEmail}    placeholder="you@akijfeed.com" keyboardType="email-address"/>
              <View style={{marginBottom:18}}>
                <Text style={st.label}>Zone</Text>
                <PickerField value={zone} onValueChange={setZone} items={AVAILABLE_ZONES}/>
              </View>
            </>}

            {mode==="login"&&
              <Field icon="finger-print-outline" label="Enroll ID" value={empId} onChange={setEmpId} placeholder="1001" keyboardType="numeric"/>
            }

            <Field icon="lock-closed-outline" label="Password" value={password} onChange={setPassword} placeholder="Enter your password" secure/>

            {mode==="login"&&(
              <TouchableOpacity onPress={handleForgot} style={{alignSelf:"flex-end",marginTop:-8,marginBottom:6}}>
                <Text style={st.forgotTxt}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {error?<View style={st.errorBox}><Ionicons name="alert-circle-outline" size={16} color={C.danger}/><Text style={st.errorTxt}>{error}</Text></View>:null}

            <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85} style={[{marginTop:18},loading&&{opacity:0.7}]}>
              <LinearGradient colors={SUNSET} start={{x:0,y:0}} end={{x:1,y:0}} style={st.btn}>
                {loading?<ActivityIndicator color="#fff" size="small"/>:<Text style={st.btnTxt}>{mode==="login"?"Sign in":"Create account"}</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={st.divider}><View style={st.dline}/><Text style={st.dtxt}>or</Text><View style={st.dline}/></View>

            <View style={st.switchRow}>
              <Text style={st.switchTxt}>{mode==="login"?"Don't have an account?":"Already have an account?"}</Text>
              <TouchableOpacity onPress={()=>{setMode(mode==="login"?"signup":"login");setError("");}}>
                <Text style={st.switchLink}>{mode==="login"?" Sign up":" Sign in"}</Text>
              </TouchableOpacity>
            </View>

            {DEV_BYPASS&&(
              <TouchableOpacity style={st.devBtn} onPress={devBypassLogin}>
                <Ionicons name="flash-outline" size={13} color={C.gold}/>
                <Text style={st.devTxt}>Dev — skip login</Text>
              </TouchableOpacity>
            )}
            <Text style={st.footer}>FEED Entry System · v1.0.1 · Akij Group</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({icon,label,value,onChange,placeholder,keyboardType,secure}){
  const [focused,setFocused]=useState(false);
  const [show,setShow]=useState(false);
  return(
    <View style={{marginBottom:18}}>
      <Text style={st.label}>{label}</Text>
      <View style={[st.inputWrap,focused&&st.inputWrapFocused]}>
        <Ionicons name={icon} size={17} color={focused?C.brand:C.textTer} style={{marginRight:10}}/>
        <TextInput
          style={st.input} value={value} onChangeText={onChange}
          placeholder={placeholder} placeholderTextColor={C.textTer}
          keyboardType={keyboardType||"default"}
          secureTextEntry={!!secure&&!show}
          autoCapitalize="none"
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        />
        {secure&&<TouchableOpacity onPress={()=>setShow(!show)} style={{paddingHorizontal:4}}>
          <Ionicons name={show?"eye-off-outline":"eye-outline"} size={18} color={C.textTer}/>
        </TouchableOpacity>}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  hero:            {paddingHorizontal:28,paddingBottom:52,overflow:"hidden",alignItems:"center"},
  heroDec1:        {position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:110,backgroundColor:"rgba(255,255,255,0.10)"},
  heroDec2:        {position:"absolute",bottom:-70,left:-50,width:180,height:180,borderRadius:90,backgroundColor:"rgba(255,255,255,0.06)"},
  mark:            {width:60,height:60,borderRadius:20,backgroundColor:"rgba(255,255,255,0.20)",alignItems:"center",justifyContent:"center",marginBottom:18,borderWidth:1,borderColor:"rgba(255,255,255,0.3)"},
  brandLbl:        {fontSize:10,color:"rgba(255,255,255,0.70)",letterSpacing:2.5,fontWeight:"700",textTransform:"uppercase"},
  heroTitle:       {fontSize:26,fontWeight:"800",color:"#fff",marginTop:6,letterSpacing:-0.5,textAlign:"center"},
  heroSub:         {fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:8,lineHeight:19,textAlign:"center",maxWidth:280},
  sheet:           {backgroundColor:"#fff",borderTopLeftRadius:28,borderTopRightRadius:28,marginTop:-28,paddingHorizontal:24,paddingTop:26,paddingBottom:32,flex:1},
  tabs:            {flexDirection:"row",backgroundColor:"#FAF7F8",borderRadius:12,padding:4,marginBottom:24,gap:4},
  tabOn:           {paddingVertical:11,borderRadius:9,alignItems:"center"},
  tabOff:          {paddingVertical:11,borderRadius:9,alignItems:"center"},
  tabTxt:          {fontSize:13,fontWeight:"700",color:C.textTer},
  tabTxtOn:        {fontSize:13,fontWeight:"700",color:"#fff"},
  label:           {fontSize:11,fontWeight:"700",color:C.textSec,letterSpacing:0.8,textTransform:"uppercase",marginBottom:8},
  inputWrap:       {flexDirection:"row",alignItems:"center",backgroundColor:"#FAF7F8",borderWidth:1.5,borderColor:C.border,borderRadius:12,paddingHorizontal:14},
  inputWrapFocused:{borderColor:C.brand,backgroundColor:"#fff"},
  input:           {flex:1,paddingVertical:13,fontSize:14.5,color:C.text},
  forgotTxt:       {fontSize:12.5,color:C.brand,fontWeight:"600"},
  errorBox:        {flexDirection:"row",alignItems:"center",gap:8,backgroundColor:"rgba(214,51,108,0.08)",borderRadius:10,padding:12,marginTop:10},
  errorTxt:        {fontSize:13,color:C.danger,flex:1},
  btn:             {borderRadius:13,paddingVertical:15,alignItems:"center",shadowColor:"#7A2415",shadowOpacity:0.35,shadowRadius:14,shadowOffset:{width:0,height:7},elevation:6},
  btnTxt:          {color:"#fff",fontSize:15,fontWeight:"700"},
  divider:         {flexDirection:"row",alignItems:"center",gap:12,marginVertical:20},
  dline:           {flex:1,height:1,backgroundColor:C.border},
  dtxt:            {fontSize:10.5,color:C.textTer,textTransform:"uppercase",letterSpacing:1},
  switchRow:       {flexDirection:"row",justifyContent:"center"},
  switchTxt:       {fontSize:13,color:C.textSec},
  switchLink:      {fontSize:13,color:C.brand,fontWeight:"700"},
  devBtn:          {marginTop:22,alignSelf:"center",flexDirection:"row",alignItems:"center",gap:6,paddingHorizontal:16,paddingVertical:9,borderRadius:20,backgroundColor:"#FAF7F8",borderWidth:1,borderColor:C.border},
  devTxt:          {fontSize:12,color:C.gold,fontWeight:"700"},
  footer:          {textAlign:"center",color:C.textTer,fontSize:11,marginTop:18},
});