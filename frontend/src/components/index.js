// src/components/index.js
import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Animated, StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors, S } from "../theme";

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

// ── FormField ─────────────────────────────────────────────────
export function FormField({
  label, value, onChangeText,
  placeholder = "", keyboardType = "default",
  editable = true, error = null, hint = null, required = false,
  style,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ flex: 1, marginBottom: 14 }, style]}>
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
        placeholderTextColor={colors.text4}
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
    <View style={[{ flex: 1, marginBottom: 14 }, style]}>
      <Text style={S.label}>
        {label}
        {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <View style={[S.input, { padding: 0, justifyContent: "center" }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ color: colors.text, height: 44 }}
          dropdownIconColor={colors.text4}
        >
          <Picker.Item label="— Select —" value="" color={colors.text4} />
          {items.map(item => (
            <Picker.Item key={item} label={item} value={item} color={colors.text} />
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
        style={[S.lockedValue, mono && { fontFamily: "monospace", fontSize: 13 }]}
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
      <Text style={S.searchPanelTitle}>{title}</Text>
      <View style={[S.row, { alignItems: "center" }]}>
        <TextInput
          style={[S.input, { flex: 1 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text4}
          keyboardType="numeric"
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity style={[S.btnSmall, { marginLeft: 8 }]} onPress={onSearch} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Text style={S.btnSmallText}>Search</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[S.btnSmall, { marginLeft: 6, borderColor: colors.dangerBorder }]} onPress={onClear}>
          <Text style={[S.btnSmallText, { color: colors.danger }]}>✕</Text>
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
      <Text style={{ fontSize: 14 }}>ℹ</Text>
      <Text style={S.infoBannerText}>{text}</Text>
    </View>
  );
}

// ── WarnBanner ────────────────────────────────────────────────
export function WarnBanner({ text, show = true }) {
  if (!show) return null;
  return (
    <View style={S.warnBanner}>
      <Text style={{ fontSize: 14 }}>⚠</Text>
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
      <Text style={{ fontSize: 14 }}>🕐</Text>
      <Text style={S.tsPillText}>{timestamp}</Text>
    </View>
  );
}

// ── Buttons ───────────────────────────────────────────────────
export function PrimaryBtn({ label, onPress, loading = false, disabled = false }) {
  return (
    <TouchableOpacity style={[S.btnPrimary, (disabled || loading) && { opacity: 0.5 }]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={S.btnPrimaryText}>{label}</Text>}
    </TouchableOpacity>
  );
}

export function GhostBtn({ label, onPress }) {
  return (
    <TouchableOpacity style={S.btnGhost} onPress={onPress} activeOpacity={0.8}>
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
      <Text style={S.emptyIcon}>{icon}</Text>
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
  const timer   = useRef(null);

  React.useImperativeHandle(ref, () => ({
    show(message, toastType = "ok") {
      setMsg(message);
      setType(toastType);
      setVisible(true);
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false));
      }, 3500);
    },
  }));

  if (!visible) return null;

  const bg     = type === "ok" ? colors.successBg    : type === "warn" ? colors.warningBg    : colors.dangerBg;
  const border = type === "ok" ? colors.successBorder : type === "warn" ? colors.warningBorder : colors.dangerBorder;
  const tc     = type === "ok" ? colors.success       : type === "warn" ? colors.warning       : colors.danger;

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: border, opacity }]}>
      <Text style={{ fontSize: 14, color: tc }}>{type === "ok" ? "✓" : "⚠"}</Text>
      <Text style={[styles.toastText, { color: tc }]}>{msg}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    position: "absolute", top: 60, left: 16, right: 16,
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 14, borderRadius: 10, borderWidth: 0.5,
    zIndex: 999, elevation: 6,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  toastText: { fontSize: 13.5, fontWeight: "500", flex: 1, lineHeight: 18 },
});
