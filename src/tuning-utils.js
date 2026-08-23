const FLAT_NOTE_NAMES = {
  "C#": "D♭",
  "D#": "E♭",
  "F#": "G♭",
  "G#": "A♭",
  "A#": "B♭",
};

export function getGuitarStringNumber(index) {
  return 6 - index;
}

export function getDisplayedNoteName(note, preferFlats) {
  return preferFlats ? FLAT_NOTE_NAMES[note] || note : note;
}
