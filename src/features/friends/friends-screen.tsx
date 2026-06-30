import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View, type TextInput as TextInputType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radii } from "@/design/tokens";
import { useAuth } from "@/lib/auth-context";
import {
  fetchFriends,
  removeFriend,
  respondFriendRequest,
  searchUsers,
  sendFriendRequest,
  type FriendRecord,
  type UserSearchResult,
} from "@/services/supabase-data";
import { BottomNav } from "@/ui/primitives/bottom-nav";

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 44, isOnline }: { initials: string; size?: number; isOnline?: boolean }) {
  return (
    <View style={{ position: "relative" }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: colors.stageBerry,
        alignItems: "center", justifyContent: "center",
        borderWidth: 1.5, borderColor: "rgba(111,43,211,0.4)",
      }}>
        <Text style={{
          color: colors.white,
          fontFamily: fonts.displayExtraBold,
          fontSize: initials.length > 2 ? size * 0.25 : size * 0.33,
        }}>
          {initials.toUpperCase()}
        </Text>
      </View>
      {isOnline !== undefined && (
        <View style={{
          position: "absolute", bottom: 0, right: 0,
          width: 12, height: 12, borderRadius: 6,
          backgroundColor: isOnline ? colors.online : "rgba(255,255,255,0.2)",
          borderWidth: 2, borderColor: colors.stageGrapeDeep,
        }} />
      )}
    </View>
  );
}

// ── Friend row ────────────────────────────────────────────────────────────────

function FriendRow({
  friend,
  onRemove,
  onAccept,
  onDecline,
}: {
  friend: FriendRecord;
  onRemove?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const isPending = friend.status === "pending";
  const isIncoming = isPending && !friend.isRequester;

  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 12,
      paddingVertical: 12, paddingHorizontal: 16,
      borderRadius: radii.card,
      backgroundColor: "rgba(255,255,255,0.04)",
      borderWidth: 1,
      borderColor: isPending ? "rgba(255,216,77,0.2)" : "rgba(255,255,255,0.07)",
      marginBottom: 8,
    }}>
      <Avatar initials={friend.avatarInitials} isOnline={friend.isOnline} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15 }}>
          {friend.displayName}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.38)", fontFamily: fonts.body, fontSize: 12, marginTop: 2 }}>
          {isPending
            ? isIncoming ? "Freundschaftsanfrage erhalten" : "Anfrage gesendet"
            : friend.isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      {isIncoming ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={onAccept} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.control, backgroundColor: colors.online }}>
            <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 13 }}>Annehmen</Text>
          </Pressable>
          <Pressable onPress={onDecline} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.control, backgroundColor: "rgba(240,68,110,0.25)", borderWidth: 1, borderColor: colors.stageCoral }}>
            <Text style={{ color: colors.stageCoral, fontFamily: fonts.bodyBold, fontSize: 13 }}>Ablehnen</Text>
          </Pressable>
        </View>
      ) : isPending ? (
        <Pressable onPress={onDecline} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.control, backgroundColor: "rgba(255,255,255,0.06)" }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 12 }}>Abbrechen</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onRemove} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.control, backgroundColor: "rgba(255,255,255,0.06)" }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.body, fontSize: 12 }}>Entfernen</Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Search result row ─────────────────────────────────────────────────────────

