import { Stream } from "@digitalassetps/common";
import { Streams, Subjects } from "@digitalassetps/common";

export class AssetStream extends Stream {
  name: Streams.Asset = Streams.Asset;

  subjects: Subjects[] = [Subjects.AssetCreated];
}
