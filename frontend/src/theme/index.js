import { StyleSheet, Platform, Dimensions } from "react-native";
const { width: SW } = Dimensions.get("window");

export const colors = {
  // Akij brand
  brand:        "#0F5432",
  brandMid:     "#1A6B42",
  brandLight:   "#2E8B57",
  brandGlow:    "rgba(15,84,50,0.12)",
  brandBorder:  "rgba(15,84,50,0.25)",

  // Canvas
  bg:           "#F4F6F4",
  surface:      "#FFFFFF",
  surfaceUp:    "#F0F4F1",
  surfaceHigh:  "#E8EEE9",

  // Accent — gold/amber
  gold:         "#C8872A",
  goldLight:    "#E4A84A",
  goldBg:       "rgba(200,135,42,0.10)",
  goldBorder:   "rgba(200,135,42,0.28)",

  // Neutral
  border:       "#E2E8E3",
  borderMid:    "#CBD5CC",
  borderStrong: "#A8B5AA",

  // Text
  textPrimary:  "#0D1F13",
  textSec:      "#4A6550",
  textTer:      "#7A9480",

  // Status
  success:      "#1A7A3C",
  successBg:    "rgba(26,122,60,0.09)",
  successBorder:"rgba(26,122,60,0.22)",
  danger:       "#C0392B",
  dangerBg:     "rgba(192,57,43,0.09)",
  dangerBorder: "rgba(192,57,43,0.22)",
  warning:      "#C8872A",
  warningBg:    "rgba(200,135,42,0.09)",
  warningBorder:"rgba(200,135,42,0.22)",

  // Module colors
  moduleDoc:    "#0F5432",
  moduleFarm:   "#1A6B42",
  moduleVisit:  "#C8872A",
  moduleAct:    "#2E6DA4",
};

export const FIRM_TYPES    = ["Broiler", "Layer", "Sonali", "Cattle", "Fish"];
export const ZONES         = ["East", "West", "North", "South", "Central"];
export const SPECIALIZATIONS = ["Poultry", "Fish", "Cattle"];
export const MORTALITY     = ["Low", "Medium", "High"];
export const FEED_QUALITY  = ["Good", "Standard", "Below Standard"];

export const FONT_DISPLAY = Platform.select({ ios: "Georgia", android: "serif", default: "serif" });
export const FONT_BODY    = Platform.select({ ios: "Avenir-Medium", android: "sans-serif", default: "sans-serif" });
export const FONT_LABEL   = Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium", default: "sans-serif" });
export const FONT_MONO    = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
export const fonts = { display: FONT_DISPLAY, body: FONT_BODY, label: FONT_LABEL, mono: FONT_MONO };

