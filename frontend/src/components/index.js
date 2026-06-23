// src/components/index.js
import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Animated, StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors, S, fonts } from "../theme";

// ── TagLabel — equipment-tag style section label ─────────────
export function TagLabel({ text }) {
  return (
    <View style={S.tagLabel}>
      <View style={S.tagLabelBar} />
      <Text style={S.tagLabelText}>{text}</Text>
    </View>
  );
}

// ── SectionDivider ────────────────────────────────────────────
export function SectionDivider({ label }) {
  return (
    <View style={S.sectionDiv}>
      <View style={S.sectionDivLine} />
      <Text style={S.sectionDivText}>{label}</Text>
      <View style={S.sectionDivLine} />
    </View>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ mode }) {
  const map = {
    new:  [S.badgeNew,  S.badgeTextNew,  "READY"],
    edit: [S.badgeEdit, S.badgeTextEdit, "EDITING"],
    ok:   [S.badgeOk,   S.badgeTextOk,   "SAVED"],
  };
  const [bg, textStyle, label] = map[mode] || map.new;
  return <View style={[S.badge, bg]}><Text style={textStyle}>{label}</Text></View>;
}

// ── HeaderBand — colored header per tab ───────────────────────
export function HeaderBand({ color, icon, title, sub, badge }) {
  return (
    <View style={[S.headerBand, { backgroundColor: color }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
          <View style={S.headerBandIcon}><Text style={{ fontSize: 22 }}>{icon}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={S.headerBandTitle}>{title}</Text>
            <Text style={S.headerBandSub}>{sub}</Text>
          </View>
        </View>
        {badge && <Badge mode={badge} />}
      </View>
    </View>
  );
}

// ── FormField ─────────────────────────────────────────────────
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
        style={[
          S.input,
          focused    && S.inputFocused,
          !editable  && S.inputDisabled,
          error      && S.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.soilFaint}
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

// ── PickerField ───────────────────────────────────────────────
export function PickerField({ label, value, onValueChange, items, required = false, style }) {
  return (
    <View style={[{ flex: 1, marginBottom: 16 }, style]}>
      <Text style={S.label}>
        {label}
        {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <View style={[S.input, { padding: 0, justifyContent: "center" }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ color: colors.soil, height: 48 }}
          dropdownIconColor={colors.soilFaint}
        >
          <Picker.Item label="— Select —" value="" color={colors.soilFaint} />
          {items.map(item => (
            <Picker.Item key={item} label={item} value={item} color={colors.soil} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

// ── LockedField ───────────────────────────────────────────────
export function LockedField({ label, value, mono = false, style }) {
  return (
    <View style={[S.lockedField, style]}>
      <Text style={S.lockedLabel}>{label}</Text>
      <Text
        style={[S.lockedValue, mono && { fontFamily: fonts.mono, fontSize: 14 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value || "—"}
      </Text>
    </View>
  );
}

// ── SearchPanel ───────────────────────────────────────────────
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
          placeholderTextColor={colors.soilFaint}
          keyboardType="numeric"
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity style={[S.btnSmall, { marginLeft: 8 }]} onPress={onSearch} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={S.btnSmallText}>Search</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.btnSmall, { marginLeft: 6, backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.dangerBorder }]}
          onPress={onClear}
        >
          <Text style={{ color: colors.danger, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── FirmTypePills ─────────────────────────────────────────────
export function FirmTypePills({ types, selected, onSelect }) {
  if (!types || types.length <= 1) return null;
  return (
    <View>
      <SectionDivider label="Select Firm Type" />
      <View style={S.ftPillRow}>
        {types.map(ft => (
          <TouchableOpacity key={ft} style={[S.ftPill, selected === ft && S.ftPillOn]} onPress={() => onSelect(ft)}>
            <Text style={[S.ftPillText, selected === ft && S.ftPillTextOn]}>{ft}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── InfoBanner ────────────────────────────────────────────────
export function InfoBanner({ text }) {
  return (
    <View style={S.infoBanner}>
      <Text style={{ fontSize: 15 }}>🌾</Text>
      <Text style={S.infoBannerText}>{text}</Text>
    </View>
  );
}

// ── WarnBanner ────────────────────────────────────────────────
export function WarnBanner({ text, show = true }) {
  if (!show) return null;
  return (
    <View style={S.warnBanner}>
      <Text style={{ fontSize: 15 }}>⚠</Text>
      <Text style={S.warnBannerText}>{text}</Text>
    </View>
  );
}

// ── ValidationBox ─────────────────────────────────────────────
export function ValidationBox({ errors }) {
  if (!errors || !errors.length) return null;
  return (
    <View style={S.valBox}>
      <Text style={S.valBoxTitle}>Please fix:</Text>
      {errors.map((e, i) => <Text key={i} style={S.valBoxText}>• {e}</Text>)}
    </View>
  );
}

// ── TsPill ────────────────────────────────────────────────────
export function TsPill({ timestamp, show }) {
  if (!show || !timestamp) return null;
  return (
    <View style={S.tsPill}>
      <Text style={{ fontSize: 14 }}>✓</Text>
      <Text style={S.tsPillText}>{timestamp}</Text>
    </View>
  );
}

// ── Buttons ───────────────────────────────────────────────────
export function PrimaryBtn({ label, onPress, loading = false, disabled = false }) {
  return (
    <TouchableOpacity style={[S.btnPrimary, (disabled || loading) && { opacity: 0.5 }]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.85}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={S.btnPrimaryText}>{label}</Text>}
    </TouchableOpacity>
  );
}

export function GhostBtn({ label, onPress }) {
  return (
    <TouchableOpacity style={S.btnGhost} onPress={onPress} activeOpacity={0.85}>
      <Text style={S.btnGhostText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── ModeToggle ────────────────────────────────────────────────
export function ModeToggle({ options, selected, onSelect }) {
  return (
    <View style={S.modeRow}>
      {options.map(opt => (
        <TouchableOpacity key={opt.value} style={[S.modeBtn, selected === opt.value && S.modeBtnOn]} onPress={() => onSelect(opt.value)}>
          <Text style={[S.modeBtnText, selected === opt.value && S.modeBtnTextOn]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon = "📋", title, sub }) {
  return (
    <View style={S.emptyState}>
      <View style={S.emptyIconWrap}><Text style={S.emptyIcon}>{icon}</Text></View>
      <Text style={S.emptyText}>{title}</Text>
      <Text style={S.emptySub}>{sub}</Text>
    </View>
  );
}

// ── Toast ─────────────────────────────────────────────────────
export const Toast = React.forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [msg,  setMsg]  = useState("");
  const [type, setType] = useState("ok");
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const timer   = useRef(null);

  React.useImperativeHandle(ref, () => ({
    show(message, toastType = "ok") {
      setMsg(message);
      setType(toastType);
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setVisible(false));
      }, 3200);
    },
  }));

  if (!visible) return null;

  const bg = type === "ok" ? colors.success : type === "warn" ? colors.warning : colors.danger;
  const icon = type === "ok" ? "✓" : "⚠";

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, opacity, transform: [{ translateY }] }]}>
      <Text style={{ fontSize: 15, color: "#fff" }}>{icon}</Text>
      <Text style={styles.toastText}>{msg}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    position: "absolute", top: 56, left: 18, right: 18,
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 15, borderRadius: 16,
    zIndex: 999, elevation: 8,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
  },
  toastText: { fontFamily: fonts.body, fontSize: 14, fontWeight: "600", color: "#fff", flex: 1, lineHeight: 19 },
});
