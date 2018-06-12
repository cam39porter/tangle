import * as Draft from "draft-js";

// Create clean editor state
const cleanEditorState = (
  editorState: Draft.EditorState
): Draft.EditorState => {
  let contentState = editorState.getCurrentContent();
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();
  const allSelected = new Draft.SelectionState({
    anchorKey: firstBlock.getKey(),
    anchorOffset: 0,
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
    hasFocus: true
  });
  contentState = Draft.Modifier.removeRange(
    contentState,
    allSelected,
    "backward"
  );
  editorState = Draft.EditorState.push(
    editorState,
    contentState,
    "remove-range"
  );
  editorState = Draft.EditorState.forceSelection(
    editorState,
    contentState.getSelectionAfter()
  );

  return editorState;
};

export default {
  cleanEditorState
};
