import { useAudioPlayer } from "expo-audio";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";

import { usePlayerSettings } from "@/lib/supabase-hooks";
import { getAudioTrack, isResultTrack, type AudioTrack } from "@/services/audio-policy";

/*
 * expo-audio intentionally exposes an imperative player. Keeping every mutation in
 * this controller is what guarantees that route audio is stopped before replacement.
 */
/* eslint-disable react-hooks/immutability */

const TRACK_SOURCES: Record<AudioTrack, number> = {
  lobby: require("../../musik/lobby_musik.mp3"),
  ranked: require("../../musik/ranked_musik.mp3"),
  winner: require("../../musik/gewinner_sound.mp3"),
  loser: require("../../musik/verlierer_sound.mp3"),
};

const RESULT_SOUND_DURATION_MS = 8_000;

export function AppAudioController() {
  const pathname = usePathname();
  const params = useGlobalSearchParams<{
    result?: string;
    playerWins?: string;
    botWins?: string;
  }>();
  const settings = usePlayerSettings();
  const player = useAudioPlayer(null);

  const track = getAudioTrack({
    pathname,
    rankedResult: params.result,
    playerWins: params.playerWins,
    botWins: params.botWins,
  });

  useEffect(() => {
    player.pause();

    if (!track || settings.loading) return;

    const resultTrack = isResultTrack(track);
    const enabled = resultTrack ? settings.data.soundEnabled : settings.data.musicEnabled;
    if (!enabled) return;

    player.replace(TRACK_SOURCES[track]);
    player.loop = !resultTrack;
    player.play();

    if (!resultTrack) return;

    const stopTimer = setTimeout(() => {
      player.pause();
      void player.seekTo(0);
    }, RESULT_SOUND_DURATION_MS);

    return () => clearTimeout(stopTimer);
  }, [player, settings.data.musicEnabled, settings.data.soundEnabled, settings.loading, track]);

  return null;
}
