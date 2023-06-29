import { useRouter } from "next/router";
import styles from "../document.module.css";
import Layout from "../../components/layout";
import metadata from "../../utils/metadata";
import { getDocument, moveDocumentAPI } from "../../utils/axios";

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

  const document = await getDocument(title);

  if (!document) {
    return {
      redirect: {
        destination: `/404`,
        permanent: true
      }
    };
  }

  return {
    props: { metadata, document }, // will be passed to the page component as props
  }
}

export default function Main({ metadata, document }: { metadata: any, document: any }) {
  const router = useRouter();

  const title = router.query.id as string;

  async function onSubmit(e: any) {
    e.preventDefault();

    if (window !== null) {

      const alertBox = window.document.querySelector("#alertBox") as HTMLDivElement;
      alertBox.style["display"] = "none";


      const target = window.document.querySelector("#name") as HTMLInputElement;

      if (target.value.trim() !== '') {
        const btn = window.document.querySelector("#submitBtn") as HTMLButtonElement;
        btn.disabled = true;

        if (await moveDocumentAPI(document._id, target.value.trim())) {
          router.replace(`/view/${encodeURIComponent(target.value.trim())}`);
        } else {
          alertBox.style["display"] = "block";
          btn.disabled = false;
        }

      }
    }
  }

  return (
    <Layout metadata={metadata} title={title} context={document ? (1 << 3) | (1 << 4) : 0}>
      <h1 className={styles.docTitle}>{title} <span>{`(이동)`}</span></h1>
      <br />

      <form className={styles.docMove} onSubmit={onSubmit}>
        <div className="alert alert-danger" id="alertBox" style={{ display: "none" }}>
          오류: 이미 동일한 이름의 문서가 존재하거나 사용할 수 없는 이름입니다.
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">변경할 문서 제목</label>
          <input type="text" className="form-control" id="name" placeholder="위키" />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" id="submitBtn" className="btn btn-primary">이동</button>
        </div>
      </form>
    </Layout>
  );
}
