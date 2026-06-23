// src/theme/index.js
// Akij Feed — premium corporate palette.
// Deep executive green, warm gold, ivory cream on near-black.
// Inspired by akijfeed.com: #1B4D3E forest green, gold wheat accent.

import { StyleSheet, Platform, Dimensions } from "react-native";

const { height: SH } = Dimensions.get("window");

// ── Palette ──────────────────────────────────────────────────────
export const colors = {
  // Canvas
  bg:           "#0D1410",   // near-black with deep green tint
  surface:      "#141C18",   // card base
  surfaceUp:    "#1A2520",   // elevated surface
  surfaceHigh:  "#1F2D27",   // top surface

  // Brand — Akij green family
  brand:        "#1B4D3E",   // Akij primary green
  brandDeep:    "#123329",   // pressed
  brandMid:     "#22654F",   // hover/active
  brandGlow:    "rgba(27,77,62,0.35)",

  // Gold accent — premium
  gold:         "#C8972A",   // Akij wheat gold
  goldBright:   "#E4B84A",   // highlight
  goldSoft:     "#D4A24C",
  goldGlow:     "rgba(200,151,42,0.18)",
  goldText:     "#F0C96A",   // gold on dark bg

  // Borders
  border:       "#243028",
  borderMid:    "#2E3D35",
  borderGold:   "rgba(200,151,42,0.3)",

  // Text
  textPrimary:  "#EFF5F0",   // warm near-white
  textSec:      "#7A9A87",   // muted green-grey
  textTertiary: "#4A6355",   // very muted

  // Status
  success:      "#4CAF7D",
  successBg:    "rgba(76,175,125,0.12)",
  successBorder:"rgba(76,175,125,0.25)",
  danger:       "#E57373",
  dangerBg:     "rgba(229,115,115,0.10)",
  dangerBorder: "rgba(229,115,115,0.25)",
  warning:      "#D4A24C",
  warningBg:    "rgba(212,162,76,0.12)",
  warningBorder:"rgba(212,162,76,0.25)",
};

export const FIRM_TYPES = ["Broiler", "Layer", "Sonali", "Cattle", "Fish"];
export const ZONES      = ["East", "West", "North", "South", "Central"];

// ── Typography ───────────────────────────────────────────────────
export const FONT_DISPLAY = Platform.select({
  ios: "Georgia",                          // elegant serif for headers
  android: "serif",
  default: "serif",
});
export const FONT_BODY = Platform.select({
  ios: "Avenir-Medium",
  android: "sans-serif",
  default: "sans-serif",
});
export const FONT_LABEL = Platform.select({
  ios: "Avenir-Heavy",
  android: "sans-serif-medium",
  default: "sans-serif",
});
export const FONT_MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export const fonts = {
  display: FONT_DISPLAY,
  body: FONT_BODY,
  label: FONT_LABEL,
  mono: FONT_MONO,
};

// ── Safe header height ────────────────────────────────────────────
export const HEADER_HEIGHT = SH < 700 ? 110 : 130;

