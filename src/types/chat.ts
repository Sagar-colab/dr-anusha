export type Role = 'user' | 'assistant';

export type Message = {
  role: Role;
  content: string;
};

export type Mood =
  | 'idle'
  | 'listening'
  | 'concerned'
  | 'gentle'
  | 'warm'
  | 'thoughtful';
