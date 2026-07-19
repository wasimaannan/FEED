import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllComplaints } from "../api";
import { colors, fonts, S } from "../theme";
import { FadeIn, ScreenHeader, EmptyState, TagLabel } from "../components";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const data = await getAllComplaints().catch(() => []);
      const isAdmin =
        String(user?.role || user?.Role || "").toLowerCase().includes('admin') ||
        user?.isAdmin === true ||
        user?.enrollId === 306007;

      const filteredData = isAdmin ? data : (data || []).filter(c => {
        const creatorId = String(c.DoctorID || c.CreatedBy || c.RaisedByUserID || c.intEnroll || c.RaisedBy || "");
        return creatorId === String(user?.enrollId);
      });

      setComplaints(filteredData || []);
    } finally {
      setRefresh(false);
    }
  }, [user]);

  useEffect(() => { load(); }, []);

  const filtered = filter === "resolved"
    ? complaints.filter(c => c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' || c.Status === "Resolved" || c.Resolution)
    : filter === "open"
    ? complaints.filter(c => !(c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' || c.Status === "Resolved" || c.Resolution))
    : complaints;

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.CreatedDate || a.ComplaintDate || 0);
    const dateB = new Date(b.CreatedDate || b.ComplaintDate || 0);
    return dateB - dateA;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View>
        <ScreenHeader
          title="Activity Timeline"
          sub="Complaints tracking · system events"
          icon={<Ionicons name="journal-outline" size={22} color="#fff" />}
        />
      </View>

      {/* Filter tabs */}
      <View style={act.filterRow}>
        {["all", "open", "resolved"].map(f => (
          <TouchableOpacity key={f} style={[act.filterBtn, filter === f && act.filterBtnOn]} onPress={() => setFilter(f)}>
            <Text style={[act.filterTxt, filter === f && act.filterTxtOn]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 88 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor={colors.brand} colors={[colors.brand]} />}
      >
        {sorted.length === 0
          ? <EmptyState icon={<Ionicons name="journal-outline" size={28} color="#B89AAA" />} title="No records found" sub="Activity will appear here once complaints are registered" />
          : sorted.map((c, i) => {
              const isRes = c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' || c.Status === "Resolved" || c.Resolution;
              const date = (c.CreatedDate || c.ComplaintDate || "").split('T')[0];
              const time = (c.CreatedDate || "").includes('T') ? c.CreatedDate.split('T')[1].substring(0, 5) : "";

              return (
                <FadeIn key={c.intAutoID || i} delay={i * 30}>
                  <View style={act.card}>
                    <View style={act.cardTop}>
                      <View style={[act.statusBadge, isRes ? act.resBadge : act.openBadge]}>
                        <Ionicons name={isRes ? "checkmark-circle" : "alert-circle"} size={16} color={isRes ? colors.success : colors.danger} />
                        <Text style={[act.statusTxt, { color: isRes ? colors.success : colors.danger }]}>
                          {isRes ? "RESOLVED" : "OPEN"}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={act.cardTitle}>{c.ComplaintName || c.strComplaint || c.Subject || "No Title"}</Text>
                        <Text style={act.cardMeta}>{c.FarmTypeName} · {c.ComplaintType}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={act.cardDate}>{date}</Text>
                        <Text style={act.cardTime}>{time}</Text>
                      </View>
                    </View>

                    <View style={act.infoRow}>
                      <View style={act.infoItem}>
                        <Text style={act.infoLabel}>Doctor</Text>
                        <Text style={act.infoVal}>{c.DoctorName || `Enrol #${c.DoctorID}`}</Text>
                      </View>
                      <View style={act.infoItem}>
                        <Text style={act.infoLabel}>Zone</Text>
                        <Text style={act.infoVal}>{c.ZoneName || "HQ"}</Text>
                      </View>
                      <View style={act.infoItem}>
                        <Text style={act.infoLabel}>Ref ID</Text>
                        <Text style={act.infoVal}>{c.intAutoID || "N/A"}</Text>
                      </View>
                    </View>

                    {c.Resolution && (
                      <View style={act.resSection}>
                        <Text style={act.resLabel}>Resolution Note:</Text>
                        <Text style={act.resText} numberOfLines={2}>{c.Resolution}</Text>
                      </View>
                    )}
                  </View>
                </FadeIn>
              );
            })
        }
      </ScrollView>
    </View>
  );
}

const act = StyleSheet.create({
  filterRow:    { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterBtn:    { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surfaceUp, borderWidth: 1.5, borderColor: colors.border },
  filterBtnOn:  { backgroundColor: colors.brand, borderColor: colors.brand },
  filterTxt:    { fontFamily: fonts.label, fontSize: 12.5, fontWeight: "700", color: colors.textSec },
  filterTxtOn:  { color: "#fff" },
  card:         { backgroundColor: colors.surface, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardTop:      { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  statusBadge:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  openBadge:    { backgroundColor: colors.dangerBg },
  resBadge:     { backgroundColor: colors.successBg },
  statusTxt:    { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  cardTitle:    { fontFamily: fonts.body, fontSize: 14, color: colors.textPrimary, fontWeight: "700" },
  cardMeta:     { fontFamily: fonts.body, fontSize: 11, color: colors.textSec, marginTop: 2 },
  cardDate:     { fontFamily: fonts.mono, fontSize: 10, color: colors.textTer },
  cardTime:     { fontFamily: fonts.mono, fontSize: 9, color: colors.textTer, marginTop: 2 },
  infoRow:      { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.03)" },
  infoItem:     { flex: 1 },
  infoLabel:    { fontSize: 9, color: colors.textTer, textTransform: "uppercase", fontWeight: "700", letterSpacing: 0.5 },
  infoVal:      { fontSize: 11, color: colors.textSec, marginTop: 2, fontWeight: "600" },
  resSection:   { padding: 12, backgroundColor: "rgba(0,0,0,0.01)" },
  resLabel:     { fontSize: 10, fontWeight: "800", color: colors.textTer, textTransform: "uppercase", marginBottom: 4 },
  resText:      { fontSize: 12, color: colors.textSec, lineHeight: 16, fontStyle: "italic" },
});
