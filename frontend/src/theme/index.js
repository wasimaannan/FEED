// src/theme/index.js
import { StyleSheet, Platform, Dimensions } from "react-native";

const { height: SH } = Dimensions.get("window");

export const colors = {
  // Canvas — deep maroon family
  bg:           "#120608",   // near-black with maroon tint
  surface:      "#1C0B0D",   // card base
  surfaceUp:    "#251114",   // elevated surface
  surfaceHigh:  "#2E1518",   // top surface

  // Brand — FEED maroon
  brand:        "#420F07",   // FEED primary maroon
  brandDeep:    "#2D0905",   // pressed
  brandMid:     "#5C1810",   // hover/active
  brandGlow:    "rgba(66,15,7,0.40)",

  // Gold accent — kept for premium feel
  gold:         "#B8832A",
  goldBright:   "#CFA044",
  goldSoft:     "#C0903C",
  goldGlow:     "rgba(184,131,42,0.18)",
  goldText:     "#D4A84A",

  // Borders
  border:       "#2E1518",
  borderMid:    "#3D1D20",
  borderGold:   "rgba(184,131,42,0.25)",

  // Text — warm cream on maroon
  textPrimary:  "#F5EDE8",   // warm cream white
  textSec:      "#A07870",   // muted rose-grey
  textTertiary: "#6B4A47",   // very muted

  // Status
  success:      "#7DBF9A",
  successBg:    "rgba(125,191,154,0.12)",
  successBorder:"rgba(125,191,154,0.25)",
  danger:       "#E57373",
  dangerBg:     "rgba(229,115,115,0.10)",
  dangerBorder: "rgba(229,115,115,0.25)",
  warning:      "#C0903C",
  warningBg:    "rgba(184,131,42,0.12)",
  warningBorder:"rgba(184,131,42,0.22)",

  // Aliases
  ink:          "#F5EDE8",
  inkLight:     "#A07870",
  inkFaint:     "#6B4A47",
  paper:        "#120608",
  card:         "#1C0B0D",
  cardAlt:      "#251114",
  line:         "#2E1518",
  lineStrong:   "#3D1D20",
  navy:         "#420F07",
  navySoft:     "rgba(66,15,7,0.20)",
  orange:       "#B8832A",

  // Module cards
  moduleDoctor: "#420F07",   // deep maroon
  moduleVisit:  "#8C6420",   // warm gold
  moduleFarm:   "#6B2D0F",   // burnt sienna — distinct from maroon, complements gold
  lime:         "#420F07",
  wheat:        "#6B2D0F",
};

export const FIRM_TYPES = ["Broiler", "Layer", "Sonali", "Cattle", "Fish"];
export const ZONES      = ["East", "West", "North", "South", "Central"];

export const FONT_DISPLAY = Platform.select({ ios: "Georgia", android: "serif", default: "serif" });
export const FONT_BODY    = Platform.select({ ios: "Avenir-Medium", android: "sans-serif", default: "sans-serif" });
export const FONT_LABEL   = Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium", default: "sans-serif" });
export const FONT_MONO    = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
export const fonts = { display: FONT_DISPLAY, body: FONT_BODY, label: FONT_LABEL, mono: FONT_MONO };
export const HEADER_HEIGHT = SH < 700 ? 110 : 130;
export const motion = {
  springSnappy: { damping: 16, stiffness: 220, mass: 0.7 },
  springSoft:   { damping: 18, stiffness: 140, mass: 0.9 },
  springBouncy: { damping: 10, stiffness: 180, mass: 0.8 },
  durFast: 140, durMed: 240, durSlow: 380,
};

