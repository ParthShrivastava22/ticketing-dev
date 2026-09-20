import { Subjects } from "../base/subjects";

export interface AssetUpdatedEvent {
  subject: Subjects.AssetUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