export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6F4" },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8E3",
    shadowColor: "#0D1F13",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardBody: { padding: 16 },
  cardAccent: { height: 3, backgroundColor: "#0F5432", borderTopLeftRadius: 16, borderTopRightRadius: 16 },

  // Inputs
  input: {
    backgroundColor: "#F0F4F1",
    borderWidth: 1.5,
    borderColor: "#CBD5CC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }),
    fontSize: 15,
    color: "#0D1F13",
  },
  label:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#4A6550", marginBottom: 6 },
  hint:    { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#7A9480", marginTop: 4 },
  errHint: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 11, color: "#C0392B", marginTop: 4 },

  // Buttons
  btnPrimary:     { backgroundColor: "#0F5432", borderRadius: 13, paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnPrimaryText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), color: "#FFFFFF", fontSize: 14.5, fontWeight: "700" },
  btnGhost:       { borderRadius: 13, borderWidth: 1.5, borderColor: "#CBD5CC", paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  btnGhostText:   { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), color: "#4A6550", fontSize: 14, fontWeight: "600" },
  btnSmall:       { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#0F5432", alignItems: "center", justifyContent: "center" },
  btnSmallText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 13, fontWeight: "700", color: "#fff" },
  btnRow:         { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E2E8E3" },

  // Tag label
  tagLabel:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 2 },
  tagLabelBar:  { width: 3, height: 14, borderRadius: 2, backgroundColor: "#0F5432" },
  tagLabelText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#4A6550" },

  // Section divider
  sectionDiv:     { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: "#E2E8E3" },
  sectionDivText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#7A9480" },

  // Locked field
  lockedField: { backgroundColor: "#F0F4F1", borderRadius: 11, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#0F5432", borderWidth: 1, borderColor: "#E2E8E3" },
  lockedLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 0.9, textTransform: "uppercase", color: "#7A9480", marginBottom: 4 },
  lockedValue: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 15, fontWeight: "700", color: "#0D1F13" },

  // Search panel
  searchPanel:      { backgroundColor: "#FFFFFF", borderRadius: 13, padding: 13, marginBottom: 14, borderWidth: 1.5, borderColor: "#CBD5CC" },
  searchPanelLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#0F5432", marginBottom: 9 },

  // Pill row
  ftPillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  ftPill:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: "#CBD5CC", backgroundColor: "#F0F4F1" },
  ftPillOn:     { borderColor: "#0F5432", backgroundColor: "rgba(15,84,50,0.09)" },
  ftPillText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#4A6550" },
  ftPillTextOn: { color: "#0F5432" },

  // Mode toggle
  modeRow:       { flexDirection: "row", backgroundColor: "#E8EEE9", borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: "#E2E8E3" },
  modeBtn:       { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  modeBtnOn:     { backgroundColor: "#FFFFFF", shadowColor: "#0D1F13", shadowOpacity: 0.07, shadowRadius: 4, elevation: 1 },
  modeBtnText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#7A9480" },
  modeBtnTextOn: { color: "#0D1F13" },

  // Badge
  badge:         { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:      { backgroundColor: "#F0F4F1", borderWidth: 1, borderColor: "#CBD5CC" },
  badgeEdit:     { backgroundColor: "rgba(200,135,42,0.09)", borderWidth: 1, borderColor: "rgba(200,135,42,0.28)" },
  badgeOk:       { backgroundColor: "rgba(26,122,60,0.09)", borderWidth: 1, borderColor: "rgba(26,122,60,0.28)" },
  badgeTextNew:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#4A6550", letterSpacing: 0.7 },
  badgeTextEdit: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#C8872A", letterSpacing: 0.7 },
  badgeTextOk:   { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#1A7A3C", letterSpacing: 0.7 },

  // Timestamp pill
  tsPill:     { backgroundColor: "rgba(26,122,60,0.09)", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(26,122,60,0.22)" },
  tsPillText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#1A7A3C", fontWeight: "600" },

  // Validation
  valBox:      { backgroundColor: "rgba(192,57,43,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(192,57,43,0.22)" },
  valBoxTitle: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#C0392B", marginBottom: 4 },
  valBoxText:  { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#C0392B", lineHeight: 18 },

  // Info / warn banners
  infoBanner:     { backgroundColor: "rgba(15,84,50,0.07)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(15,84,50,0.20)" },
  infoBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#0F5432", flex: 1, lineHeight: 19 },
  warnBanner:     { backgroundColor: "rgba(200,135,42,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(200,135,42,0.25)" },
  warnBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#C8872A", flex: 1, lineHeight: 19 },

  // Empty state
  emptyState:    { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyIconWrap: { width: 68, height: 68, borderRadius: 20, backgroundColor: "#F0F4F1", borderWidth: 1.5, borderColor: "#CBD5CC", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyIcon:     { fontSize: 28 },
  emptyText:     { fontFamily: Platform.select({ ios: "Georgia", android: "serif" }), fontSize: 17, fontWeight: "700", color: "#0D1F13", marginBottom: 6 },
  emptySub:      { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13.5, color: "#7A9480", textAlign: "center", lineHeight: 20 },

  row:       { flexDirection: "row", gap: 10 },
  grid2:     { flexDirection: "row", gap: 10 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  grid3item: { flex: 1, minWidth: "30%" },
  subTotalRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 6 },
  subTotalText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#4A6550" },
  subTotalErr:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#C0392B", fontWeight: "700" },
});
