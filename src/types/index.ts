export interface CounterWithCount {
  id: number;
  name: string;
  count: number;
  description: string;
  createdBy: string;
}

export interface Reason {
  id: number;
  name: string;
  count: number;
  counterId: number;
}
