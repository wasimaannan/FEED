// src/components/index.js
// Akij Feed — classy components with motion.
// Key addition: fully custom PickerField (no native Picker — never clips text).

import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Animated, StyleSheet,
  Modal, FlatList, Easing, Pressable,
} from "react-native";
import { colors, fonts, S } from "../theme";

// ─────────────────────────────────────────────────────────────────
// MOTION PRIMITIVES
// ─────────────────────────────────────────────────────────────────

export function FadeIn({ children, delay = 0, style }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 400, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 360, delay, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function PopIn({ children, delay = 0, style }) {
  const scale   = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,  { toValue: 1, useNativeDriver: true, delay, friction: 6, tension: 160 }),
      Animated.timing(opacity,{ toValue: 1, duration: 200, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
}

function useSpringPress(toValue = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue, useNativeDriver: true, friction: 8, tension: 300 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 200 }).start();
  return { scale, onIn, onOut };
}

// ─────────────────────────────────────────────────────────────────
// HEADER BAND
// ─────────────────────────────────────────────────────────────────
export function HeaderBand({ icon, title, sub, badge, eyebrow }) {
  return (
    <FadeIn>
      <View style={S.header}>
        {/* Gold accent line at very top */}
        <View style={{
          height: 2,
          backgroundColor: colors.gold,
          marginBottom: 16,
          marginHorizontal: -20,
          opacity: 0.7,
        }} />
        <View style={S.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={S.headerEyebrow}>{eyebrow || "AKIJ FEED"}</Text>
            <Text style={S.headerTitle}>{title}</Text>
            <Text style={S.headerSub}>{sub}</Text>
          </View>
          <PopIn delay={100}>
            <View style={S.headerIconBox}>
              <Text style={{ fontSize: 22 }}>{icon}</Text>
            </View>
          </PopIn>
        </View>
        {badge && (
          <View style={{ marginTop: 12 }}>
            <PopIn delay={160}><Badge mode={badge} /></PopIn>
          </View>
        )}
      </View>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────
export function Badge({ mode }) {
  const map = {
    new:  [S.badgeNew,  S.badgeTextNew,  "● READY"],
    edit: [S.badgeEdit, S.badgeTextEdit, "✎ EDITING"],
    ok:   [S.badgeOk,   S.badgeTextOk,   "✓ SAVED"],
  };
  const [bg, textStyle, label] = map[mode] || map.new;
  return <View style={[S.badge, bg]}><Text style={textStyle}>{label}</Text></View>;
}

// ─────────────────────────────────────────────────────────────────
// TAG LABEL
// ─────────────────────────────────────────────────────────────────
export function TagLabel({ text }) {
  return (
    <View style={S.tagLabel}>
      <View style={S.tagLabelBar} />
      <Text style={S.tagLabelText}>{text}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────────────────────────
export function SectionDivider({ label }) {
  return (
    <View style={S.sectionDiv}>
      <View style={S.sectionDivLine} />
      <Text style={S.sectionDivText}>{label}</Text>
      <View style={S.sectionDivLine} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// FORM FIELD — glowing gold border on focus
// ─────────────────────────────────────────────────────────────────
export function FormField({
  label, value, onChangeText,
  placeholder = "", keyboardType = "default",
  editable = true, error = null, hint = null, required = false, style,
}) {
  const [focused, setFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(glowAnim, { toValue: 1, duration: 220, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(glowAnim, { toValue: 0, duration: 280, useNativeDriver: false }).start();
  };

  const borderColor = error
    ? colors.danger
    : glowAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.borderMid, colors.gold] });

  return (
    <View style={[{ flex: 1, marginBottom: 14 }, style]}>
      <Text style={S.label}>
        {label}{required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <Animated.View style={{ borderRadius: 13, borderWidth: 1.5, borderColor, overflow: "hidden" }}>
        <TextInput
          style={[S.input, { borderWidth: 0, borderRadius: 12 }, !editable && S.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Animated.View>
      {error && <Text style={S.errHint}>⚠ {error}</Text>}
      {!error && hint && <Text style={S.hint}>{hint}</Text>}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// CUSTOM PICKER — replaces native Picker completely.
// Never clips text. Full-screen modal with gold selection.
// ─────────────────────────────────────────────────────────────────
export function PickerField({ label, value, onValueChange, items, required = false, style }) {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 9, tension: 120 }),
      Animated.timing(bgAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(bgAnim, { toValue: 0, duration: 220, useNativeDriver: false }),
    ]).start(() => setOpen(false));
  };

  const select = (item) => {
    onValueChange(item);
    closeModal();
  };

  const displayLabel = value
    ? items.find(i => i === value) || value
    : "Select…";

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"],
  });

  return (
    <View style={[{ flex: 1, marginBottom: 14 }, style]}>
      <Text style={S.label}>
        {label}{required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>

      {/* Trigger button */}
      <TouchableOpacity
        style={localStyles.pickerTrigger}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Text
          style={[
            localStyles.pickerTriggerText,
            !value && { color: colors.textTertiary },
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <View style={localStyles.pickerChevronWrap}>
          <Text style={localStyles.pickerChevron}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Modal sheet */}
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View style={[localStyles.modalOverlay, { backgroundColor: bgColor }]}>
          <Pressable style={{ flex: 1 }} onPress={closeModal} />

          <Animated.View
            style={[
              localStyles.sheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Sheet header */}
            <View style={localStyles.sheetHeader}>
              <View style={localStyles.sheetHandle} />
              <Text style={localStyles.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={closeModal} style={localStyles.sheetClose}>
                <Text style={localStyles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Gold divider */}
            <View style={localStyles.sheetDivider} />

            {/* Options */}
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              style={{ maxHeight: 320 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity
                    style={[
                      localStyles.option,
                      isSelected && localStyles.optionSelected,
                    ]}
                    onPress={() => select(item)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        localStyles.optionText,
                        isSelected && localStyles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <View style={localStyles.optionCheck}>
                        <Text style={localStyles.optionCheckText}>✓</Text>
                      </View>
                    )}
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

// ─────────────────────────────────────────────────────────────────
// LOCKED FIELD
// ─────────────────────────────────────────────────────────────────
export function LockedField({ label, value, mono = false, style }) {
  return (
    <View style={[S.lockedField, style]}>
      <Text style={S.lockedLabel}>{label}</Text>
      <Text
        style={[S.lockedValue, mono && { fontFamily: fonts.mono, fontSize: 14, color: colors.goldText }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value || "—"}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SEARCH PANEL
// ─────────────────────────────────────────────────────────────────
export function SearchPanel({ title, value, onChangeText, onSearch, onClear, placeholder = "e.g. 565609", loading = false }) {
  return (
    <FadeIn>
      <View style={S.searchPanel}>
        <Text style={S.searchPanelLabel}>⌕  {title}</Text>
        <View style={[S.row, { alignItems: "center" }]}>
          <TextInput
            style={[S.input, { flex: 1, backgroundColor: colors.surface }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <PrimaryBtn
            label={loading ? null : "Search"}
            onPress={onSearch}
            loading={loading}
            style={{ marginLeft: 8, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 12 }}
          />
          <TouchableOpacity
            onPress={onClear}
            style={[S.btnSmall, { marginLeft: 6, backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
          >
            <Text style={{ color: colors.danger, fontSize: 15, fontWeight: "700" }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// FIRM TYPE PILLS
// ─────────────────────────────────────────────────────────────────
function AnimatedPill({ ft, selected, onSelect }) {
  const { scale, onIn, onOut } = useSpringPress(0.92);
  const isOn = selected === ft;
  return (
    <TouchableOpacity onPressIn={onIn} onPressOut={onOut} onPress={() => onSelect(ft)} activeOpacity={1}>
      <Animated.View style={[S.ftPill, isOn && S.ftPillOn, { transform: [{ scale }] }]}>
        <Text style={[S.ftPillText, isOn && S.ftPillTextOn]}>{ft}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function FirmTypePills({ types, selected, onSelect }) {
  if (!types || types.length <= 1) return null;
  return (
    <FadeIn>
      <SectionDivider label="Select Firm Type" />
      <View style={S.ftPillRow}>
        {types.map(ft => <AnimatedPill key={ft} ft={ft} selected={selected} onSelect={onSelect} />)}
      </View>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────────────────────────
export function InfoBanner({ text }) {
  return (
    <FadeIn>
      <View style={S.infoBanner}>
        <Text style={{ fontSize: 14, color: colors.gold }}>◈</Text>
        <Text style={S.infoBannerText}>{text}</Text>
      </View>
    </FadeIn>
  );
}

export function WarnBanner({ text, show = true }) {
  const height  = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(height,  { toValue: show ? 54 : 0, useNativeDriver: false, friction: 9 }),
      Animated.timing(opacity, { toValue: show ? 1 : 0, duration: 200, useNativeDriver: false }),
    ]).start();
  }, [show]);
  return (
    <Animated.View style={[S.warnBanner, { overflow: "hidden", height, opacity, marginBottom: show ? 14 : 0 }]}>
      <Text style={{ fontSize: 14, color: colors.warning }}>⚠</Text>
      <Text style={S.warnBannerText}>{text}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION BOX
// ─────────────────────────────────────────────────────────────────
export function ValidationBox({ errors }) {
  if (!errors || !errors.length) return null;
  return (
    <FadeIn>
      <View style={S.valBox}>
        <Text style={S.valBoxTitle}>Please fix before saving:</Text>
        {errors.map((e, i) => <Text key={i} style={S.valBoxText}>• {e}</Text>)}
      </View>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// TIMESTAMP PILL
// ─────────────────────────────────────────────────────────────────
export function TsPill({ timestamp, show }) {
  const scale   = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.spring(scale,  { toValue: 1, useNativeDriver: true, friction: 5, tension: 180 }),
        Animated.timing(opacity,{ toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [show]);
  if (!show || !timestamp) return null;
  return (
    <Animated.View style={[S.tsPill, { opacity, transform: [{ scale }] }]}>
      <Text style={{ fontSize: 13, color: colors.success }}>✓</Text>
      <Text style={S.tsPillText}>{timestamp}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────────────────────────
export function PrimaryBtn({ label, onPress, loading = false, disabled = false, style }) {
  const { scale, onIn, onOut } = useSpringPress(0.97);
  return (
    <TouchableOpacity onPressIn={onIn} onPressOut={onOut} onPress={onPress} disabled={disabled || loading} activeOpacity={1}>
      <Animated.View style={[S.btnPrimary, { transform: [{ scale }] }, (disabled || loading) && { opacity: 0.45 }, style]}>
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={S.btnPrimaryText}>{label}</Text>
        }
      </Animated.View>
    </TouchableOpacity>
  );
}

export function GhostBtn({ label, onPress }) {
  const { scale, onIn, onOut } = useSpringPress(0.97);
  return (
    <TouchableOpacity onPressIn={onIn} onPressOut={onOut} onPress={onPress} activeOpacity={1}>
      <Animated.View style={[S.btnGhost, { transform: [{ scale }] }]}>
        <Text style={S.btnGhostText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────
// MODE TOGGLE
// ─────────────────────────────────────────────────────────────────
export function ModeToggle({ options, selected, onSelect }) {
  return (
    <View style={S.modeRow}>
      {options.map(opt => {
        const isOn = selected === opt.value;
        const { scale, onIn, onOut } = useSpringPress(0.96);
        return (
          <TouchableOpacity key={opt.value} onPressIn={onIn} onPressOut={onOut} onPress={() => onSelect(opt.value)} activeOpacity={1} style={{ flex: 1 }}>
            <Animated.View style={[S.modeBtn, isOn && S.modeBtnOn, { transform: [{ scale }] }]}>
              <Text style={[S.modeBtnText, isOn && S.modeBtnTextOn]}>{opt.label}</Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// EMPTY STATE — floating bounce
// ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📋", title, sub }) {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <FadeIn>
      <View style={S.emptyState}>
        <Animated.View style={[S.emptyIconWrap, { transform: [{ translateY: bounce }] }]}>
          <Text style={S.emptyIcon}>{icon}</Text>
        </Animated.View>
        <Text style={S.emptyText}>{title}</Text>
        <Text style={S.emptySub}>{sub}</Text>
      </View>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────
export const Toast = React.forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [msg,  setMsg]  = useState("");
  const [type, setType] = useState("ok");
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const scale      = useRef(new Animated.Value(0.94)).current;
  const timer      = useRef(null);

  React.useImperativeHandle(ref, () => ({
    show(message, toastType = "ok") {
      setMsg(message); setType(toastType); setVisible(true);
      opacity.setValue(0); translateY.setValue(-20); scale.setValue(0.94);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 160 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 160 }),
      ]).start();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -12, duration: 260, useNativeDriver: true }),
        ]).start(() => setVisible(false));
      }, 3000);
    },
  }));

  if (!visible) return null;

  const configs = {
    ok:   { bg: colors.successBg,  border: colors.successBorder,  icon: "✓", tc: colors.success },
    warn: { bg: colors.warningBg,  border: colors.warningBorder,  icon: "⚠", tc: colors.warning },
    err:  { bg: colors.dangerBg,   border: colors.dangerBorder,   icon: "✕", tc: colors.danger  },
  };
  const c = configs[type] || configs.ok;

  return (
    <Animated.View style={[
      localStyles.toast,
      { backgroundColor: c.bg, borderColor: c.border, opacity, transform: [{ translateY }, { scale }] },
    ]}>
      <Text style={{ fontSize: 13, color: c.tc, fontWeight: "800" }}>{c.icon}</Text>
      <Text style={[localStyles.toastText, { color: c.tc }]}>{msg}</Text>
    </Animated.View>
  );
});

// ─────────────────────────────────────────────────────────────────
// LOCAL STYLES (picker + toast)
// ─────────────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
  // Picker trigger
  pickerTrigger: {
    backgroundColor: colors.surfaceUp,
    borderWidth: 1.5,
    borderColor: colors.borderMid,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
  },
  pickerTriggerText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  pickerChevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerChevron: {
    color: colors.goldText,
    fontSize: 18,
    fontWeight: "300",
    lineHeight: 22,
    transform: [{ rotate: "90deg" }],
  },

  // Modal sheet
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.borderMid,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  sheetHeader: {
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetHandle: {
    position: "absolute",
    top: 10,
    left: "50%",
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMid,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginTop: 8,
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceUp,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  sheetCloseText: { color: colors.textSec, fontSize: 14, fontWeight: "700" },
  sheetDivider: {
    height: 1,
    backgroundColor: colors.borderGold,
    marginBottom: 8,
    opacity: 0.6,
  },

  // Options
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.goldGlow,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomColor: "transparent",
    marginBottom: 2,
  },
  optionText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSec,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: colors.goldText,
    fontWeight: "700",
  },
  optionCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCheckText: { color: "#0D1410", fontSize: 13, fontWeight: "800" },

  // Toast
  toast: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 999,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  toastText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    fontWeight: "600",
    flex: 1,
    lineHeight: 19,
  },
});