import Link from "next/link";
import styles from './layout.module.css';
import Searchbar from './search-bar';

import { Nanum_Gothic } from "next/font/google";
import Head from "next/head";

const NanumGothic = Nanum_Gothic({
  weight: ["400", "700", "800"],
  subsets: ["latin"]
});

export default function PageLayout({
  metadata,
  title,
  children,
  context
}: {
  metadata: any
  title: string,
  children: React.ReactNode,
  timestamp?: Date,
  context: number | boolean,
}) {
  const getContext = (num: number | boolean) => {
    if (num === false) return (<></>)

    const bitField = num as number;

    return (
      <>
        {((bitField >> 0 & 1) == 1) && (<Link href={`/view/${encodeURIComponent(title)}`}>본문</Link>)}
        {((bitField >> 1 & 1) == 1) && (<Link href={`/edit/${encodeURIComponent(title)}`}>편집</Link>)}
        {((bitField >> 2 & 1) == 1) && (<Link href={`/history/${encodeURIComponent(title)}`}>역사</Link>)}
        {((bitField >> 3 & 1) == 1) && (<Link href={`/delete/${encodeURIComponent(title)}`}>삭제</Link>)}
        {((bitField >> 4 & 1) == 1) && (<Link href={`/move/${encodeURIComponent(title)}`}>이동</Link>)}
        {((bitField >> 5 & 1) == 1) && (<Link href={`/acl/${encodeURIComponent(title)}`}>ACL</Link>)}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${title} - ${metadata.title}`}</title>
      </Head>
      <div className={NanumGothic.className}>
        <div className={styles.navbar}>
          <Link href={`/view/${metadata.title}:${metadata['main-document']}`} className={[styles.logo].join(' ')}>
            <span className={["material-symbols-outlined", styles.icon].join(' ')}>description</span>
            <span>{metadata.title}</span>
          </Link>
          <Link href="/RecentChanges" className={styles.navlink}>
            <span className={["material-symbols-outlined", styles.icon].join(' ')}>explore</span>
            <span className={styles.linkName}>최근 변경</span>
          </Link>
          <Searchbar />
        </div>
        <div className={styles.content}>
          <div className={styles.context}>
            {getContext(context)}
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
