// src/theme/index.js
// Design direction: rugged field tool for agriculture, not a generic SaaS app.
// Palette pulls from farmland — deep green, grain wheat, soil charcoal, cream paper.

import { StyleSheet, Platform } from "react-native";

export const colors = {
  // Core palette
  forest:      "#1B4D3E",   // primary — deep agricultural green
  forestDeep:  "#123329",   // pressed/active state
  forestSoft:  "#E8F0EC",   // tinted backgrounds
  wheat:       "#D4A24C",   // accent — grain/wheat gold
  wheatSoft:   "#FBF1DD",   // tinted accent backgrounds
  soil:        "#1C1C1E",   // primary text — near-black charcoal
  soilLight:   "#4A4A4D",   // secondary text
  soilFaint:   "#8B8B8E",   // tertiary text / placeholders
  paper:       "#FAF8F3",   // app background — warm cream paper
  card:        "#FFFFFF",   // card surfaces
  cardAlt:     "#F4F1E8",   // alternate card tint
  line:        "#E5E0D3",   // hairline borders, warm-toned
  lineStrong:  "#D6CFB8",

  // Status
  success:       "#2D6A4F",
  successBg:      "#E3F0E8",
  successBorder:  "#A8D5BC",
  danger:         "#A23B2E",
  dangerBg:       "#F8E8E5",
  dangerBorder:   "#E5B3A8",
  warning:        "#B8762F",
  warningBg:      "#FAEFDC",
  warningBorder:  "#E8C98A",
};

export const FIRM_TYPES = ["Broiler", "Layer", "Sonali", "Cattle", "Fish"];
export const ZONES      = ["East", "West", "North", "South", "Central"];

const FONT_DISPLAY = Platform.select({ ios: "Avenir-Heavy",  android: "sans-serif-condensed-medium", default: "sans-serif" });
const FONT_BODY    = Platform.select({ ios: "Avenir-Medium", android: "sans-serif",                   default: "sans-serif" });
const FONT_MONO    = Platform.select({ ios: "Menlo",         android: "monospace",                    default: "monospace" });

export const fonts = { display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO };

