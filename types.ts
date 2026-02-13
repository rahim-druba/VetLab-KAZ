
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  education: string;
  image: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
