import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, Modal, FlatList, Easing, Pressable } from "react-native";
import { colors, fonts, S } from "../theme";

// ── Motion ───────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, style }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(14)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue:1, duration:360, delay, easing:Easing.out(Easing.cubic), useNativeDriver:true }),
      Animated.timing(ty, { toValue:0, duration:320, delay, easing:Easing.out(Easing.back(1.15)), useNativeDriver:true }),
    ]).start();
  }, []);
  return <Animated.View style={[{opacity:op, transform:[{translateY:ty}]}, style]}>{children}</Animated.View>;
}

export function PopIn({ children, delay = 0, style }) {
  const sc = useRef(new Animated.Value(0.65)).current;
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(sc, { toValue:1, useNativeDriver:true, delay, friction:6, tension:160 }),
      Animated.timing(op, { toValue:1, duration:200, delay, useNativeDriver:true }),
    ]).start();
  }, []);
  return <Animated.View style={[{opacity:op, transform:[{scale:sc}]}, style]}>{children}</Animated.View>;
}

function usePress(to=0.96) {
  const sc = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(sc, {toValue:to, useNativeDriver:true, friction:8, tension:300}).start();
  const onOut = () => Animated.spring(sc, {toValue:1,  useNativeDriver:true, friction:5, tension:200}).start();
  return { sc, onIn, onOut };
}

