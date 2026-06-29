// Lightweight in-session preference store (no backend).
// Controls whether the AI overview opens by default on case screens.
// Set from "My Profile" → "Keep AI Suggestion ON".
let aiDefaultOpen = false;
export function getAiDefaultOpen() { return aiDefaultOpen; }
export function setAiDefaultOpen(v) { aiDefaultOpen = !!v; }
