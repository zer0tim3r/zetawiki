import metadata from "../utils/metadata";

export async function getServerSideProps(context: any) {
  return {
    redirect: {
      destination: `/view/${encodeURIComponent(`${metadata.title}:대문`)}`,
      permanent: false,
    },
  }
}

export default function Main() {
  return (<></>);
}
