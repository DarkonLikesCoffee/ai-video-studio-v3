import {mkdir, writeFile} from "node:fs/promises";
import {dirname} from "node:path";

// Compact 20-second stereo PCM ambient bed. Kept at 4 kHz / 8-bit to match
// the committed public/audio/ambient.wav asset and remain small in Git history.
const sampleRate = 4000;
const duration = 20;
const channels = 2;
const bitsPerSample = 8;
const frames = sampleRate * duration;
const bytesPerSample = bitsPerSample / 8;
const dataBytes = frames * channels * bytesPerSample;
const wav = Buffer.alloc(44 + dataBytes);

wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataBytes, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); // PCM
wav.writeUInt16LE(channels, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
wav.writeUInt16LE(channels * bytesPerSample, 32);
wav.writeUInt16LE(bitsPerSample, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataBytes, 40);

const clamp = (v) => Math.max(-1, Math.min(1, v));
const toU8 = (v) => Math.round((clamp(v) + 1) * 127.5);
let windL = 0;
let windR = 0;

for (let i = 0; i < frames; i++) {
  const t = i / sampleRate;
  const windNoiseL = Math.random() * 2 - 1;
  const windNoiseR = Math.random() * 2 - 1;
  windL = windL * 0.965 + windNoiseL * 0.035;
  windR = windR * 0.965 + windNoiseR * 0.035;

  const windPulse = 0.62 + 0.18 * (
    Math.sin(2 * Math.PI * 0.17 * t) +
    Math.sin(2 * Math.PI * 0.071 * t)
  ) * 0.5;
  const wind = (windL + windR) * 0.32 * windPulse;

  const drone = (
    Math.sin(2 * Math.PI * 55 * t) +
    0.46 * Math.sin(2 * Math.PI * 82.4 * t) +
    0.22 * Math.sin(2 * Math.PI * 110 * t)
  ) * 0.075;
  const pad = (
    Math.sin(2 * Math.PI * 174.6 * t) +
    0.5 * Math.sin(2 * Math.PI * 220 * t)
  ) * 0.018;

  // Subtle burner hiss swells during the opening lift-off, then fades away.
  const burnerEnvelope = Math.exp(-Math.pow((t - 3.15) / 1.05, 2)) * 0.15;
  const hissL = (Math.random() * 2 - 1) * burnerEnvelope;
  const hissR = (Math.random() * 2 - 1) * burnerEnvelope;

  const left = wind + drone + pad + hissL;
  const right = wind + drone * 0.97 + pad * 0.98 + hissR * 0.93;
  wav.writeUInt8(toU8(left), 44 + i * 2);
  wav.writeUInt8(toU8(right), 45 + i * 2);
}

const output = "public/audio/ambient.wav";
await mkdir(dirname(output), {recursive: true});
await writeFile(output, wav);
console.log(`Wrote ${output}: ${duration}s stereo PCM, ${sampleRate} Hz, ${bitsPerSample}-bit`);
