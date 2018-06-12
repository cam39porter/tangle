import { UnsupportedUrnError } from "../../util/exceptions/unsupported-urn-error";
import { Urn } from "../../urn/urn";

function getLabel(urn: Urn): string {
  const label = urnTypeToLabel[urn.getType()];
  if (!label) {
    throw new UnsupportedUrnError(`${urn.toRaw()} is not supported`);
  }
  return label;
}

const urnTypeToLabel = {
  capture: "Capture",
  link: "Link",
  session: "Session",
  user: "User",
  tag: "Tag",
  entity: "Entity",
  evernoteNote: "EvernoteNote"
};

export { getLabel };
