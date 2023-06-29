
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../document.module.css";
import Layout from "../../components/layout";
import metadata from "../../utils/metadata";
import { historyDocument } from "../../utils/axios";

export async function getServerSideProps(context: any) {
  const title = context.query.id as string;

  if (title.trim() != title) {
    return {
      redirect: {
        destination: `/history/${encodeURIComponent(title.trim())}`,
        permanent: true
      }
    };
  }

  const history = await historyDocument(title);

  if (!history) {
    return {
      redirect: {
        destination: `/404`,
        permanent: true
      }
    };
  }

  return {
    props: { metadata, history }, // will be passed to the page component as props
  }
}

export default function Main({ metadata, history }: { metadata: any, history: any }) {
  const router = useRouter();

  const title = router.query.id as string;


  return (
    <Layout metadata={metadata} title={`${title}`} context={1 << 0}>
      <h1 className={styles.docTitle}>{title} <span>(역사)</span></h1>
      <ul className={styles.history}>
        {history && history.map((d: any, i: number) => {
          return (
            <li key={i}>
              {new Date(d.timestamp).toLocaleString("ko-KR")} (<Link href={`/view/${encodeURIComponent(title.trim())}?_id=${d.rev_id}`}>보기</Link> | <Link href={`/edit/${encodeURIComponent(title.trim())}?_id=${d.rev_id}`}>이 리비전으로 덮어쓰기</Link>) <span>r{d.rev_id}</span> <Link href={`/contribution/${d.author}`}>{d.author}</Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  );
}
