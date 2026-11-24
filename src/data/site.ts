import type { IconName } from '../lib/icons';

/**
 * Site-wide facts. Source: Marc's resume (2026-11) and public profiles.
 * Rule: never add a number, credential or claim that is not in a real source.
 * Never add the phone number.
 */

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly handle: string;
  readonly icon: Extract<IconName, 'github' | 'linkedin' | 'tryhackme'>;
}

export interface EvidenceRef {
  /** Short link text (the exhibit or evidence code). */
  readonly label: string;
  readonly href: string;
  /** What on that exhibit backs the claim. */
  readonly note: string;
}

export interface SkillGroup {
  readonly name: string;
  readonly items: readonly string[];
  /** Where on the file this discipline is evidenced. Group level only: never claim a tool-to-project link that is not real. */
  readonly sources: readonly EvidenceRef[];
}

export type TrainingState = 'complete' | 'in-progress' | 'attended';

/** Transcribed from the issued certificate PDF; nothing here is inferred. */
export interface Certificate {
  /** The certificate number printed on the PDF, when it has one. */
  readonly id?: string;
  /** ISO date of completion. */
  readonly issued: string;
  /** Course duration as printed. */
  readonly duration: string;
  /** Path under /public. The link renders only when the file exists at build time. */
  readonly file: string;
}

export interface TrainingItem {
  readonly name: string;
  readonly provider: string;
  readonly state: TrainingState;
  readonly year?: number;
  readonly certificate?: Certificate;
}

/** First professional role (Jr. Software Engineer, Solutions Resource, June 2019). */
const CAREER_START = { year: 2019, monthIndex: 5 } as const;

const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
] as const;

/** Whole years since the career start, computed at build time so copy never goes stale. */
export function yearsInPractice(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - CAREER_START.year) * 12 + (now.getMonth() - CAREER_START.monthIndex);
  return Math.floor(months / 12);
}

/** "seven" for 7; falls back to digits past twelve. */
function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

const years = numberWord(yearsInPractice());

function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const person = {
  name: 'Marc Francisco',
  fileNo: 'MF-0619',
  /** Honest title: a software engineer since 2019, moving into security (AppSec at work, SOC on TryHackMe). */
  roleLine: 'Software engineer moving into application security',
  base: 'Dubai, UAE',
  status: 'Open to application security and SOC roles',
  /** Exhibit A heading. Fact: at Ducon he secures the apps he builds. */
  headline: 'I secure the apps I ship.',
  /** Hero sentence: twelve words or fewer. */
  tagline: `${capitalise(years)} years writing production code, now hardening it against attack.`,
  /** Meta description: who, where, what, with SOC framed as training (it is not paid work). */
  summary: `Web developer in Dubai who builds and secures production web apps, and trains for SOC work on TryHackMe.`,
  /** Exhibit A body: two sentences, every claim from the resume. */
  profile: `At Ducon I secure the apps I build. After hours I train for SOC work on TryHackMe.`,
  historyHeadline: `${capitalise(years)} years in production code.`,
  pillars: [
    {
      name: 'Application security',
      body: 'Injection and upload defences, RBAC, rate limits, audited dependencies.',
    },
    {
      name: 'Security operations',
      body: 'TryHackMe training: SIEM triage, phishing analysis, Sysmon and event logs.',
    },
    {
      name: 'Five stacks shipped',
      body: 'Next.js, Angular, NestJS, Laravel and Spring, shipped through CI/CD.',
    },
  ],
} as const;

/**
 * Email is stored in parts and assembled client-side on request so it never
 * appears as a plain string in the HTML.
 */
/**
 * The downloadable resume: Marc chose the Application Security version. This must be a copy
 * WITHOUT the phone number. Originals live in the gitignored private/ folder and never ship.
 * The link renders only once this file exists in /public.
 */
export const resume = {
  file: '/assets/resumes/marc-francisco-application-security-resume.pdf',
  label: 'Download the resume',
} as const;

/** Facts Marc stated directly (2026-11-24), used where the content files cannot compute them. */
export const statedFacts = {
  /** Ducon: his own security audit covered all five company web apps. */
  appsAudited: 5,
} as const;

export const emailParts = { user: 'marcpfrancisco', domain: 'gmail.com' } as const;

