
export enum ViewState {
  HOME = 'HOME',
  PACKAGES = 'PACKAGES',
  SCRIPTS = 'SCRIPTS',
  GUIDES = 'GUIDES',
  TROUBLESHOOT = 'TROUBLESHOOT',
  ABOUT = 'ABOUT',
  AI_CHAT = 'AI_CHAT',
  ARCHITECT = 'ARCHITECT',
  HELP = 'HELP',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  category: 'Development' | 'System' | 'Network' | 'Utility';
  installCommand: string;
  notes?: string;
}

export interface ScriptItem {
  id: string;
  name: string;
  author: string;
  description: string;
  githubUrl: string;
  category: 'Phishing' | 'OSINT' | 'Exploit' | 'Utility' | 'Spam';
  installCommand: string;
  previewOutput: string;
  isRoot?: boolean;
}

export interface GuideStep {
  title: string;
  content: string;
  command?: string;
}

export interface GuideItem {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}

export interface ErrorItem {
  id: string;
  errorTitle: string;
  symptoms: string;
  solution: string;
  prevention?: string;
}
