export interface Experience {
  title: string;
  years: number;
}

export interface User {
  id?: number;
  name: string;
  age: number;
  email: string;
  skills: string[];
  experience: Experience[];
}
