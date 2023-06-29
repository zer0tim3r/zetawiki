import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MonacoEditor, { Monaco } from "@monaco-editor/react";

import styles from "./editor.module.css";
import { putDocumentAPI } from "../../utils/axios";


export default function Editor({ title, initalContent }: { title: string, initalContent: string }) {
  const router = useRouter();

  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
  }

  function onSubmit(e: any) {
    if (!(e.target as HTMLButtonElement).disabled) {
      (async () => {
        (e.target as HTMLButtonElement).disabled = true;
        if (await putDocumentAPI(title, editorRef.current?.getValue()))
          router.push(`/view/${encodeURIComponent(title)}`);
        else {
          (e.target as HTMLButtonElement).disabled = false;
        }
      })();
    }
  }

  return (
    <>
      <div style={{
        padding: "inherit",
        border: "1px solid #adadad",
        marginBottom: "0.4rem"
      }}>
        <MonacoEditor height={"400px"} language="markdown"
          defaultValue={initalContent} onMount={handleEditorDidMount} />
      </div>
      <div className={styles.context}>
        <button onClick={onSubmit}>저장</button>
      </div>
    </>
  );
}