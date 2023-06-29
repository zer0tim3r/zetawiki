
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../document.module.css";
import Layout from "../../components/layout";
import metadata from "../../utils/metadata";
import { contributeUser } from "../../utils/axios";

export async function getServerSideProps(context: any) {
    const _UserId = context.query.id as string;

    if (_UserId.trim() != _UserId) {
        return {
            redirect: {
                destination: `/contribute/${encodeURIComponent(_UserId.trim())}`,
                permanent: true
            }
        };
    }

    const contributes = await contributeUser(_UserId);

    return {
        props: { metadata, contributes }, // will be passed to the page component as props
    }
}

export default function Main({ metadata, contributes }: { metadata: any, contributes: any }) {
    const router = useRouter();

    const title = router.query.id as string;

    return (
        <Layout metadata={metadata} title={`${title}`} context={false}>
            <h1 className={styles.docTitle}>{title} <span>(기여 목록)</span></h1>
            <ul className={styles.history}>
                {contributes && contributes.map((d: any, i: number) => {
                    return (
                        <li key={i}>
                            {new Date(d.timestamp).toLocaleString("ko-KR")} {d.title} (<Link href={`/view/${encodeURIComponent(d.title.trim())}?_id=${d.rev_id}`}><span>r{d.rev_id}</span></Link>)
                        </li>
                    )
                })}
            </ul>
        </Layout>
    );
}
