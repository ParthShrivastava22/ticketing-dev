import { Subjects } from "../base/subjects";

export interface AssetCreatedEvent {
  subject: Subjects.AssetCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
