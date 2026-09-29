import { Stream } from "../base/base-stream";
import { Streams } from "../base/subjects";
import { Subjects } from "../base/subjects";

export class AssetStream extends Stream {
  name: Streams.Asset = Streams.Asset;

  subjects: Subjects[] = [Subjects.AssetCreated, Subjects.AssetUpdated];
}
