import { ListItem } from "../models/list-item";
import { Relationship, Node } from "neo4j-driver/types/v1";
import { Capture } from "../../db/models/capture";
import { AnnotatedText } from "../models/annotated-text";
import { RecommendationReason } from "../models/recommendation-reason";
import { Annotation } from "../models/annotation";
import { Entity } from "../../db/models/entity";
import { Tag } from "../../db/models/Tag";
import { CaptureUrn } from "../../urn/capture-urn";
import { buildFromNeo } from "../../db/services/capture";

export function buildList(
  paths: Array<[Capture, Relationship, Node, Relationship, Capture]>,
  captureOrder: CaptureUrn[]
): ListItem[] {
  const relatedCaptureMap = new Map<string, Capture>();
  const rootCaptureMap = new Map<string, Capture>();
  paths.forEach(path => {
    rootCaptureMap.set(path[0].urn.getId(), path[0]);
    if (path[2] && path[2].labels[0] === "Capture") {
      const capture = buildFromNeo(path[2].properties);
      relatedCaptureMap.set(capture.urn.getId(), capture);
    }
    if (path[4]) {
      relatedCaptureMap.set(path[4].urn.getId(), path[4]);
    }
  });
  const tree = buildTree(paths);

  const listItems: ListItem[] = [];
  tree.forEach((value, key) => {
    const relatedCaptures = formatRelatedListItems(
      value,
      rootCaptureMap,
      relatedCaptureMap
    );
    listItems.push(
      new ListItem(
        new CaptureUrn(key).toRaw(),
        new AnnotatedText(rootCaptureMap.get(key).body, []),
        [],
        relatedCaptures
      )
    );
  });
  listItems.sort(
    (a, b) =>
      captureOrder.findIndex(urn => urn.toRaw() === a.id) -
      captureOrder.findIndex(urn => urn.toRaw() === b.id)
  );
  return listItems;
}

function formatRelatedListItems(
  relatedCaptures: Map<string, Array<[Relationship, Node]>>,
  rootCaptureMap: Map<string, Capture>,
  allRelatedCaptureMap: Map<string, Capture>
): ListItem[] {
  const listItems = [];
  relatedCaptures.forEach((value, key) => {
    const annotations = [];
    const capture = allRelatedCaptureMap.get(key);
    let skip = false;
    const reasons = value.map(element => {
      const rel = element[0];
      const node = element[1];
      if (rel.type === "PREVIOUS" || rel.type === "COMMENTED_ON") {
        return new RecommendationReason(rel.type, null);
      } else if (rel.type === "DISMISSED_RELATION") {
        skip = true;
        return new RecommendationReason(rel.type, null);
      } else if (rel.type === "INCLUDES") {
        if (node.labels[0] === "EvernoteNote") {
          return new RecommendationReason("SHARES_IMPORT_NOTE", null);
        } else if (node.labels[0] === "Session") {
          return new RecommendationReason("SHARES_SESSION", null);
        } else {
          return new RecommendationReason("DEFAULT", null);
        }
      } else if (node.labels[0] === "Entity") {
        const entity = node.properties as Entity;
        const start = capture.body.indexOf(entity.name);
        const end = start + entity.name.length;
        annotations.push(
          new Annotation("HIGHLIGHT", start, end, entity.urn.toRaw())
        );
        return new RecommendationReason("SHARES_ENTITY", entity.name);
      } else if (node.labels[0] === "Tag") {
        const tag = node.properties as Tag;
        const start = capture.body.indexOf(tag.name);
        const end = start + tag.name.length;
        annotations.push(
          new Annotation("HIGHLIGHT", start - 1, end, tag.urn.toRaw())
        );
        return new RecommendationReason("SHARES_TAG", node.properties["name"]);
      } else {
        return new RecommendationReason("DEFAULT", null);
      }
    });
    if (!rootCaptureMap.has(key) && !skip) {
      listItems.push(
        new ListItem(
          new CaptureUrn(key).toRaw(),
          // TODO add annotations
          new AnnotatedText(capture.body, annotations),
          reasons,
          []
        )
      );
    }
  });
  return listItems;
}

function buildTree(
  paths: Array<[Capture, Relationship, Node, Relationship, Capture]>
): Map<string, Map<string, Array<[Relationship, Node]>>> {
  const tree = new Map();
  paths.forEach(path => {
    const root = path[0];
    if (!tree.has(root.urn.getId())) {
      tree.set(root.urn.getId(), new Map());
    }
    const relatedCaptureMap: Map<
      string,
      Array<[Relationship, Node]>
    > = tree.get(root.urn.getId());
    let reasons: Array<[Relationship, Node]> = null;
    let capture: Capture = null;
    if (
      path[2] &&
      path[2].labels[0] === "Capture" &&
      CaptureUrn.fromRaw(path[2].properties["id"]).getId() !== root.urn.getId()
    ) {
      capture = buildFromNeo(path[2].properties);
    } else if (path[4] && path[4].urn.getId() !== root.urn.getId()) {
      capture = path[4];
    }
    if (capture) {
      reasons = relatedCaptureMap.get(capture.urn.getId());
      if (!reasons) {
        reasons = [];
      }
      if (capture.urn.getId() !== root.urn.getId()) {
        reasons.push([path[1], path[2]]);
        relatedCaptureMap.set(capture.urn.getId(), reasons);
      }
    }
  });
  return tree;
}
