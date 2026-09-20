import { Publisher, AssetUpdatedEvent, Subjects } from "@digitalassetps/common";

export class AssetUpdatedPublisher extends Publisher<AssetUpdatedEvent> {
  subject: Subjects.AssetUpdated = Subjects.AssetUpdated;
}
