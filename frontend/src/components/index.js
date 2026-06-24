// src/components/index.js
import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Animated, Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { colors, S, fonts } from "../theme";

export function TagLabel({ text }) {
  return (
    <View style={S.tagLabel}>
      <View style={S.tagLabelBar} />
      <Text style={S.tagLabelText}>{text}</Text>
    </View>
  );
}

export function SectionDivider({ label }) {
  return (
    <View style={S.sectionDiv}>
      <View style={S.sectionDivLine} />
      <Text style={S.sectionDivText}>{label}</Text>
      <View style={S.sectionDivLine} />
    </View>
  );
}

export function Badge({ mode }) {
  const map = {
    new:  [S.badgeNew,  S.badgeTextNew,  "READY"],
    edit: [S.badgeEdit, S.badgeTextEdit, "EDITING"],
    ok:   [S.badgeOk,   S.badgeTextOk,   "SAVED"],
  };
  const [bg, textStyle, label] = map[mode] || map.new;
  return <View style={[S.badge, bg]}><Text style={textStyle}>{label}</Text></View>;
}

export function HeaderBand({ color, icon, title, sub, badge, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: color, paddingTop: insets.top + 18, paddingBottom: 22, paddingHorizontal: 20 }}>
      {navigation && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, alignSelf: "flex-start" }}
        >
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "700", marginTop: -1 }}>‹</Text>
          </View>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: "600" }}>Back</Text>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", gap: 14, flex: 1, alignItems: "center" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 26 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "serif", fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.3 }}>{title}</Text>
            <Text style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.70)", marginTop: 2 }}>{sub}</Text>
          </View>
        </View>
        {badge && <Badge mode={badge} />}
      </View>
    </View>
  );
}

export function FormField({
  label, value, onChangeText,
  placeholder = "", keyboardType = "default",
  editable = true, error = null, hint = null, required = false,
  style,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ flex: 1, marginBottom: 16 }, style]}>
      <Text style={S.label}>
        {label}
        {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <TextInput
        style={[S.input, focused && S.inputFocused, !editable && S.inputDisabled, error && S.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        keyboardType={keyboardType}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text style={S.errHint}>{error}</Text>}
      {!error && hint && <Text style={S.hint}>{hint}</Text>}
    </View>
  );
}