export const S = StyleSheet.create({
  // ── Screen ──────────────────────────────────────────────────
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 18, paddingBottom: 90 },

  // ── Tab header band (distinct color wash per tab) ────────────
  headerBand: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBandTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerBandSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    marginTop: 3,
  },
  headerBandIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Card ──────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: colors.soil,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },
  cardBody: { padding: 18 },

  // ── Tag-style section label (like an equipment tag) ──────────
  tagLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    marginTop: 6,
  },
  tagLabelBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.wheat,
  },
  tagLabelText: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: colors.soilLight,
  },

  // ── Search panel ──────────────────────────────────────────────
  searchPanel: {
    backgroundColor: colors.forestSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  searchPanelLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.forest,
    marginBottom: 10,
  },

  // ── Inputs ──────────────────────────────────────────────────
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 15.5,
    color: colors.soil,
  },
  inputFocused:  { borderColor: colors.forest },
  inputDisabled: { backgroundColor: colors.cardAlt, color: colors.soilLight },
  inputError:    { borderColor: colors.danger },

  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.soilLight,
    marginBottom: 7,
  },
  hint:    { fontFamily: fonts.body, fontSize: 12, color: colors.soilFaint, marginTop: 5 },
  errHint: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.danger, marginTop: 5 },

  // ── Buttons ──────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colors.forest,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: colors.forest,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnPrimaryText: { fontFamily: fonts.display, color: "#fff", fontSize: 15.5, fontWeight: "700" },
  btnGhost: {
    backgroundColor: "transparent",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText:  { fontFamily: fonts.body, color: colors.soilLight, fontSize: 15, fontWeight: "600" },
  btnSmall: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSmallText:  { fontFamily: fonts.body, fontSize: 14, fontWeight: "700", color: "#fff" },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  // ── Section divider (field-tool style with bar, not hairline) ──
  sectionDiv: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: colors.line },
  sectionDivText: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.soilFaint,
  },

  // ── Locked / read-only field — shown as a stamped tag ─────────
  lockedField: {
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.wheat,
  },
  lockedLabel: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.soilFaint,
    marginBottom: 4,
  },
  lockedValue: { fontFamily: fonts.body, fontSize: 15, fontWeight: "700", color: colors.soil },

  // ── Banners ──────────────────────────────────────────────────
  infoBanner: {
    backgroundColor: colors.forestSoft,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    gap: 10,
  },
  infoBannerText: { fontFamily: fonts.body, fontSize: 13, color: colors.forest, flex: 1, lineHeight: 19 },
  warnBanner: {
    backgroundColor: colors.warningBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    gap: 10,
  },
  warnBannerText: { fontFamily: fonts.body, fontSize: 13, color: colors.warning, flex: 1, lineHeight: 19 },

  // ── Empty state ──────────────────────────────────────────────
  emptyState: { alignItems: "center", paddingVertical: 56, paddingHorizontal: 24 },
  emptyIconWrap: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: colors.forestSoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontFamily: fonts.display, fontSize: 16, fontWeight: "700", color: colors.soil, marginBottom: 6 },
  emptySub:  { fontFamily: fonts.body, fontSize: 13.5, color: colors.soilFaint, textAlign: "center", lineHeight: 19 },

  // ── Firm type pills (chunky, field-tag style) ────────────────
  ftPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  ftPill: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, borderWidth: 2, borderColor: colors.line,
    backgroundColor: colors.card,
  },
  ftPillOn: { borderColor: colors.forest, backgroundColor: colors.forestSoft },
  ftPillText: { fontFamily: fonts.body, fontSize: 13.5, fontWeight: "700", color: colors.soilLight },
  ftPillTextOn: { color: colors.forest },

  // ── Mode toggle ──────────────────────────────────────────────
  modeRow: {
    flexDirection: "row",
    backgroundColor: colors.cardAlt,
    borderRadius: 14,
    padding: 5,
    marginBottom: 18,
    gap: 5,
  },
  modeBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  modeBtnOn: { backgroundColor: colors.card, shadowColor: colors.soil, shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  modeBtnText: { fontFamily: fonts.body, fontSize: 13.5, fontWeight: "700", color: colors.soilFaint },
  modeBtnTextOn: { color: colors.forest },

  // ── Status badge ──────────────────────────────────────────────
  badge: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:  { backgroundColor: "rgba(255,255,255,0.20)" },
  badgeEdit: { backgroundColor: colors.warningBg },
  badgeOk:   { backgroundColor: colors.successBg },
  badgeTextNew:  { fontFamily: fonts.mono, fontSize: 10.5, fontWeight: "700", color: "#fff", letterSpacing: 0.5 },
  badgeTextEdit: { fontFamily: fonts.mono, fontSize: 10.5, fontWeight: "700", color: colors.warning, letterSpacing: 0.5 },
  badgeTextOk:   { fontFamily: fonts.mono, fontSize: 10.5, fontWeight: "700", color: colors.success, letterSpacing: 0.5 },

  // ── Timestamp pill ──────────────────────────────────────────
  tsPill: {
    backgroundColor: colors.successBg,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  tsPillText: { fontFamily: fonts.mono, fontSize: 12, color: colors.success, fontWeight: "600" },

  // ── Validation box ──────────────────────────────────────────
  valBox: { backgroundColor: colors.dangerBg, borderRadius: 14, padding: 14, marginBottom: 16 },
  valBoxTitle: { fontFamily: fonts.body, fontSize: 13.5, fontWeight: "700", color: colors.danger, marginBottom: 5 },
  valBoxText:  { fontFamily: fonts.body, fontSize: 12.5, color: colors.danger, lineHeight: 18 },

  // ── Sub-total ────────────────────────────────────────────────
  subTotalRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, marginBottom: 6 },
  subTotalText: { fontFamily: fonts.mono, fontSize: 12.5, color: colors.soilLight },
  subTotalErr:  { fontFamily: fonts.mono, fontSize: 12.5, color: colors.danger, fontWeight: "700" },

  // ── Grids ────────────────────────────────────────────────────
  row:       { flexDirection: "row", gap: 12 },
  grid2:     { flexDirection: "row", gap: 12 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  grid3item: { flex: 1, minWidth: "30%" },

  overwriteWarn: { backgroundColor: colors.warningBg, borderRadius: 14, padding: 13, marginBottom: 16, flexDirection: "row", gap: 8 },
  overwriteWarnText: { fontFamily: fonts.body, fontSize: 13, color: colors.warning, flex: 1, lineHeight: 19 },
});