function SearchRow({ user, onAdd, sent }: { user: UserSearchResult; onAdd: () => void; sent: boolean }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 12,
      paddingVertical: 10, paddingHorizontal: 16,
      borderRadius: radii.card,
      backgroundColor: "rgba(255,255,255,0.04)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
      marginBottom: 8,
    }}>
      <Avatar initials={user.avatarInitials} size={40} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.white, fontFamily: fonts.bodySemiBold, fontSize: 15 }}>
          {user.displayName}
        </Text>
        {user.isBot && (
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 4,
            alignSelf: "flex-start",
            backgroundColor: "rgba(168,85,247,0.18)",
            borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
            borderWidth: 1, borderColor: "rgba(168,85,247,0.4)",
          }}>
            <Text style={{ color: "rgba(168,85,247,0.9)", fontFamily: fonts.bodyBold, fontSize: 10 }}>BOT</Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={onAdd}
        disabled={sent}
        style={({ pressed }) => ({
          paddingHorizontal: 14, paddingVertical: 7,
          borderRadius: radii.control,
          backgroundColor: sent ? "rgba(67,184,107,0.2)" : colors.stageGrape,
          borderWidth: 1, borderColor: sent ? colors.online : "transparent",
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <Text style={{ color: sent ? colors.online : colors.white, fontFamily: fonts.bodyBold, fontSize: 13 }}>
          {sent ? "Gesendet" : "Hinzufügen"}
        </Text>
      </Pressable>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<TextInputType>(null);
  const scrollRef = useRef<ScrollView>(null);

  const loadFriends = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const list = await fetchFriends(userId);
      setFriends(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Freunde konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => void loadFriends(), 0);
    return () => clearTimeout(timer);
  }, [loadFriends]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setSearching(false);
        return;
      }
      if (!userId) return;
      setSearching(true);
      try {
        const results = await searchUsers(searchQuery, userId);
        // Hide users already in friends list
        const existingIds = new Set(friends.map((f) => f.friendId));
        setSearchResults(results.filter((r) => !existingIds.has(r.id)));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, searchQuery.trim().length < 2 ? 0 : 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery, friends, userId]);

  const handleAccept = async (f: FriendRecord) => {
    try {
      await respondFriendRequest(f.friendshipId, true);
      void loadFriends();
    } catch {}
  };

  const handleDecline = async (f: FriendRecord) => {
    try {
      await respondFriendRequest(f.friendshipId, false);
      setFriends((prev) => prev.filter((x) => x.friendshipId !== f.friendshipId));
    } catch {}
  };

  const handleRemove = async (f: FriendRecord) => {
    try {
      await removeFriend(f.friendshipId);
      setFriends((prev) => prev.filter((x) => x.friendshipId !== f.friendshipId));
    } catch {}
  };

  const handleAdd = async (user: UserSearchResult) => {
    if (!userId) return;
    try {
      await sendFriendRequest(userId, user.id);
      setSentTo((prev) => new Set(prev).add(user.id));
      void loadFriends();
    } catch {}
  };

  const accepted = friends.filter((f) => f.status === "accepted");
  const pending = friends.filter((f) => f.status === "pending");
  const incomingCount = pending.filter((f) => !f.isRequester).length;

  const showSearch = searchQuery.trim().length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.stageGrapeDeep }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.whiteFaint,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: colors.white, fontFamily: fonts.displayExtraBold, fontSize: 26 }}>
            Friends
          </Text>
          <Pressable
            onPress={() => {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
              setTimeout(() => searchRef.current?.focus(), 200);
            }}
            style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: colors.stageGrape,
              alignItems: "center", justifyContent: "center",
              shadowColor: colors.stageGrape,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6, shadowRadius: 8,
              opacity: pressed ? 0.75 : 1,
            })}
            accessibilityLabel="Freund hinzufügen"
          >
            <Text style={{ color: colors.white, fontSize: 22, lineHeight: 24, fontFamily: fonts.displayExtraBold }}>+</Text>
          </Pressable>
        </View>
        {incomingCount > 0 && (
          <View style={{
            marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: "rgba(255,216,77,0.12)", borderRadius: radii.control,
            paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start",
            borderWidth: 1, borderColor: "rgba(255,216,77,0.3)",
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sun }} />
            <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12 }}>
              {incomingCount} neue Anfrage{incomingCount !== 1 ? "n" : ""}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: "rgba(255,255,255,0.07)",
          borderRadius: radii.control,
          borderWidth: 1.5, borderColor: "rgba(111,43,211,0.4)",
          paddingHorizontal: 16,
          marginBottom: 24,
        }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>🔍</Text>
          <TextInput
            ref={searchRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Name eingeben…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={{ flex: 1, color: colors.white, fontFamily: fonts.body, fontSize: 15, paddingVertical: 12 }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searching && <ActivityIndicator size="small" color={colors.stageGrape} />}
        </View>

        {/* Search results */}
        {showSearch && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, marginBottom: 10 }}>
              SUCHERGEBNISSE
            </Text>
            {searchResults.length === 0 && !searching ? (
              <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: fonts.body, fontSize: 14, textAlign: "center", paddingVertical: 16 }}>
                Kein Spieler gefunden
              </Text>
            ) : (
              searchResults.map((user) => (
                <SearchRow
                  key={user.id}
                  user={user}
                  onAdd={() => void handleAdd(user)}
                  sent={sentTo.has(user.id)}
                />
              ))
            )}
          </View>
        )}

        {/* Pending requests */}
        {pending.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: colors.sun, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, marginBottom: 10 }}>
              ANFRAGEN ({pending.length})
            </Text>
            {pending.map((f) => (
              <FriendRow
                key={f.friendshipId}
                friend={f}
                onAccept={() => void handleAccept(f)}
                onDecline={() => void handleDecline(f)}
              />
            ))}
          </View>
        )}

        {/* Friends list */}
        <View>
          <Text style={{ color: colors.whiteSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, marginBottom: 10 }}>
            FREUNDE ({accepted.length})
          </Text>
          {loading ? (
            <ActivityIndicator color={colors.stageGrape} style={{ marginTop: 32 }} />
          ) : error ? (
            <Text style={{ color: colors.stageCoral, fontFamily: fonts.body, fontSize: 14, textAlign: "center", paddingVertical: 20 }}>
              {error}
            </Text>
          ) : accepted.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40, gap: 10 }}>
              <Text style={{ fontSize: 40 }}>👥</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: fonts.bodySemiBold, fontSize: 15, textAlign: "center" }}>
                Noch keine Freunde
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.3)", fontFamily: fonts.body, fontSize: 13, textAlign: "center" }}>
                Suche nach Spielernamen oben
              </Text>
            </View>
          ) : (
            accepted.map((f) => (
              <FriendRow
                key={f.friendshipId}
                friend={f}
                onRemove={() => void handleRemove(f)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav activeTab="friends" />
    </View>
  );
}
