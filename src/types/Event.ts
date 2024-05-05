
export interface Event {
  id: number;
  name: string;
  description: string;
  image: string;
  date: number;
  created_at: number;
}

export interface EventRequest extends Omit<Event, 'id' | 'created_at'> {}