// ── Shared styles ─────────────────────────────────────────────────
export const S = StyleSheet.create({
  // Screen
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 36 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  headerEyebrow: {
    fontFamily: FONT_LABEL,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.goldText,
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontFamily: FONT_BODY,
    fontSize: 13,
    color: colors.textSec,
    marginTop: 3,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "visible",
  },
  cardBody: { padding: 18 },

  // Gold accent bar (top of card)
  cardAccentBar: {
    height: 2,
    backgroundColor: colors.gold,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  // Inputs
  input: {
    backgroundColor: colors.surfaceUp,
    borderWidth: 1.5,
    borderColor: colors.borderMid,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontFamily: FONT_BODY,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputFocused:  { borderColor: colors.gold },
  inputDisabled: { opacity: 0.38 },
  inputError:    { borderColor: colors.danger },

  label: {
    fontFamily: FONT_LABEL,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textSec,
    marginBottom: 7,
  },
  hint:    { fontFamily: FONT_BODY, fontSize: 12, color: colors.textTertiary, marginTop: 4 },
  errHint: { fontFamily: FONT_MONO, fontSize: 11, color: colors.danger, marginTop: 5 },

  // Buttons
  btnPrimary: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.brandMid,
  },
  btnPrimaryText: {
    fontFamily: FONT_LABEL,
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.borderMid,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { fontFamily: FONT_BODY, color: colors.textSec, fontSize: 14, fontWeight: "600" },
  btnSmall: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.brandMid,
  },
  btnSmallText: { fontFamily: FONT_LABEL, fontSize: 13, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Tag label
  tagLabel: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 4 },
  tagLabelBar: { width: 2.5, height: 14, borderRadius: 2, backgroundColor: colors.gold },
  tagLabelText: {
    fontFamily: FONT_LABEL,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.textSec,
  },

  // Section divider
  sectionDiv: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: colors.border },
  sectionDivText: {
    fontFamily: FONT_MONO,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textTertiary,
  },

  // Search panel
  searchPanel: {
    backgroundColor: colors.surfaceUp,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderMid,
  },
  searchPanelLabel: {
    fontFamily: FONT_LABEL,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.goldText,
    marginBottom: 10,
  },

  // Locked field
  lockedField: {
    backgroundColor: colors.surfaceUp,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockedLabel: {
    fontFamily: FONT_LABEL,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textTertiary,
    marginBottom: 5,
  },
  lockedValue: { fontFamily: FONT_BODY, fontSize: 15, fontWeight: "700", color: colors.textPrimary },

  // Banners
  infoBanner: {
    backgroundColor: colors.goldGlow,
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  infoBannerText: { fontFamily: FONT_BODY, fontSize: 13, color: colors.goldText, flex: 1, lineHeight: 19 },
  warnBanner: {
    backgroundColor: colors.warningBg,
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  warnBannerText: { fontFamily: FONT_BODY, fontSize: 13, color: colors.warning, flex: 1, lineHeight: 19 },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 52, paddingHorizontal: 24 },
  emptyIconWrap: {
    width: 70, height: 70, borderRadius: 20,
    backgroundColor: colors.surfaceUp,
    borderWidth: 1, borderColor: colors.borderGold,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  emptyIcon: { fontSize: 30 },
  emptyText: { fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: "700", color: colors.textPrimary, marginBottom: 7 },
  emptySub:  { fontFamily: FONT_BODY, fontSize: 13.5, color: colors.textTertiary, textAlign: "center", lineHeight: 20 },

  // Firm type pills
  ftPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  ftPill: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5, borderColor: colors.borderMid,
    backgroundColor: colors.surfaceUp,
  },
  ftPillOn: { borderColor: colors.gold, backgroundColor: colors.goldGlow },
  ftPillText: { fontFamily: FONT_LABEL, fontSize: 12.5, fontWeight: "700", color: colors.textSec },
  ftPillTextOn: { color: colors.goldText },

  // Mode toggle
  modeRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceUp,
    borderRadius: 13,
    padding: 4,
    marginBottom: 18,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  modeBtnOn: {
    backgroundColor: colors.brand,
    borderWidth: 1,
    borderColor: colors.brandMid,
  },
  modeBtnText: { fontFamily: FONT_LABEL, fontSize: 12.5, fontWeight: "700", color: colors.textTertiary },
  modeBtnTextOn: { color: "#fff" },

  // Badge
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:  { backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: colors.border },
  badgeEdit: { backgroundColor: colors.warningBg, borderWidth: 1, borderColor: colors.warningBorder },
  badgeOk:   { backgroundColor: colors.successBg, borderWidth: 1, borderColor: colors.successBorder },
  badgeTextNew:  { fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: "700", color: colors.textSec, letterSpacing: 0.8 },
  badgeTextEdit: { fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: "700", color: colors.warning, letterSpacing: 0.8 },
  badgeTextOk:   { fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: "700", color: colors.success, letterSpacing: 0.8 },

  // Timestamp pill
  tsPill: {
    backgroundColor: colors.successBg,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  tsPillText: { fontFamily: FONT_MONO, fontSize: 12, color: colors.success, fontWeight: "600" },

  // Validation box
  valBox: { backgroundColor: colors.dangerBg, borderRadius: 12, padding: 13, marginBottom: 14, borderWidth: 1, borderColor: colors.dangerBorder },
  valBoxTitle: { fontFamily: FONT_LABEL, fontSize: 12.5, fontWeight: "700", color: colors.danger, marginBottom: 5 },
  valBoxText:  { fontFamily: FONT_BODY, fontSize: 12, color: colors.danger, lineHeight: 18 },

  // Sub-total
  subTotalRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, marginBottom: 6 },
  subTotalText: { fontFamily: FONT_MONO, fontSize: 12, color: colors.textSec },
  subTotalErr:  { fontFamily: FONT_MONO, fontSize: 12, color: colors.danger, fontWeight: "700" },

  // Grids
  row:       { flexDirection: "row", gap: 10 },
  grid2:     { flexDirection: "row", gap: 10 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  grid3item: { flex: 1, minWidth: "30%" },

  overwriteWarn: { backgroundColor: colors.warningBg, borderRadius: 12, padding: 13, marginBottom: 14, flexDirection: "row", gap: 8, borderWidth: 1, borderColor: colors.warningBorder },
  overwriteWarnText: { fontFamily: FONT_BODY, fontSize: 13, color: colors.warning, flex: 1, lineHeight: 19 },
});