import { Publisher, AssetCreatedEvent, Subjects } from "@digitalassetps/common";

export class AssetCreatedPublisher extends Publisher<AssetCreatedEvent> {
  subject: Subjects.AssetCreated = Subjects.AssetCreated;
}
