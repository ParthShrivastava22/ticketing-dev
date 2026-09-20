import { Publisher } from "@digitalassetps/common";
import { AssetCreatedEvent } from "@digitalassetps/common";
import { Subjects } from "@digitalassetps/common";

export class AssetCreatedPublisher extends Publisher<AssetCreatedEvent> {
  subject: Subjects.AssetCreated = Subjects.AssetCreated;
}
