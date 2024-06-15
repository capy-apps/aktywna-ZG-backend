
export interface Event {
  id: number;
  name: string;
  description: string;
  image: ArrayBuffer;
  date: number;
  created_at: number;
}

export interface EventRequest extends Omit<Event, 'id' | 'created_at' | 'image'> {}