export function PickerField({ label, value, onValueChange, items, required = false, style }) {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
      Animated.timing(bgAnim,    { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeSheet = (val) => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }),
      Animated.timing(bgAnim,    { toValue: 0,   duration: 220, useNativeDriver: true }),
    ]).start(() => {
      setOpen(false);
      if (val !== undefined) onValueChange(val);
    });
  };

  return (
    <View style={[{ flex: 1, marginBottom: 16 }, style]}>
      <Text style={S.label}>
        {label}
        {required ? <Text style={{ color: "#E57373" }}> *</Text> : null}
      </Text>
      <TouchableOpacity
        onPress={openSheet}
        style={{ backgroundColor: "#251114", borderWidth: 1.5, borderColor: value ? "#B8832A" : "#3D1D20", borderRadius: 13, paddingHorizontal: 15, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      >
        <Text style={{ color: value ? "#F5EDE8" : "#6B4A47", fontSize: 15 }}>
          {value || "— Select —"}
        </Text>
        <Text style={{ color: "#B8832A", fontSize: 14 }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="none" onRequestClose={() => closeSheet()}>
        <Animated.View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end", opacity: bgAnim }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => closeSheet()} />
          <Animated.View style={{ backgroundColor: "#1C0B0D", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: "#3D1D20", paddingBottom: 32, transform: [{ translateY: slideAnim }] }}>
            <View style={{ alignItems: "center", paddingVertical: 14 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#3D1D20" }} />
            </View>
            <Text style={{ fontFamily: "sans-serif-medium", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", color: "#B8832A", paddingHorizontal: 20, marginBottom: 12 }}>{label}</Text>
            {items.map((item, i) => (
              <TouchableOpacity
                key={item}
                onPress={() => closeSheet(item)}
                style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: i === 0 ? 1 : 0, borderBottomWidth: 1, borderColor: "#2E1518", backgroundColor: value === item ? "#251114" : "transparent", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Text style={{ color: value === item ? "#D4A84A" : "#F5EDE8", fontSize: 16, fontWeight: value === item ? "700" : "400" }}>{item}</Text>
                {value === item && <Text style={{ color: "#B8832A", fontSize: 16 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

export function LockedField({ label, value, mono = false, style }) {
  return (
    <View style={[S.lockedField, style]}>
      <Text style={S.lockedLabel}>{label}</Text>
      <Text style={[S.lockedValue, mono && { fontFamily: fonts.mono, fontSize: 14 }]} numberOfLines={1} ellipsizeMode="tail">
        {value || "—"}
      </Text>
    </View>
  );
}

export function SearchPanel({ title, value, onChangeText, onSearch, onClear, placeholder = "e.g. 565609", loading = false }) {
  return (
    <View style={S.searchPanel}>
      <Text style={S.searchPanelLabel}>{title}</Text>
      <View style={[S.row, { alignItems: "center" }]}>
        <TextInput
          style={[S.input, { flex: 1, backgroundColor: colors.card }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkFaint}
          keyboardType="numeric"
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity style={[S.btnSmallShape, { marginLeft: 8 }]} onPress={onSearch} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={S.btnSmallText}>Search</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[S.btnSmallShape, { marginLeft: 6, backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.dangerBorder }]} onPress={onClear}>
          <Text style={{ color: colors.danger, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function FirmTypePills({ types, selected, onSelect }) {
  if (!types || types.length <= 1) return null;
  return (
    <View>
      <SectionDivider label="Select Firm Type" />
      <View style={S.ftPillRow}>
        {types.map(ft => (
          <TouchableOpacity key={ft} style={[S.ftPillShape, selected === ft && { borderColor: colors.navy, backgroundColor: colors.navySoft }]} onPress={() => onSelect(ft)}>
            <Text style={[S.ftPillText, selected === ft && S.ftPillTextOn]}>{ft}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function InfoBanner({ text }) {
  return (
    <View style={S.infoBanner}>
      <Text style={{ fontSize: 15 }}>🌾</Text>
      <Text style={S.infoBannerText}>{text}</Text>
    </View>
  );
}

export function WarnBanner({ text, show = true }) {
  if (!show) return null;
  return (
    <View style={S.warnBanner}>
      <Text style={{ fontSize: 15 }}>⚠</Text>
      <Text style={S.warnBannerText}>{text}</Text>
    </View>
  );
}

export function ValidationBox({ errors }) {
  if (!errors || !errors.length) return null;
  return (
    <View style={S.valBox}>
      <Text style={S.valBoxTitle}>Please fix:</Text>
      {errors.map((e, i) => <Text key={i} style={S.valBoxText}>• {e}</Text>)}
    </View>
  );
}

export function TsPill({ timestamp, show }) {
  if (!show || !timestamp) return null;
  return (
    <View style={S.tsPill}>
      <Text style={{ fontSize: 14 }}>✓</Text>
      <Text style={S.tsPillText}>{timestamp}</Text>
    </View>
  );
}

export function PrimaryBtn({ label, onPress, loading = false, disabled = false }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[S.btnPrimaryShape, (disabled || loading) && { opacity: 0.5 }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={S.btnPrimaryText}>{label}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

export function GhostBtn({ label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={S.btnGhost}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={S.btnGhostText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ModeToggle({ options, selected, onSelect }) {
  return (
    <View style={S.modeRow}>
      {options.map(opt => (
        <TouchableOpacity key={opt.value} style={[S.modeBtnShape, selected === opt.value && { backgroundColor: colors.card }]} onPress={() => onSelect(opt.value)}>
          <Text style={[S.modeBtnText, selected === opt.value && S.modeBtnTextOn]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function EmptyState({ icon = "📋", title, sub }) {
  return (
    <View style={S.emptyState}>
      <View style={S.emptyIconWrap}><Text style={S.emptyIcon}>{icon}</Text></View>
      <Text style={S.emptyText}>{title}</Text>
      <Text style={S.emptySub}>{sub}</Text>
    </View>
  );
}

export const Toast = React.forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [msg,  setMsg]  = useState("");
  const [type, setType] = useState("ok");
  const insets     = useSafeAreaInsets();
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const timer      = useRef(null);

  React.useImperativeHandle(ref, () => ({
    show(message, toastType = "ok") {
      setMsg(message);
      setType(toastType);
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }),
      ]).start();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false));
      }, 3200);
    },
  }));

  if (!visible) return null;

  const bg   = type === "ok" ? colors.success : type === "warn" ? colors.warning : colors.danger;
  const icon = type === "ok" ? "✓" : "⚠";

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, top: insets.top + 12, opacity, transform: [{ translateY }] }]}>
      <Text style={{ fontSize: 15, color: "#fff" }}>{icon}</Text>
      <Text style={styles.toastText}>{msg}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    position: "absolute", left: 18, right: 18,
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 15, borderRadius: 16,
    zIndex: 999, elevation: 8,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
  },
  toastText: { fontFamily: fonts.body, fontSize: 14, fontWeight: "600", color: "#fff", flex: 1, lineHeight: 19 },
});

export function FadeIn({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, bounciness: 5 }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