// ── Header ───────────────────────────────────────────────────────
export function ScreenHeader({ title, sub, icon, badge }) {
  return (
    <FadeIn>
      <View style={hdr.wrap}>
        <View style={hdr.accent} />
        <View style={hdr.row}>
          <View style={{flex:1}}>
            <Text style={hdr.eyebrow}>AKIJ FEED</Text>
            <Text style={hdr.title}>{title}</Text>
            {sub && <Text style={hdr.sub}>{sub}</Text>}
          </View>
          <PopIn delay={80}>
            <View style={hdr.iconBox}><Text style={{fontSize:22}}>{icon}</Text></View>
          </PopIn>
        </View>
        {badge && <View style={{marginTop:10}}><PopIn delay={140}><Badge mode={badge}/></PopIn></View>}
      </View>
    </FadeIn>
  );
}
const hdr = StyleSheet.create({
  wrap:    { paddingHorizontal:20, paddingBottom:16, borderBottomWidth:1, borderBottomColor:colors.border },
  accent:  { height:3, backgroundColor:colors.brand, marginHorizontal:-20, marginBottom:16 },
  row:     { flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between" },
  eyebrow: { fontFamily:fonts.label, fontSize:10, fontWeight:"700", letterSpacing:2, textTransform:"uppercase", color:colors.brand, marginBottom:4 },
  title:   { fontFamily:fonts.display, fontSize:28, fontWeight:"700", color:colors.textPrimary, letterSpacing:0.2 },
  sub:     { fontFamily:fonts.body, fontSize:13, color:colors.textSec, marginTop:3 },
  iconBox: { width:46, height:46, borderRadius:13, backgroundColor:colors.surfaceUp, borderWidth:1.5, borderColor:colors.borderMid, alignItems:"center", justifyContent:"center" },
});

// ── Badge ────────────────────────────────────────────────────────
export function Badge({ mode }) {
  const m = { new:[S.badgeNew,S.badgeTextNew,"● READY"], edit:[S.badgeEdit,S.badgeTextEdit,"✎ EDITING"], ok:[S.badgeOk,S.badgeTextOk,"✓ SAVED"] };
  const [bg,tx,lbl] = m[mode]||m.new;
  return <View style={[S.badge,bg]}><Text style={tx}>{lbl}</Text></View>;
}

// ── Tag Label ─────────────────────────────────────────────────────
export function TagLabel({ text }) {
  return <View style={S.tagLabel}><View style={S.tagLabelBar}/><Text style={S.tagLabelText}>{text}</Text></View>;
}

// ── Section Divider ───────────────────────────────────────────────
export function SectionDivider({ label }) {
  return (
    <View style={S.sectionDiv}>
      <View style={S.sectionDivLine}/>
      <Text style={S.sectionDivText}>{label}</Text>
      <View style={S.sectionDivLine}/>
    </View>
  );
}

// ── Form Field ────────────────────────────────────────────────────
export function FormField({ label, value, onChangeText, placeholder="", keyboardType="default", editable=true, error=null, hint=null, required=false, multiline=false, style }) {
  const [focused, setFocused] = useState(false);
  const glow = useRef(new Animated.Value(0)).current;
  const onFocus = () => { setFocused(true);  Animated.timing(glow, {toValue:1, duration:200, useNativeDriver:false}).start(); };
  const onBlur  = () => { setFocused(false); Animated.timing(glow, {toValue:0, duration:260, useNativeDriver:false}).start(); };
  const bc = error ? colors.danger : glow.interpolate({inputRange:[0,1], outputRange:[colors.borderMid, colors.brand]});
  return (
    <View style={[{flex:1, marginBottom:14}, style]}>
      <Text style={S.label}>{label}{required&&<Text style={{color:colors.danger}}> *</Text>}</Text>
      <Animated.View style={{borderRadius:12, borderWidth:1.5, borderColor:bc, overflow:"hidden"}}>
        <TextInput
          style={[S.input, {borderWidth:0, borderRadius:11}, !editable&&{opacity:0.38}, multiline&&{minHeight:80, textAlignVertical:"top", paddingTop:12}]}
          value={value} onChangeText={onChangeText} placeholder={placeholder}
          placeholderTextColor={colors.textTer} keyboardType={keyboardType}
          editable={editable} multiline={multiline}
          onFocus={onFocus} onBlur={onBlur}
        />
      </Animated.View>
      {error&&<Text style={S.errHint}>⚠ {error}</Text>}
      {!error&&hint&&<Text style={S.hint}>{hint}</Text>}
    </View>
  );
}

// ── Custom Picker ─────────────────────────────────────────────────
export function PickerField({ label, value, onValueChange, items, required=false, style }) {
  const [open, setOpen] = useState(false);
  const slide = useRef(new Animated.Value(400)).current;
  const bg    = useRef(new Animated.Value(0)).current;
  const openM = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(slide, {toValue:0, useNativeDriver:true, friction:9, tension:110}),
      Animated.timing(bg,    {toValue:1, duration:250, useNativeDriver:false}),
    ]).start();
  };
  const closeM = () => {
    Animated.parallel([
      Animated.timing(slide, {toValue:400, duration:210, easing:Easing.in(Easing.cubic), useNativeDriver:true}),
      Animated.timing(bg,    {toValue:0,   duration:200, useNativeDriver:false}),
    ]).start(()=>setOpen(false));
  };
  const select = v => { onValueChange(v); closeM(); };
  const bgC = bg.interpolate({inputRange:[0,1], outputRange:["rgba(13,31,19,0)","rgba(13,31,19,0.5)"]});
  return (
    <View style={[{flex:1, marginBottom:14}, style]}>
      <Text style={S.label}>{label}{required&&<Text style={{color:colors.danger}}> *</Text>}</Text>
      <TouchableOpacity style={pk.trigger} onPress={openM} activeOpacity={0.8}>
        <Text style={[pk.triggerTxt, !value&&{color:colors.textTer}]} numberOfLines={1}>{value||"Select…"}</Text>
        <View style={pk.chevBox}><Text style={pk.chev}>›</Text></View>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="none" onRequestClose={closeM} statusBarTranslucent>
        <Animated.View style={[{flex:1, justifyContent:"flex-end"}, {backgroundColor:bgC}]}>
          <Pressable style={{flex:1}} onPress={closeM}/>
          <Animated.View style={[pk.sheet, {transform:[{translateY:slide}]}]}>
            <View style={pk.sheetTop}><View style={pk.handle}/></View>
            <View style={pk.sheetHdr}>
              <Text style={pk.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={closeM} style={pk.closeBtn}><Text style={pk.closeTxt}>✕</Text></TouchableOpacity>
            </View>
            <View style={pk.divider}/>
            <FlatList data={items} keyExtractor={i=>i} style={{maxHeight:340}} contentContainerStyle={{paddingBottom:28}}
              renderItem={({item}) => {
                const sel = item===value;
                return (
                  <TouchableOpacity style={[pk.opt, sel&&pk.optSel]} onPress={()=>select(item)} activeOpacity={0.7}>
                    {sel&&<View style={pk.optBar}/>}
                    <Text style={[pk.optTxt, sel&&pk.optTxtSel]}>{item}</Text>
                    {sel&&<View style={pk.check}><Text style={pk.checkTxt}>✓</Text></View>}
                  </TouchableOpacity>
                );
              }}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}
const pk = StyleSheet.create({
  trigger:    { backgroundColor:colors.surfaceUp, borderWidth:1.5, borderColor:colors.borderMid, borderRadius:12, paddingHorizontal:14, paddingVertical:13, flexDirection:"row", alignItems:"center", justifyContent:"space-between", minHeight:50 },
  triggerTxt: { fontFamily:fonts.body, fontSize:15, color:colors.textPrimary, flex:1, marginRight:8 },
  chevBox:    { width:26, height:26, borderRadius:8, backgroundColor:colors.surfaceHigh, borderWidth:1.5, borderColor:colors.borderStrong, alignItems:"center", justifyContent:"center" },
  chev:       { color:colors.brand, fontSize:18, fontWeight:"300", lineHeight:22, transform:[{rotate:"90deg"}] },
  sheet:      { backgroundColor:colors.surface, borderTopLeftRadius:24, borderTopRightRadius:24, borderTopWidth:1, borderColor:colors.border, paddingHorizontal:20, paddingBottom:36, shadowColor:"#000", shadowOpacity:0.12, shadowRadius:20, shadowOffset:{width:0,height:-4} },
  sheetTop:   { alignItems:"center", paddingTop:12, paddingBottom:2 },
  handle:     { width:36, height:4, borderRadius:2, backgroundColor:colors.borderMid },
  sheetHdr:   { flexDirection:"row", alignItems:"center", paddingVertical:12 },
  sheetTitle: { fontFamily:fonts.display, fontSize:18, fontWeight:"700", color:colors.textPrimary, flex:1 },
  closeBtn:   { width:32, height:32, borderRadius:16, backgroundColor:colors.surfaceUp, borderWidth:1, borderColor:colors.border, alignItems:"center", justifyContent:"center" },
  closeTxt:   { color:colors.textSec, fontSize:13, fontWeight:"700" },
  divider:    { height:2, backgroundColor:colors.brand, marginBottom:6, borderRadius:2, opacity:0.3 },
  opt:        { flexDirection:"row", alignItems:"center", paddingVertical:15, paddingHorizontal:4, borderBottomWidth:1, borderBottomColor:colors.border },
  optSel:     { backgroundColor:"rgba(15,84,50,0.07)", borderRadius:11, paddingHorizontal:10, borderBottomColor:"transparent", marginBottom:2 },
  optBar:     { width:3, height:20, borderRadius:2, backgroundColor:colors.brand, marginRight:12 },
  optTxt:     { fontFamily:fonts.body, fontSize:16, color:colors.textSec, fontWeight:"500", flex:1 },
  optTxtSel:  { color:colors.brand, fontWeight:"700" },
  check:      { width:28, height:28, borderRadius:14, backgroundColor:colors.brand, alignItems:"center", justifyContent:"center" },
  checkTxt:   { color:"#fff", fontSize:13, fontWeight:"800" },
});

// ── Locked Field ──────────────────────────────────────────────────
export function LockedField({ label, value, mono=false, style }) {
  return (
    <View style={[S.lockedField, style]}>
      <Text style={S.lockedLabel}>{label}</Text>
      <Text style={[S.lockedValue, mono&&{fontFamily:fonts.mono, fontSize:14, color:colors.brand}]} numberOfLines={1}>{value||"—"}</Text>
    </View>
  );
}

// ── Search Panel ──────────────────────────────────────────────────
export function SearchPanel({ title, value, onChangeText, onSearch, onClear, placeholder="e.g. 565609", loading=false }) {
  return (
    <FadeIn>
      <View style={S.searchPanel}>
        <Text style={S.searchPanelLabel}>⌕  {title}</Text>
        <View style={[S.row, {alignItems:"center"}]}>
          <TextInput style={[S.input, {flex:1, backgroundColor:colors.surfaceUp}]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textTer} keyboardType="numeric" returnKeyType="search" onSubmitEditing={onSearch}/>
          <TouchableOpacity onPress={onSearch} disabled={loading} style={[S.btnSmall, {marginLeft:8}]}>
            {loading?<ActivityIndicator color="#fff" size="small"/>:<Text style={S.btnSmallText}>Go</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onClear} style={[S.btnSmall, {marginLeft:6, backgroundColor:colors.dangerBg, borderWidth:1, borderColor:colors.dangerBorder}]}>
            <Text style={{color:colors.danger, fontSize:14, fontWeight:"700"}}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeIn>
  );
}

// ── Pill group ────────────────────────────────────────────────────
export function PillGroup({ items, selected, onSelect, multi=false }) {
  const toggle = v => {
    if (!multi) { onSelect(v); return; }
    const arr = Array.isArray(selected) ? selected : [];
    onSelect(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);
  };
  const isOn = v => multi ? (Array.isArray(selected)&&selected.includes(v)) : selected===v;
  return (
    <View style={S.ftPillRow}>
      {items.map(item=>{
        const on = isOn(item);
        const sc = useRef(new Animated.Value(1)).current;
        const onIn  = ()=>Animated.spring(sc,{toValue:0.92,useNativeDriver:true,friction:8,tension:300}).start();
        const onOut = ()=>Animated.spring(sc,{toValue:1,  useNativeDriver:true,friction:5,tension:200}).start();
        return (
          <TouchableOpacity key={item} onPressIn={onIn} onPressOut={onOut} onPress={()=>toggle(item)} activeOpacity={1}>
            <Animated.View style={[S.ftPill, on&&S.ftPillOn, {transform:[{scale:sc}]}]}>
              <Text style={[S.ftPillText, on&&S.ftPillTextOn]}>{item}</Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Buttons ───────────────────────────────────────────────────────
export function PrimaryBtn({ label, onPress, loading=false, disabled=false, style }) {
  const {sc,onIn,onOut} = usePress(0.97);
  return (
    <TouchableOpacity onPressIn={onIn} onPressOut={onOut} onPress={onPress} disabled={disabled||loading} activeOpacity={1}>
      <Animated.View style={[S.btnPrimary, {transform:[{scale:sc}]}, (disabled||loading)&&{opacity:0.45}, style]}>
        {loading?<ActivityIndicator color="#fff" size="small"/>:<Text style={S.btnPrimaryText}>{label}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}
export function GhostBtn({ label, onPress }) {
  const {sc,onIn,onOut} = usePress(0.97);
  return (
    <TouchableOpacity onPressIn={onIn} onPressOut={onOut} onPress={onPress} activeOpacity={1}>
      <Animated.View style={[S.btnGhost, {transform:[{scale:sc}]}]}><Text style={S.btnGhostText}>{label}</Text></Animated.View>
    </TouchableOpacity>
  );
}

// ── Mode Toggle ───────────────────────────────────────────────────
export function ModeToggle({ options, selected, onSelect }) {
  return (
    <View style={S.modeRow}>
      {options.map(opt=>{
        const on = selected===opt.value;
        const {sc,onIn,onOut} = usePress(0.96);
        return (
          <TouchableOpacity key={opt.value} onPressIn={onIn} onPressOut={onOut} onPress={()=>onSelect(opt.value)} activeOpacity={1} style={{flex:1}}>
            <Animated.View style={[S.modeBtn, on&&S.modeBtnOn, {transform:[{scale:sc}]}]}>
              <Text style={[S.modeBtnText, on&&S.modeBtnTextOn]}>{opt.label}</Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Banners ───────────────────────────────────────────────────────
export function InfoBanner({ text }) {
  return (
    <FadeIn>
      <View style={S.infoBanner}>
        <Text style={{fontSize:14, color:colors.brand}}>◈</Text>
        <Text style={S.infoBannerText}>{text}</Text>
      </View>
    </FadeIn>
  );
}
export function WarnBanner({ text, show=true }) {
  const h = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.parallel([
      Animated.spring(h,  {toValue:show?54:0, useNativeDriver:false, friction:9}),
      Animated.timing(op, {toValue:show?1:0,  duration:200, useNativeDriver:false}),
    ]).start();
  },[show]);
  return (
    <Animated.View style={[S.warnBanner, {overflow:"hidden", height:h, opacity:op, marginBottom:show?12:0}]}>
      <Text style={{fontSize:14, color:colors.warning}}>⚠</Text>
      <Text style={S.warnBannerText}>{text}</Text>
    </Animated.View>
  );
}

// ── ValidationBox ─────────────────────────────────────────────────
export function ValidationBox({ errors }) {
  if (!errors||!errors.length) return null;
  return <FadeIn><View style={S.valBox}><Text style={S.valBoxTitle}>Fix before saving:</Text>{errors.map((e,i)=><Text key={i} style={S.valBoxText}>• {e}</Text>)}</View></FadeIn>;
}

// ── TsPill ────────────────────────────────────────────────────────
export function TsPill({ timestamp, show }) {
  const sc = useRef(new Animated.Value(0.7)).current;
  const op = useRef(new Animated.Value(0)).current;
  useEffect(()=>{ if(show){ Animated.parallel([Animated.spring(sc,{toValue:1,useNativeDriver:true,friction:5,tension:180}), Animated.timing(op,{toValue:1,duration:200,useNativeDriver:true})]).start(); } },[show]);
  if (!show||!timestamp) return null;
  return <Animated.View style={[S.tsPill,{opacity:op,transform:[{scale:sc}]}]}><Text style={{fontSize:13,color:colors.success}}>✓</Text><Text style={S.tsPillText}>{timestamp}</Text></Animated.View>;
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon="📋", title, sub }) {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.loop(Animated.sequence([
      Animated.timing(bounce,{toValue:-7,duration:1200,easing:Easing.inOut(Easing.ease),useNativeDriver:true}),
      Animated.timing(bounce,{toValue:0, duration:1200,easing:Easing.inOut(Easing.ease),useNativeDriver:true}),
    ])).start();
  },[]);
  return (
    <FadeIn>
      <View style={S.emptyState}>
        <Animated.View style={[S.emptyIconWrap,{transform:[{translateY:bounce}]}]}><Text style={S.emptyIcon}>{icon}</Text></Animated.View>
        <Text style={S.emptyText}>{title}</Text>
        <Text style={S.emptySub}>{sub}</Text>
      </View>
    </FadeIn>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
export const Toast = React.forwardRef((_,ref)=>{
  const [visible,setVisible]=useState(false);
  const [msg,setMsg]=useState("");
  const [type,setType]=useState("ok");
  const op=useRef(new Animated.Value(0)).current;
  const ty=useRef(new Animated.Value(-20)).current;
  const sc=useRef(new Animated.Value(0.94)).current;
  const timer=useRef(null);
  React.useImperativeHandle(ref,()=>({
    show(message,t="ok"){
      setMsg(message);setType(t);setVisible(true);
      op.setValue(0);ty.setValue(-20);sc.setValue(0.94);
      Animated.parallel([
        Animated.timing(op,{toValue:1,duration:200,useNativeDriver:true}),
        Animated.spring(ty,{toValue:0,useNativeDriver:true,friction:7,tension:160}),
        Animated.spring(sc,{toValue:1,useNativeDriver:true,friction:7,tension:160}),
      ]).start();
      clearTimeout(timer.current);
      timer.current=setTimeout(()=>{
        Animated.parallel([
          Animated.timing(op,{toValue:0,duration:270,useNativeDriver:true}),
          Animated.timing(ty,{toValue:-12,duration:250,useNativeDriver:true}),
        ]).start(()=>setVisible(false));
      },3000);
    },
  }));
  if (!visible) return null;
  const cfg={ok:{bg:colors.successBg,border:colors.successBorder,icon:"✓",tc:colors.success},warn:{bg:colors.warningBg,border:colors.warningBorder,icon:"⚠",tc:colors.warning},err:{bg:colors.dangerBg,border:colors.dangerBorder,icon:"✕",tc:colors.danger}}[type]||{};
  return (
    <Animated.View style={[toast.wrap,{backgroundColor:cfg.bg,borderColor:cfg.border,opacity:op,transform:[{translateY:ty},{scale:sc}]}]}>
      <Text style={{fontSize:13,color:cfg.tc,fontWeight:"800"}}>{cfg.icon}</Text>
      <Text style={[toast.txt,{color:cfg.tc}]}>{msg}</Text>
    </Animated.View>
  );
});
const toast=StyleSheet.create({
  wrap:{position:"absolute",top:14,left:16,right:16,flexDirection:"row",alignItems:"center",gap:10,padding:14,borderRadius:14,borderWidth:1,zIndex:999,elevation:12,shadowColor:"#000",shadowOpacity:0.12,shadowRadius:18,shadowOffset:{width:0,height:4}},
  txt: {fontFamily:fonts.body,fontSize:13.5,fontWeight:"600",flex:1,lineHeight:19},
});
