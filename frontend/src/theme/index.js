import { StyleSheet, Platform, Dimensions } from "react-native";
const { width: SW } = Dimensions.get("window");

export const colors = {
  // Sunset brand
  brand:        "#C2386E",
  brandMid:     "#A8306B",
  brandLight:   "#FF6B6B",
  brandGlow:    "rgba(194,56,110,0.12)",
  brandBorder:  "rgba(194,56,110,0.25)",

  // Canvas — warm off-white instead of green-tinted
  bg:           "#FAF7F8",
  surface:      "#FFFFFF",
  surfaceUp:    "#F6EEF1",
  surfaceHigh:  "#F0E5EA",

  // Accent — violet (secondary)
  gold:         "#8B3FA8",
  goldLight:    "#A85FC4",
  goldBg:       "rgba(139,63,168,0.10)",
  goldBorder:   "rgba(139,63,168,0.28)",

  // Neutral — warm greys instead of green greys
  border:       "#F0E5EA",
  borderMid:    "#E0CBD4",
  borderStrong: "#C9A8B6",

  // Text — warm dark instead of green-black
  textPrimary:  "#1F1320",
  textSec:      "#7A5C6E",
  textTer:      "#B89AAA",

  // Status
  success:      "#1A9C5C",
  successBg:    "rgba(26,156,92,0.09)",
  successBorder:"rgba(26,156,92,0.22)",
  danger:       "#D6336C",
  dangerBg:     "rgba(214,51,108,0.09)",
  dangerBorder: "rgba(214,51,108,0.22)",
  warning:      "#F2542D",
  warningBg:    "rgba(242,84,45,0.09)",
  warningBorder:"rgba(242,84,45,0.22)",

  // Module colors
  moduleDoc:    "#FF6B6B",
  moduleFarm:   "#8B3FA8",
  moduleVisit:  "#F2542D",
  moduleAct:    "#5B2A86",
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
  screen: { flex: 1, backgroundColor: "#FAF7F8" },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0E5EA",
    shadowColor: "#1F1320",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardBody: { padding: 16 },
  cardAccent: { height: 3, backgroundColor: "#C2386E", borderTopLeftRadius: 16, borderTopRightRadius: 16 },

  input: {
    backgroundColor: "#F6EEF1",
    borderWidth: 1.5,
    borderColor: "#E0CBD4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }),
    fontSize: 15,
    color: "#1F1320",
  },
  label:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#7A5C6E", marginBottom: 6 },
  hint:    { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#B89AAA", marginTop: 4 },
  errHint: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 11, color: "#D6336C", marginTop: 4 },

  btnPrimary:     { backgroundColor: "#C2386E", borderRadius: 13, paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnPrimaryText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), color: "#FFFFFF", fontSize: 14.5, fontWeight: "700" },
  btnGhost:       { borderRadius: 13, borderWidth: 1.5, borderColor: "#E0CBD4", paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  btnGhostText:   { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), color: "#7A5C6E", fontSize: 14, fontWeight: "600" },
  btnSmall:       { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#C2386E", alignItems: "center", justifyContent: "center" },
  btnSmallText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 13, fontWeight: "700", color: "#fff" },
  btnRow:         { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F0E5EA" },

  tagLabel:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 2 },
  tagLabelBar:  { width: 3, height: 14, borderRadius: 2, backgroundColor: "#C2386E" },
  tagLabelText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#7A5C6E" },

  sectionDiv:     { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: "#F0E5EA" },
  sectionDivText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#B89AAA" },

  lockedField: { backgroundColor: "#F6EEF1", borderRadius: 11, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#C2386E", borderWidth: 1, borderColor: "#F0E5EA" },
  lockedLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 0.9, textTransform: "uppercase", color: "#B89AAA", marginBottom: 4 },
  lockedValue: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 15, fontWeight: "700", color: "#1F1320" },

  searchPanel:      { backgroundColor: "#FFFFFF", borderRadius: 13, padding: 13, marginBottom: 14, borderWidth: 1.5, borderColor: "#E0CBD4" },
  searchPanelLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#C2386E", marginBottom: 9 },

  ftPillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  ftPill:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: "#E0CBD4", backgroundColor: "#F6EEF1" },
  ftPillOn:     { borderColor: "#C2386E", backgroundColor: "rgba(194,56,110,0.09)" },
  ftPillText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#7A5C6E" },
  ftPillTextOn: { color: "#C2386E" },

  modeRow:       { flexDirection: "row", backgroundColor: "#F0E5EA", borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: "#F0E5EA" },
  modeBtn:       { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  modeBtnOn:     { backgroundColor: "#FFFFFF", shadowColor: "#1F1320", shadowOpacity: 0.07, shadowRadius: 4, elevation: 1 },
  modeBtnText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#B89AAA" },
  modeBtnTextOn: { color: "#1F1320" },

  badge:         { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:      { backgroundColor: "#F6EEF1", borderWidth: 1, borderColor: "#E0CBD4" },
  badgeEdit:     { backgroundColor: "rgba(242,84,45,0.09)", borderWidth: 1, borderColor: "rgba(242,84,45,0.28)" },
  badgeOk:       { backgroundColor: "rgba(26,156,92,0.09)", borderWidth: 1, borderColor: "rgba(26,156,92,0.28)" },
  badgeTextNew:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#7A5C6E", letterSpacing: 0.7 },
  badgeTextEdit: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#F2542D", letterSpacing: 0.7 },
  badgeTextOk:   { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#1A9C5C", letterSpacing: 0.7 },

  tsPill:     { backgroundColor: "rgba(26,156,92,0.09)", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(26,156,92,0.22)" },
  tsPillText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#1A9C5C", fontWeight: "600" },

  valBox:      { backgroundColor: "rgba(214,51,108,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(214,51,108,0.22)" },
  valBoxTitle: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#D6336C", marginBottom: 4 },
  valBoxText:  { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#D6336C", lineHeight: 18 },

  infoBanner:     { backgroundColor: "rgba(194,56,110,0.07)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(194,56,110,0.20)" },
  infoBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#C2386E", flex: 1, lineHeight: 19 },
  warnBanner:     { backgroundColor: "rgba(242,84,45,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(242,84,45,0.25)" },
  warnBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#F2542D", flex: 1, lineHeight: 19 },

  emptyState:    { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyIconWrap: { width: 68, height: 68, borderRadius: 20, backgroundColor: "#F6EEF1", borderWidth: 1.5, borderColor: "#E0CBD4", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyIcon:     { fontSize: 28 },
  emptyText:     { fontFamily: Platform.select({ ios: "Georgia", android: "serif" }), fontSize: 17, fontWeight: "700", color: "#1F1320", marginBottom: 6 },
  emptySub:      { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13.5, color: "#B89AAA", textAlign: "center", lineHeight: 20 },

  row:       { flexDirection: "row", gap: 10 },
  grid2:     { flexDirection: "row", gap: 10 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  grid3item: { flex: 1, minWidth: "30%" },
  subTotalRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 6 },
  subTotalText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#7A5C6E" },
  subTotalErr:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#D6336C", fontWeight: "700" },
});