export const socials: readonly SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/marcpfrancisco',
    handle: 'marcpfrancisco',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/marcpfrancisco',
    handle: 'marcpfrancisco',
    icon: 'linkedin',
  },
  {
    label: 'TryHackMe',
    href: 'https://tryhackme.com/p/Tripulante',
    handle: 'Tripulante',
    icon: 'tryhackme',
  },
];

export const skills: readonly SkillGroup[] = [
  {
    name: 'Security operations',
    items: [
      'SIEM triage and investigation',
      'Phishing analysis',
      'Windows event logs',
      'Sysmon',
      'Splunk',
      'Elasticsearch',
      'Log analysis',
    ],
    sources: [{ label: 'Exhibit D', href: '#exhibit-d', note: 'SOC Level 1 path' }],
  },
  {
    name: 'Security testing',
    items: [
      'Burp Suite',
      'Wireshark',
      'Nmap',
      'dirsearch',
      'Gobuster',
      'Fuzzing',
      'Kali Linux',
      'Web application testing',
      'Ghidra (introductory)',
    ],
    sources: [{ label: 'Exhibit D', href: '#exhibit-d', note: 'Jr Pentester path' }],
  },
  {
    name: 'Application security',
    items: [
      'OWASP Top 10',
      'SQL injection and XSS mitigation',
      'RBAC',
      'Session security',
      'Token expiration',
      'API rate limiting',
      'File upload validation',
      'Secrets handling',
      'Secure configuration',
      'Dependency auditing',
    ],
    sources: [
      { label: 'EV-01', href: '/projects/appsec-hardening', note: 'EV-01 AppSec hardening' },
      { label: 'Exhibit B', href: '#exhibit-b', note: 'Ducon' },
    ],
  },
  {
    name: 'Systems, cloud and DevOps',
    items: [
      'Linux',
      'Windows',
      'Docker',
      'AWS',
      'GitHub Actions',
      'GitLab CI',
      'CI/CD pipeline security',
      'Git',
    ],
    sources: [{ label: 'Exhibit B', href: '#exhibit-b', note: 'All three main roles' }],
  },
  {
    name: 'Development',
    items: [
      'JavaScript',
      'TypeScript',
      'Java',
      'Spring',
      'Node.js',
      'React',
      'Next.js',
      'Angular',
      'Laravel',
    ],
    sources: [
      { label: 'Exhibit C', href: '#exhibit-c', note: 'EV-02 to EV-05' },
      { label: 'Exhibit B', href: '#exhibit-b', note: 'every role' },
    ],
  },
];

export const training: readonly TrainingItem[] = [
  {
    name: 'Pre Security',
    provider: 'TryHackMe',
    state: 'complete',
    certificate: {
      id: 'THM-PBR2XQP2ZX',
      issued: '2026-08-30',
      duration: '19 h 10 min',
      file: '/assets/certificates/THM-PRESECURITY-30082026.pdf',
    },
  },
  {
    name: 'Cyber Security 101',
    provider: 'TryHackMe',
    state: 'complete',
    certificate: {
      id: 'THM-WFL8XDQHIO',
      issued: '2026-09-14',
      duration: '45 h 23 min',
      file: '/assets/certificates/THM-CYBERSEC101-14092026.pdf',
    },
  },
  {
    name: 'SOC Level 1',
    provider: 'TryHackMe',
    state: 'complete',
    certificate: {
      issued: '2026-11-03',
      duration: '65 h 29 min',
      file: '/assets/certificates/THM-SOCLVL1-03112026.pdf',
    },
  },
  { name: 'Junior Penetration Tester', provider: 'TryHackMe', state: 'in-progress' },
  { name: 'Hacker Holidays', provider: 'TryHackMe', state: 'complete', year: 2026 },
  { name: 'SHIELD: NXG', provider: 'ManageEngine, Dubai', state: 'attended', year: 2025 },
  { name: 'Cloud Practitioner course', provider: 'AWS', state: 'attended' },
  { name: 'Introduction to Cybersecurity', provider: 'Tech Academy', state: 'attended' },
];

export const education = {
  degree: 'BS Information Technology',
  school: 'STI Novaliches',
  place: 'Quezon City, Philippines',
  year: 2019,
} as const;

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Filipino', level: 'Native' },
] as const;
