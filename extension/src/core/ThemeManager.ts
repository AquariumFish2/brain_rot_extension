import { StorageUtils } from '../utils/StorageUtils.js';

export const PALETTES: Record<string, any> = {
  obsidian: {
    name: 'Obsidian', swatch: '#c8a84b', dark: true,
    vars: {
      '--tf-bg': '#0f0f0f', '--tf-surface': '#111111', '--tf-hover': '#151209',
      '--tf-text': '#e8e4dc', '--tf-muted': '#3e3e3e', '--tf-ghost': '#232323',
      '--tf-accent': '#c8a84b', '--tf-accent2': '#dfc060',
      '--tf-accent-dim': 'rgba(200,168,75,0.15)',
      '--tf-line': '#1c1c1c', '--tf-grid': 'rgba(255,255,255,0.022)',
      '--tf-grad-end': '#000000',
    },
  },
  midnight: {
    name: 'Midnight', swatch: '#6c9fff', dark: true,
    vars: {
      '--tf-bg': '#0d0f1a', '--tf-surface': '#131628', '--tf-hover': '#161b30',
      '--tf-text': '#dde4f0', '--tf-muted': '#3a4060', '--tf-ghost': '#252840',
      '--tf-accent': '#6c9fff', '--tf-accent2': '#88b0ff',
      '--tf-accent-dim': 'rgba(108,159,255,0.15)',
      '--tf-line': '#1e2240', '--tf-grid': 'rgba(108,159,255,0.04)',
      '--tf-grad-end': '#060810',
    },
  },
  forest: {
    name: 'Forest', swatch: '#4db87a', dark: true,
    vars: {
      '--tf-bg': '#0c110e', '--tf-surface': '#111a12', '--tf-hover': '#141e15',
      '--tf-text': '#d4e8d8', '--tf-muted': '#2a4030', '--tf-ghost': '#1e3025',
      '--tf-accent': '#4db87a', '--tf-accent2': '#6acc90',
      '--tf-accent-dim': 'rgba(77,184,122,0.15)',
      '--tf-line': '#182820', '--tf-grid': 'rgba(77,184,122,0.04)',
      '--tf-grad-end': '#060a07',
    },
  },
  cream: {
    name: 'Cream', swatch: '#b8941f', dark: false,
    vars: {
      '--tf-bg': '#faf8f4', '--tf-surface': '#ffffff', '--tf-hover': '#fdf9f2',
      '--tf-text': '#1a1a1a', '--tf-muted': '#888888', '--tf-ghost': '#c0b8ac',
      '--tf-accent': '#b8941f', '--tf-accent2': '#c8a830',
      '--tf-accent-dim': 'rgba(184,148,31,0.15)',
      '--tf-line': '#e8e0d4', '--tf-grid': 'rgba(0,0,0,0.04)',
      '--tf-grad-end': '#ffffff',
    },
  },
  cloud: {
    name: 'Cloud', swatch: '#5b7cfa', dark: false,
    vars: {
      '--tf-bg': '#f5f7fa', '--tf-surface': '#ffffff', '--tf-hover': '#eef2ff',
      '--tf-text': '#1e2030', '--tf-muted': '#8090b0', '--tf-ghost': '#b8c4d8',
      '--tf-accent': '#5b7cfa', '--tf-accent2': '#7090ff',
      '--tf-accent-dim': 'rgba(91,124,250,0.15)',
      '--tf-line': '#dde3f0', '--tf-grid': 'rgba(91,124,250,0.04)',
      '--tf-grad-end': '#ffffff',
    },
  },
  rose: {
    name: 'Rose', swatch: '#c4604a', dark: false,
    vars: {
      '--tf-bg': '#fdf7f5', '--tf-surface': '#ffffff', '--tf-hover': '#fcf0ed',
      '--tf-text': '#2a1a18', '--tf-muted': '#9a7060', '--tf-ghost': '#c8b0a8',
      '--tf-accent': '#c4604a', '--tf-accent2': '#d4735a',
      '--tf-accent-dim': 'rgba(196,96,74,0.15)',
      '--tf-line': '#f0dcd8', '--tf-grid': 'rgba(196,96,74,0.1)',
      '--tf-grad-end': '#ffffff',
    },
  },
};

export class ThemeManager {
  private static instance: ThemeManager;

  private constructor() {}

  public static getInstance(): ThemeManager {
    if (!this.instance) this.instance = new ThemeManager();
    return this.instance;
  }

  public applyPalette(key: string): void {
    const p = PALETTES[key];
    const el = document.getElementById('tf-overlay');

    Object.entries(p.vars).forEach(([k, v]) => el!.style.setProperty(k, v as string));
    StorageUtils.savePalette(key);

    // Update UI elements if they exist
    const dot = document.getElementById('tf-themeBtnDot');
    const name = document.getElementById('tf-themeBtnName');
    if (dot) dot.style.background = p.swatch;
    if (name) name.textContent = p.name;

    // Update active state in dropdown
    el!.querySelectorAll('.theme-option').forEach(opt => {
      if (opt instanceof HTMLElement) {
        opt.classList.toggle('active', opt.dataset.palette === key);
      }
    });

    // Close dropdown
    const dd = document.getElementById('tf-themeDropdown');
    if (dd) dd.classList.remove('open');
  }

  public init(): void {
    const saved = StorageUtils.getSavedPalette();
    this.applyPalette(saved);
  }
}
