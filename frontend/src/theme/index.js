import { StyleSheet, Platform, Dimensions } from "react-native";
const { width: SW } = Dimensions.get("window");

export const colors = {
  // Akij brand — deep maroon family
  brand:        "#4A1209",
  brandMid:     "#7A2415",
  brandLight:   "#B85A2A",
  brandGlow:    "rgba(74,18,9,0.15)",
  brandBorder:  "rgba(74,18,9,0.25)",

  // Canvas — warm linen
  bg:           "#FFFAF8",
  surface:      "#FFFFFF",
  surfaceUp:    "#F5EDE8",
  surfaceHigh:  "#EDD9CF",

  // Accent — warm amber
  gold:         "#D4824A",
  goldLight:    "#E8A06A",
  goldBg:       "rgba(212,130,74,0.10)",
  goldBorder:   "rgba(212,130,74,0.28)",

  // Neutral — warm browns
  border:       "#F0E0D8",
  borderMid:    "#E8D5CC",
  borderStrong: "#C4A090",

  // Text
  textPrimary:  "#1F0A06",
  textSec:      "#6B4A40",
  textTer:      "#C4A090",

  // Status
  success:      "#2A5C1A",
  successBg:    "rgba(42,92,26,0.09)",
  successBorder:"rgba(42,92,26,0.22)",
  danger:       "#B81A1A",
  dangerBg:     "rgba(184,26,26,0.09)",
  dangerBorder: "rgba(184,26,26,0.22)",
  warning:      "#B85A2A",
  warningBg:    "rgba(184,90,42,0.09)",
  warningBorder:"rgba(184,90,42,0.22)",

  // Module colors
  moduleDoc:    "#4A1209",
  moduleFarm:   "#7A2415",
  moduleVisit:  "#B85A2A",
  moduleAct:    "#D4824A",
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
  screen: { flex: 1, backgroundColor: "#FFFAF8" },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0E0D8",
    shadowColor: "#4A1209",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardBody:   { padding: 16 },
  cardAccent: { height: 3, backgroundColor: "#4A1209", borderTopLeftRadius: 16, borderTopRightRadius: 16 },

  input: {
    backgroundColor: "#F5EDE8",
    borderWidth: 1.5,
    borderColor: "#E8D5CC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }),
    fontSize: 15,
    color: "#1F0A06",
  },
  label:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#6B4A40", marginBottom: 6 },
  hint:    { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#C4A090", marginTop: 4 },
  errHint: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 11, color: "#B81A1A", marginTop: 4 },

  btnPrimary:     { backgroundColor: "#4A1209", borderRadius: 13, paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnPrimaryText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), color: "#FFFFFF", fontSize: 14.5, fontWeight: "700" },
  btnGhost:       { borderRadius: 13, borderWidth: 1.5, borderColor: "#E8D5CC", paddingVertical: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  btnGhostText:   { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), color: "#6B4A40", fontSize: 14, fontWeight: "600" },
  btnSmall:       { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#4A1209", alignItems: "center", justifyContent: "center" },
  btnSmallText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 13, fontWeight: "700", color: "#fff" },
  btnRow:         { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F0E0D8" },

  tagLabel:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 2 },
  tagLabelBar:  { width: 3, height: 14, borderRadius: 2, backgroundColor: "#4A1209" },
  tagLabelText: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#6B4A40" },

  sectionDiv:     { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: "#F0E0D8" },
  sectionDivText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", color: "#C4A090" },

  lockedField: { backgroundColor: "#F5EDE8", borderRadius: 11, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#4A1209", borderWidth: 1, borderColor: "#F0E0D8" },
  lockedLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 9.5, fontWeight: "700", letterSpacing: 0.9, textTransform: "uppercase", color: "#C4A090", marginBottom: 4 },
  lockedValue: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 15, fontWeight: "700", color: "#1F0A06" },

  searchPanel:      { backgroundColor: "#FFFFFF", borderRadius: 13, padding: 13, marginBottom: 14, borderWidth: 1.5, borderColor: "#E8D5CC" },
  searchPanelLabel: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 10, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: "#4A1209", marginBottom: 9 },

  ftPillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  ftPill:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: "#E8D5CC", backgroundColor: "#F5EDE8" },
  ftPillOn:     { borderColor: "#4A1209", backgroundColor: "rgba(74,18,9,0.09)" },
  ftPillText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#6B4A40" },
  ftPillTextOn: { color: "#4A1209" },

  modeRow:       { flexDirection: "row", backgroundColor: "#F5EDE8", borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: "#F0E0D8" },
  modeBtn:       { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  modeBtnOn:     { backgroundColor: "#FFFFFF", shadowColor: "#4A1209", shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  modeBtnText:   { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#C4A090" },
  modeBtnTextOn: { color: "#1F0A06" },

  badge:         { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:      { backgroundColor: "#F5EDE8", borderWidth: 1, borderColor: "#E8D5CC" },
  badgeEdit:     { backgroundColor: "rgba(184,90,42,0.09)", borderWidth: 1, borderColor: "rgba(184,90,42,0.28)" },
  badgeOk:       { backgroundColor: "rgba(42,92,26,0.09)", borderWidth: 1, borderColor: "rgba(42,92,26,0.28)" },
  badgeTextNew:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#6B4A40", letterSpacing: 0.7 },
  badgeTextEdit: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#B85A2A", letterSpacing: 0.7 },
  badgeTextOk:   { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 9.5, fontWeight: "700", color: "#2A5C1A", letterSpacing: 0.7 },

  tsPill:     { backgroundColor: "rgba(42,92,26,0.09)", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(42,92,26,0.22)" },
  tsPillText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#2A5C1A", fontWeight: "600" },

  valBox:      { backgroundColor: "rgba(184,26,26,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(184,26,26,0.22)" },
  valBoxTitle: { fontFamily: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }), fontSize: 12.5, fontWeight: "700", color: "#B81A1A", marginBottom: 4 },
  valBoxText:  { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 12, color: "#B81A1A", lineHeight: 18 },

  infoBanner:     { backgroundColor: "rgba(74,18,9,0.07)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(74,18,9,0.18)" },
  infoBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#4A1209", flex: 1, lineHeight: 19 },
  warnBanner:     { backgroundColor: "rgba(184,90,42,0.08)", borderRadius: 11, padding: 12, marginBottom: 12, flexDirection: "row", gap: 9, borderWidth: 1, borderColor: "rgba(184,90,42,0.22)" },
  warnBannerText: { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13, color: "#B85A2A", flex: 1, lineHeight: 19 },

  emptyState:    { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyIconWrap: { width: 68, height: 68, borderRadius: 20, backgroundColor: "#F5EDE8", borderWidth: 1.5, borderColor: "#E8D5CC", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyIcon:     { fontSize: 28 },
  emptyText:     { fontFamily: Platform.select({ ios: "Georgia", android: "serif" }), fontSize: 17, fontWeight: "700", color: "#1F0A06", marginBottom: 6 },
  emptySub:      { fontFamily: Platform.select({ ios: "Avenir-Medium", android: "sans-serif" }), fontSize: 13.5, color: "#C4A090", textAlign: "center", lineHeight: 20 },

  row:       { flexDirection: "row", gap: 10 },
  grid2:     { flexDirection: "row", gap: 10 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  grid3item: { flex: 1, minWidth: "30%" },
  subTotalRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 6 },
  subTotalText: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#6B4A40" },
  subTotalErr:  { fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }), fontSize: 12, color: "#B81A1A", fontWeight: "700" },
});
