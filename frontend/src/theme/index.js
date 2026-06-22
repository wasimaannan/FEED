// src/theme/index.js
import { StyleSheet, Platform } from "react-native";

export const colors = {
  primary:       "#1849A9",
  primaryLight:  "#EBF2FF",
  primaryMid:    "#2563EB",
  bg:            "#F0F2F5",
  surface:       "#FFFFFF",
  surface2:      "#F7F8FA",
  border:        "#E4E7EC",
  border2:       "#CDD2DA",
  text:          "#101828",
  text2:         "#344054",
  text3:         "#667085",
  text4:         "#98A2B3",
  success:       "#027A48",
  successBg:     "#ECFDF3",
  successBorder: "#A9EFC5",
  danger:        "#B42318",
  dangerBg:      "#FEF3F2",
  dangerBorder:  "#FCA5A5",
  warning:       "#B54708",
  warningBg:     "#FFFAEB",
  warningBorder: "#FEC84B",
};

export const FIRM_TYPES = ["Broiler", "Layer", "Sonali", "Cattle", "Fish"];
export const ZONES      = ["East", "West", "North", "South", "Central"];

const MONO = Platform.OS === "ios" ? "Courier" : "monospace";

export const S = StyleSheet.create({
  // Layout
  screen:  { flex: 1, backgroundColor: colors.bg },
  scroll:  { padding: 16, paddingBottom: 80 },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: colors.surface2,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBody:  { padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  cardDesc:  { fontSize: 12, color: colors.text3, marginTop: 2 },

  // Search panel
  searchPanel: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0.5,
    borderColor: "#BFDBFE",
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
  },
  searchPanelTitle: {
    fontSize: 11, fontWeight: "700",
    letterSpacing: 0.8, textTransform: "uppercase",
    color: colors.primary, marginBottom: 10,
    fontFamily: MONO,
  },

  // Input
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  inputFocused:  { borderColor: colors.primaryMid },
  inputDisabled: { backgroundColor: colors.surface2, color: colors.text3 },
  inputError:    { borderColor: colors.danger },

  // Labels
  label: {
    fontSize: 11, fontWeight: "600",
    letterSpacing: 0.5, textTransform: "uppercase",
    color: colors.text3, marginBottom: 5,
    fontFamily: MONO,
  },
  hint:    { fontSize: 11, color: colors.text3, marginTop: 3 },
  errHint: { fontSize: 11, color: colors.danger, marginTop: 3, fontFamily: MONO },

  // Buttons
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  btnGhost: {
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText:  { color: colors.text2, fontSize: 14, fontWeight: "600" },
  btnSmall: {
    paddingVertical: 9, paddingHorizontal: 14,
    borderRadius: 8, backgroundColor: colors.surface,
    borderWidth: 0.5, borderColor: colors.border2,
    alignItems: "center", justifyContent: "center",
  },
  btnSmallText:  { fontSize: 13, fontWeight: "500", color: colors.text2 },
  btnRow: {
    flexDirection: "row", justifyContent: "flex-end",
    gap: 10, marginTop: 20, paddingTop: 16,
    borderTopWidth: 0.5, borderTopColor: colors.border,
  },

  // Section divider
  sectionDiv:     { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  sectionDivLine: { flex: 1, height: 0.5, backgroundColor: colors.border },
  sectionDivText: {
    fontSize: 10.5, fontWeight: "700",
    letterSpacing: 0.9, textTransform: "uppercase",
    color: colors.text4, fontFamily: MONO,
  },

  // Locked field
  lockedField: {
    backgroundColor: colors.surface2,
    borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  lockedLabel: {
    fontSize: 10, fontWeight: "700",
    letterSpacing: 0.7, textTransform: "uppercase",
    color: colors.text4, fontFamily: MONO, marginBottom: 4,
  },
  lockedValue: { fontSize: 14, fontWeight: "600", color: colors.text },

  // Banners
  infoBanner: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0.5, borderColor: "#BFDBFE",
    borderRadius: 8, padding: 12, marginBottom: 14,
    flexDirection: "row", gap: 8,
  },
  infoBannerText: { fontSize: 12.5, color: colors.primary, flex: 1, lineHeight: 18 },
  warnBanner: {
    backgroundColor: colors.warningBg,
    borderWidth: 0.5, borderColor: colors.warningBorder,
    borderRadius: 8, padding: 12, marginBottom: 14,
    flexDirection: "row", gap: 8,
  },
  warnBannerText: { fontSize: 12.5, color: colors.warning, flex: 1, lineHeight: 18 },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  emptyIcon:  { fontSize: 36 },
  emptyText:  { fontSize: 15, fontWeight: "500", color: colors.text2, marginTop: 12, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: colors.text3, textAlign: "center", lineHeight: 18 },

  // Firm type pills
  ftPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  ftPill:    { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border2, backgroundColor: colors.surface },
  ftPillOn:  { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  ftPillText: { fontSize: 12.5, fontWeight: "600", fontFamily: MONO, color: colors.text3 },
  ftPillTextOn: { color: colors.primary },

  // Mode toggle
  modeRow:      { flexDirection: "row", backgroundColor: colors.surface2, borderWidth: 0.5, borderColor: colors.border, borderRadius: 8, padding: 4, marginBottom: 16, gap: 4 },
  modeBtn:      { flex: 1, paddingVertical: 9, borderRadius: 6, alignItems: "center" },
  modeBtnOn:    { backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border },
  modeBtnText:  { fontSize: 13, fontWeight: "600", color: colors.text3 },
  modeBtnTextOn:{ color: colors.primary },

  // Badge
  badge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: "flex-start" },
  badgeNew:      { backgroundColor: colors.primaryLight, borderWidth: 0.5, borderColor: "#BFDBFE" },
  badgeEdit:     { backgroundColor: colors.warningBg, borderWidth: 0.5, borderColor: colors.warningBorder },
  badgeOk:       { backgroundColor: colors.successBg, borderWidth: 0.5, borderColor: colors.successBorder },
  badgeTextNew:  { fontSize: 11, fontWeight: "600", color: colors.primary, fontFamily: MONO },
  badgeTextEdit: { fontSize: 11, fontWeight: "600", color: colors.warning, fontFamily: MONO },
  badgeTextOk:   { fontSize: 11, fontWeight: "600", color: colors.success, fontFamily: MONO },

  // Timestamp pill
  tsPill:     { backgroundColor: colors.successBg, borderWidth: 0.5, borderColor: colors.successBorder, borderRadius: 6, padding: 8, flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, alignSelf: "flex-start" },
  tsPillText: { fontSize: 12, fontFamily: MONO, color: colors.success },

  // Validation box
  valBox:      { backgroundColor: colors.dangerBg, borderWidth: 0.5, borderColor: colors.dangerBorder, borderRadius: 8, padding: 12, marginBottom: 14 },
  valBoxTitle: { fontSize: 13, fontWeight: "600", color: colors.danger, marginBottom: 4 },
  valBoxText:  { fontSize: 12.5, color: colors.danger, lineHeight: 18 },

  // Sub-total
  subTotalRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 4 },
  subTotalText:{ fontSize: 12, color: colors.text3, fontFamily: MONO },
  subTotalErr: { fontSize: 12, color: colors.danger, fontFamily: MONO },

  // Grids
  row:       { flexDirection: "row", gap: 12 },
  grid2:     { flexDirection: "row", gap: 12, marginBottom: 0 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  grid3item: { flex: 1, minWidth: "30%" },

  // Overwrite warning
  overwriteWarn: { backgroundColor: colors.warningBg, borderWidth: 0.5, borderColor: colors.warningBorder, borderRadius: 8, padding: 10, marginBottom: 14, flexDirection: "row", gap: 6 },
  overwriteWarnText: { fontSize: 13, color: colors.warning, flex: 1, lineHeight: 18 },
});
