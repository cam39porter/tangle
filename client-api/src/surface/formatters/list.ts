import { ListItem } from "../models/list-item";
import { Relationship, Node } from "neo4j-driver/types/v1";
import { Capture } from "../../db/models/capture";
import { AnnotatedText } from "../models/annotated-text";
import { RecommendationReason } from "../models/recommendation-reason";
import { Annotation } from "../models/annotation";
import { Entity } from "../../db/models/entity";

export function buildList(
  paths: Array<[Capture, Relationship, Node, Relationship, Capture]>
): ListItem[] {
  const relatedCaptureMap = new Map();
  const rootCaptureMap = new Map();
  paths.forEach(path => {
    rootCaptureMap.set(path[0].id, path[0]);
    if (path[2] && path[2].labels[0] === "Capture") {
      const capture = path[2].properties as Capture;
      relatedCaptureMap.set(capture.id, capture);
    }
    if (path[4]) {
      relatedCaptureMap.set(path[4].id, path[4]);
    }
  });
  const tree = buildTree(paths);
  const listItems = [];
  tree.forEach((value, key) => {
    const relatedCaptures = formatRelatedListItems(
      value,
      rootCaptureMap,
      relatedCaptureMap
    );
    listItems.push(
      new ListItem(
        key,
        new AnnotatedText(rootCaptureMap.get(key).body, []),
        [],
        relatedCaptures
      )
    );
  });
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
    const reasons = value.map(element => {
      const rel = element[0];
      const node = element[1];
      if (rel.type === "PREVIOUS" || rel.type === "COMMENTED_ON") {
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
        annotations.push(new Annotation("HIGHLIGHT", start, end));
        return new RecommendationReason("SHARES_ENTITY", entity.name);
      } else if (node.labels[0] === "Tag") {
        return new RecommendationReason("SHARES_TAG", node.properties["name"]);
      } else {
        return new RecommendationReason("DEFAULT", null);
      }
    });
    if (!rootCaptureMap.has(key)) {
      listItems.push(
        new ListItem(
          key,
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
  paths
): Map<string, Map<string, Array<[Relationship, Node]>>> {
  const tree = new Map();
  paths.forEach(path => {
    const root = path[0];
    if (!tree.has(root.id)) {
      tree.set(root.id, new Map());
    }
    const relatedCaptureMap: Map<
      string,
      Array<[Relationship, Node]>
    > = tree.get(root.id);
    let reasons: Array<[Relationship, Node]> = null;
    let capture: Capture = null;
    if (
      path[2] &&
      path[2].labels[0] === "Capture" &&
      path[2].properties.id !== root.id
    ) {
      capture = path[2].properties as Capture;
    } else if (path[4] && path[4].id !== root.id) {
      capture = path[4];
    }
    if (capture) {
      reasons = relatedCaptureMap.get(capture.id);
      if (!reasons) {
        reasons = [];
      }
      if (capture.id !== root.id) {
        reasons.push([path[1], path[2]]);
        relatedCaptureMap.set(capture.id, reasons);
      }
    }
  });
  return tree;
}