export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#120608" },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 36 },

  homeHeader:   { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 8 },
  homeGreeting: { fontFamily: "sans-serif", fontSize: 14, color: "#A07870" },
  homeTitle:    { fontFamily: "serif", fontSize: 28, fontWeight: "800", color: "#F5EDE8", letterSpacing: -0.5, marginTop: 2 },
  homeGrid:     { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 24, gap: 16 },
  homeCardShape:   { borderRadius: 24, padding: 22, minHeight: 168, justifyContent: "space-between", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  homeCardIconWrap:{ width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  homeCardIcon:    { fontSize: 28 },
  homeCardTitle:   { fontFamily: "serif", fontSize: 19, fontWeight: "800", color: "#fff", marginTop: 14 },
  homeCardSub:     { fontFamily: "sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 3, lineHeight: 17 },
  homeCardArrow:   { position: "absolute", right: 18, bottom: 18, width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },

  headerBand:      { paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: "#2E1518" },
  headerBandTitle: { fontFamily: "serif", fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.3 },
  headerBandSub:   { fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.70)", marginTop: 3 },
  headerBandIcon:  { width: 48, height: 48, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },

  header:       { paddingHorizontal: 20, paddingBottom: 18, justifyContent: "flex-end", borderBottomWidth: 1, borderBottomColor: "#2E1518" },
  headerRow:    { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  headerIconBox:{ width: 46, height: 46, borderRadius: 13, backgroundColor: "#2E1518", borderWidth: 1, borderColor: "rgba(200,151,42,0.3)", alignItems: "center", justifyContent: "center" },
  headerEyebrow:{ fontFamily: "sans-serif-medium", fontSize: 10, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", color: "#F0C96A", marginBottom: 5 },
  headerTitle:  { fontFamily: "serif", fontSize: 30, fontWeight: "700", color: "#F5EDE8", letterSpacing: 0.3 },
  headerSub:    { fontFamily: "sans-serif", fontSize: 13, color: "#A07870", marginTop: 3 },

  card:          { backgroundColor: "#1C0B0D", borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: "#2E1518", overflow: "visible" },
  cardBody:      { padding: 18 },
  cardAccentBar: { height: 2, backgroundColor: "#C8972A", borderTopLeftRadius: 18, borderTopRightRadius: 18 },

  input:         { backgroundColor: "#251114", borderWidth: 1.5, borderColor: "#3D1D20", borderRadius: 13, paddingHorizontal: 15, paddingVertical: 14, fontFamily: "sans-serif", fontSize: 15, color: "#F5EDE8" },
  inputFocused:  { borderColor: "#C8972A" },
  inputDisabled: { opacity: 0.38 },
  inputError:    { borderColor: "#E57373" },

  label:   { fontFamily: "sans-serif-medium", fontSize: 10.5, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", color: "#A07870", marginBottom: 7 },
  hint:    { fontFamily: "sans-serif", fontSize: 12, color: "#6B4A47", marginTop: 4 },
  errHint: { fontFamily: "monospace", fontSize: 11, color: "#E57373", marginTop: 5 },

  btnPrimary:      { backgroundColor: "#420F07", borderRadius: 14, paddingVertical: 15, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, borderWidth: 1, borderColor: "#5C1810" },
  btnPrimaryShape: { backgroundColor: "#420F07", borderRadius: 14, paddingVertical: 15, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, borderWidth: 1, borderColor: "#5C1810" },
  btnPrimaryText:  { fontFamily: "sans-serif-medium", color: "#FFFFFF", fontSize: 14.5, fontWeight: "700", letterSpacing: 0.3 },
  btnGhost:        { backgroundColor: "transparent", borderRadius: 14, borderWidth: 1.5, borderColor: "#3D1D20", paddingVertical: 15, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  btnGhostText:    { fontFamily: "sans-serif", color: "#A07870", fontSize: 14, fontWeight: "600" },
  btnSmall:        { paddingVertical: 13, paddingHorizontal: 18, borderRadius: 12, backgroundColor: "#420F07", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#5C1810" },
  btnSmallShape:   { paddingVertical: 13, paddingHorizontal: 18, borderRadius: 12, backgroundColor: "#420F07", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#5C1810" },
  btnSmallText:    { fontFamily: "sans-serif-medium", fontSize: 13, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  btnRow:          { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 22, paddingTop: 18, borderTopWidth: 1, borderTopColor: "#2E1518" },

  tagLabel:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 4 },
  tagLabelBar:  { width: 2.5, height: 14, borderRadius: 2, backgroundColor: "#C8972A" },
  tagLabelText: { fontFamily: "sans-serif-medium", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", color: "#A07870" },

  sectionDiv:     { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 },
  sectionDivLine: { flex: 1, height: 1, backgroundColor: "#2E1518" },
  sectionDivText: { fontFamily: "monospace", fontSize: 9.5, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", color: "#6B4A47" },

  searchPanel:      { backgroundColor: "#251114", borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#3D1D20" },
  searchPanelLabel: { fontFamily: "sans-serif-medium", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", color: "#F0C96A", marginBottom: 10 },

  lockedField: { backgroundColor: "#251114", borderRadius: 12, padding: 13, marginBottom: 10, borderLeftWidth: 2, borderLeftColor: "#C8972A", borderWidth: 1, borderColor: "#2E1518" },
  lockedLabel: { fontFamily: "sans-serif-medium", fontSize: 9.5, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: "#6B4A47", marginBottom: 5 },
  lockedValue: { fontFamily: "sans-serif", fontSize: 15, fontWeight: "700", color: "#F5EDE8" },

  infoBanner:     { backgroundColor: "rgba(200,151,42,0.18)", borderRadius: 12, padding: 13, marginBottom: 14, flexDirection: "row", gap: 10, borderWidth: 1, borderColor: "rgba(200,151,42,0.3)" },
  infoBannerText: { fontFamily: "sans-serif", fontSize: 13, color: "#F0C96A", flex: 1, lineHeight: 19 },
  warnBanner:     { backgroundColor: "rgba(212,162,76,0.12)", borderRadius: 12, padding: 13, marginBottom: 14, flexDirection: "row", gap: 10, borderWidth: 1, borderColor: "rgba(212,162,76,0.25)" },
  warnBannerText: { fontFamily: "sans-serif", fontSize: 13, color: "#D4A24C", flex: 1, lineHeight: 19 },

  emptyState:    { alignItems: "center", paddingVertical: 52, paddingHorizontal: 24 },
  emptyIconWrap: { width: 70, height: 70, borderRadius: 20, backgroundColor: "#251114", borderWidth: 1, borderColor: "rgba(200,151,42,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyIcon:     { fontSize: 30 },
  emptyText:     { fontFamily: "serif", fontSize: 17, fontWeight: "700", color: "#F5EDE8", marginBottom: 7 },
  emptySub:      { fontFamily: "sans-serif", fontSize: 13.5, color: "#6B4A47", textAlign: "center", lineHeight: 20 },

  ftPillRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  ftPill:       { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: "#3D1D20", backgroundColor: "#251114" },
  ftPillShape:  { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: "#3D1D20", backgroundColor: "#251114" },
  ftPillOn:     { borderColor: "#C8972A", backgroundColor: "rgba(200,151,42,0.18)" },
  ftPillText:   { fontFamily: "sans-serif-medium", fontSize: 12.5, fontWeight: "700", color: "#A07870" },
  ftPillTextOn: { color: "#F0C96A" },

  modeRow:       { flexDirection: "row", backgroundColor: "#251114", borderRadius: 13, padding: 4, marginBottom: 18, gap: 4, borderWidth: 1, borderColor: "#2E1518" },
  modeBtn:       { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  modeBtnShape:  { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center" },
  modeBtnOn:     { backgroundColor: "#420F07", borderWidth: 1, borderColor: "#5C1810" },
  modeBtnText:   { fontFamily: "sans-serif-medium", fontSize: 12.5, fontWeight: "700", color: "#6B4A47" },
  modeBtnTextOn: { color: "#fff" },

  badge:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start" },
  badgeNew:      { backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "#2E1518" },
  badgeEdit:     { backgroundColor: "rgba(212,162,76,0.12)", borderWidth: 1, borderColor: "rgba(212,162,76,0.25)" },
  badgeOk:       { backgroundColor: "rgba(125,191,154,0.12)", borderWidth: 1, borderColor: "rgba(125,191,154,0.25)" },
  badgeTextNew:  { fontFamily: "monospace", fontSize: 9.5, fontWeight: "700", color: "#A07870", letterSpacing: 0.8 },
  badgeTextEdit: { fontFamily: "monospace", fontSize: 9.5, fontWeight: "700", color: "#D4A24C", letterSpacing: 0.8 },
  badgeTextOk:   { fontFamily: "monospace", fontSize: 9.5, fontWeight: "700", color: "#7DBF9A", letterSpacing: 0.8 },

  tsPill:     { backgroundColor: "rgba(125,191,154,0.12)", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, alignSelf: "flex-start", borderWidth: 1, borderColor: "rgba(125,191,154,0.25)" },
  tsPillText: { fontFamily: "monospace", fontSize: 12, color: "#7DBF9A", fontWeight: "600" },

  valBox:      { backgroundColor: "rgba(229,115,115,0.10)", borderRadius: 12, padding: 13, marginBottom: 14, borderWidth: 1, borderColor: "rgba(229,115,115,0.25)" },
  valBoxTitle: { fontFamily: "sans-serif-medium", fontSize: 12.5, fontWeight: "700", color: "#E57373", marginBottom: 5 },
  valBoxText:  { fontFamily: "sans-serif", fontSize: 12, color: "#E57373", lineHeight: 18 },

  subTotalRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, marginBottom: 6 },
  subTotalText: { fontFamily: "monospace", fontSize: 12, color: "#A07870" },
  subTotalErr:  { fontFamily: "monospace", fontSize: 12, color: "#E57373", fontWeight: "700" },

  row:       { flexDirection: "row", gap: 10 },
  grid2:     { flexDirection: "row", gap: 10 },
  grid3:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  grid3item: { flex: 1, minWidth: "30%" },

  overwriteWarn:     { backgroundColor: "rgba(212,162,76,0.12)", borderRadius: 12, padding: 13, marginBottom: 14, flexDirection: "row", gap: 8, borderWidth: 1, borderColor: "rgba(212,162,76,0.25)" },
  overwriteWarnText: { fontFamily: "sans-serif", fontSize: 13, color: "#D4A24C", flex: 1, lineHeight: 19 },
});
