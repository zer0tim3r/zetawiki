import Link from "next/link";
import Layout from "../components/layout";
import styles from './document.module.css';
import metadata from "../utils/metadata";
import { getRecent } from "../utils/axios";

export async function getServerSideProps(context: any) {
  const RecentChanges = await getRecent();

  return {
    props: { metadata, RecentChanges }, // will be passed to the page component as props
  }
}

export default function Main({ metadata, RecentChanges }: { metadata: any, RecentChanges: any[] }) {
  return (
    <Layout metadata={metadata} title="최근 변경" context={false}>
      <h1 className={styles.docTitle}>최근 변경</h1>
      <table className={styles["styled-table"]}>
        <thead>
          <tr>
            {/* <th>작업</th> */}
            <th>항목</th>
            <th>작성자</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {
            (RecentChanges && RecentChanges.map((r, i) => (
              <tr key={i}>
                {/* <td>Dom</td> */}
                <td><Link href={`/view/${encodeURIComponent(r.title)}`}>{r.title}</Link></td>
                <td><Link href={`/contribution/${encodeURIComponent(r.author)}`}>{r.author}</Link></td>
                <td>{new Date(r.timestamp).toLocaleString("ko-KR")}</td>
              </tr>
            )))
          }
        </tbody>
      </table>
    </Layout>
  );
}
