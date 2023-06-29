
import Link from "next/link";
import { useRouter } from "next/router";
import ReactMarkdown, { Components as MarkdownComponents } from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../document.module.css";
import Layout from "../../components/layout";
import metadata from "../../utils/metadata";
import { getDocument } from "../../utils/axios";

export async function getServerSideProps(context: any) {
  const title = context.query.id as string;

  if (title.trim() != title) {
    return {
      redirect: {
        destination: `/view/${encodeURIComponent(title.trim())}`,
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

  let headerNum = {
    "h1": 0,
    "h2": 0,
    "h3": 0,
    "h4": 0,
    "h5": 0,
    "h6": 0
  };

  const markdownComponents: MarkdownComponents = {
    h1: ({ level, ...props }) => {
      headerNum["h1"] += 1;
      return (<h1>{headerNum["h1"]}. {props.children}</h1>);
    },
    h2: ({ level, ...props }) => {
      headerNum["h2"] += 1;
      return (<h2>{headerNum["h1"]}-{headerNum["h2"]}. {props.children}</h2>);
    },
    h3: ({ level, ...props }) => {
      headerNum["h3"] += 1;
      return (<h3>{headerNum["h1"]}-{headerNum["h2"]}-{headerNum["h3"]}. {props.children}</h3>);
    },
    h4: ({ level, ...props }) => {
      headerNum["h4"] += 1;
      return (<h4>{headerNum["h1"]}-{headerNum["h2"]}-{headerNum["h3"]}-{headerNum["h4"]}. {props.children}</h4>);
    },
    h5: ({ level, ...props }) => {
      headerNum["h5"] += 1;
      return (<h5>{headerNum["h1"]}-{headerNum["h2"]}-{headerNum["h3"]}-{headerNum["h4"]}-{headerNum["h5"]}. {props.children}</h5>);
    },
    h6: ({ level, ...props }) => {
      headerNum["h6"] += 1;
      return (<h6>{headerNum["h1"]}-{headerNum["h2"]}-{headerNum["h3"]}-{headerNum["h4"]}-{headerNum["h5"]}-{headerNum["h6"]}. {props.children}</h6>);
    },
    a: ({ href, children, ...props }) => {
      return (<Link href={`${href}`}>{children}</Link>);
    }
  }

  if (document === null) {
    return (
      <Layout metadata={metadata} title={title} context={false}>
        <h1 className={styles.docTitle}>{title}</h1>
        해당 문서를 찾을 수 없습니다. <br />
        <Link href={`/edit/${encodeURIComponent(title)}`}>[새 문서 만들기]</Link>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata} title={title} context={(router.query._id ? (1 << 2) : (1 << 1) | (1 << 2))}>
      <h1 className={styles.docTitle}>{title} {(router.query._id && (<span>(r{router.query._id})</span>))}</h1>
      <p className={styles.timeStamp}>최근 수정 시각: {new Date(document.timestamp).toLocaleString("ko-KR")}</p>
      <ReactMarkdown className={styles.wrapper} components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {document.content}
      </ReactMarkdown>
    </Layout>
  );
}
