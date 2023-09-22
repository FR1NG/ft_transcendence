import { defineStore } from "pinia";
import axios from '@/plugins/axios'
import { AxiosResponse } from "axios";
import { useInvitationStore } from "./invitation";

type ThemeKey = 'classic' | 'AmongUs' | 'PacMan';

export const useGameStore = defineStore('game', {
  state: () => ({
    selectedTheme: 'classic',
    selectedMode: 'NORMAL',
    themeSelected: false,
    modeSelected: false,
    currentTheme: {
      backgroundColor: '#FFFFFF',
      paddleColor: '#FFFFFF',
      ballColor: '#0C134F',
      lineColor: '#FFFFFF',
      scoreColor: '#FFFFFF',
      backgroundImage: '../../public/images/game/plain-black-background.jpg',
      ballImage: '../../public/images/game/pngegg.png',
    },
    themes: {
      classic: {
        backgroundColor: '#FFFFFF',
        paddleColor: '#FFFFFF',
        ballColor: '#0C134F',
        lineColor: '#FFFFFF',
        scoreColor: '#FFFFFF',
        backgroundImage: '../../public/images/game/plain-black-background.jpg',
        ballImage: '../../public/images/game/pngegg.png',
      },
      AmongUs: {
        backgroundColor: '#1E1E1E',
        paddleColor: '#000000',
        ballColor: '#E94560',
        lineColor: '#DB022B',
        scoreColor: '#FFFFFF',
        backgroundImage: '../../public/images/game/amon.jpg',
        ballImage: '../../public/images/game/amongus.png',
      },
      PacMan: {
        backgroundColor: '#F5DEB3',
        paddleColor: '#172652',
        ballColor: '#FF4500',
        lineColor: '#FFFFFF',
        scoreColor: '#FFFFFF',
        backgroundImage: '../../public/images/game/PacMan.jpg',
        ballImage: "../../public/images/game/Original_PacMan.png",
      }
    },
  }),
  getters: {

  },
  actions: {
    setTheme(theme: ThemeKey) {
      this.selectedTheme = theme;
      this.themeSelected = true;
      this.currentTheme = this.themes[theme];
    },
    setMode(mode: string) {
      this.selectedMode = mode;
      this.modeSelected = true;
    },
  }// end of actions
})// end of store
