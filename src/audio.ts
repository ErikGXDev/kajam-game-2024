import { AudioPlay } from "kaplay";
import { k } from "./kaplay";

interface MusicState {
  currentBpm: number;
  currentSoundId: string;
  stageAudios: Record<string, AudioPlay>;
}

const musicState: MusicState = {
  currentBpm: 0,
  currentSoundId: "",
  stageAudios: {},
};

interface MusicData {
  stages: Record<string, string>;
  defaultStage: string;
  bpm: number;
}

export function getCurrentAudio() {
  return musicState.stageAudios[musicState.currentSoundId];
}

export function getCurrentAudioStage() {
  return musicState.currentSoundId;
}

export function loadAudioStage(stage: string, audioId: string) {
  const audio = k.play(audioId, {
    loop: true,
    volume: 0,
  });

  musicState.stageAudios[stage] = audio;
  musicState.currentSoundId = audioId;
}

export function stopAudioStages(exclude?: string) {
  Object.keys(musicState.stageAudios).forEach((stage: string) => {
    if (stage !== exclude) {
      const audio = musicState.stageAudios[stage];
      k.tween(audio.volume, 0, 0.3, (p) => (audio.volume = p));
    }
  });
}

export interface PlayAudioStageOptions {
  keepTime?: boolean;
  loop?: boolean;
}

export async function playAudioStage(
  stage: string,
  { keepTime, loop }: PlayAudioStageOptions = {}
): Promise<void> {
  if (!musicState.stageAudios.hasOwnProperty(stage)) {
    console.error(
      `Audio stage "${stage}" not found in musicState.stageAudios.`
    );
    return;
  }

  console.log("Playing audio stage", stage);

  stopAudioStages(stage);

  musicState.currentSoundId = stage;

  const audio = musicState.stageAudios[stage];

  audio.loop = loop ?? true;

  audio.volume = 0.1;

  audio.play(keepTime ? getCurrentAudio().time() : 0);

  k.tween(audio.volume, 1, 0.3, (p) => (audio.volume = p));

  return new Promise<void>((resolve) => {
    audio.onEnd(() => {
      resolve();
    });
  });

  /*
  if (!keepTime) {
    audio.seek(0);
  } else if (musicState.stageAudios.hasOwnProperty(musicState.currentSoundId)) {
    console.log(getCurrentAudioStage().time());
    audio.seek(getCurrentAudioStage().time());
  }*/
}

export function playMusic(musicData: MusicData) {
  stopAudioStages();
  for (const stage of Object.keys(musicData.stages)) {
    loadAudioStage(stage, musicData.stages[stage]);
  }

  console.log(musicState);

  playAudioStage(musicData.defaultStage, {
    keepTime: false,
  });

  musicState.currentBpm = musicData.bpm;
  musicState.currentSoundId = musicData.stages.normal;
}

export function waitBeat(n: number) {
  return k.wait(n * (60 / musicState.currentBpm));
}

export function beatTime(n: number) {
  return n * (60 / musicState.currentBpm);
}
