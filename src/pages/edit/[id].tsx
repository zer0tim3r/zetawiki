import { useRouter } from "next/router";
import styles from "../document.module.css";
import Layout from "../../components/layout";
import metadata from "../../utils/metadata";
import { getDocument } from "../../utils/axios";
import Editor from "./editor";

export async function getServerSideProps(context: any) {
  const title = context.query.id as string;

  if (title.trim() != title) {
    return {
      redirect: {
        destination: `/edit/${encodeURIComponent(title.trim())}`,
        permanent: true
      }
    };
  }

  const document = await getDocument(title, context.query._id ? { _id: context.query._id } : undefined);

  return {
    props: { metadata, document }, // will be passed to the page component as props
  }
}

export default function Main({ metadata, document }: { metadata: any, document: any }) {
  const router = useRouter();

  const title = router.query.id as string;

  return (
    <Layout metadata={metadata} title={title} context={document ? (1 << 3) | (1 << 4) : 0}>
      <h1 className={styles.docTitle}>{title} <span>{document ? `(편집)` : `(새 문서 생성)`}</span></h1>
      <br />
      <Editor title={title} initalContent={document ? document.content : ""} />
    </Layout>
  );
}
