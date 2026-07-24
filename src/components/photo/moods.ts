export interface MoodPalette {
  skyTop: string
  skyBottom: string
  sun: string
  sea: [string, string]
  land: [string, string]
  haze: string
}

export const MOODS = {
  dawn: {
    skyTop: '#ffb27a',
    skyBottom: '#ffe0c2',
    sun: '#ff7a59',
    sea: ['#4f9fb5', '#2f7d95'],
    land: ['#7a8f7d', '#4f6b58'],
    haze: 'rgba(255,255,255,.55)',
  },
  day: {
    skyTop: '#5fb6e8',
    skyBottom: '#c7e9f7',
    sun: '#fff2b8',
    sea: ['#2e93b8', '#186b8c'],
    land: ['#84a985', '#4d7256'],
    haze: 'rgba(255,255,255,.45)',
  },
  sunset: {
    skyTop: '#ff8a5c',
    skyBottom: '#ffd8a8',
    sun: '#ff5e62',
    sea: ['#3f7f9c', '#27556f'],
    land: ['#6d7f74', '#3f5750'],
    haze: 'rgba(255,214,170,.5)',
  },
  night: {
    skyTop: '#132b47',
    skyBottom: '#2f4f6f',
    sun: '#e9f0f7',
    sea: ['#1c3a56', '#122840'],
    land: ['#2b4054', '#1a2b3c'],
    haze: 'rgba(180,205,230,.25)',
  },
} satisfies Record<string, MoodPalette>

export type Mood = keyof typeof MOODS

/** 밤 분위기는 숙소 씬 전용 — 목록이 어두워지지 않도록 */
export const DAYTIME_MOODS: Mood[] = ['dawn', 'day', 'sunset', 'day']
