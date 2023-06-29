import { ChangeEventHandler, EventHandler, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react';
import styles from './search-bar.module.css';
import { useRouter } from 'next/navigation';
import { queryDocumentAPI } from "../utils/axios";

export default function Searchbar({ }) {
  const router = useRouter();

  const [autoCompleteNames, setAutoComplete] = useState<String[]>([]);
  const [RecentChanges, setRecentChanges] = useState<String[]>([]);

  useEffect(() => {
    queryDocumentAPI("").then(r => {
      if (r !== null) setRecentChanges(r.map(({ title }: { title: string }) => title));
    })
  }, []);

  let editTime = new Date();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const content = encodeURIComponent((document.querySelector("#search") as HTMLInputElement).value);

    if (content.trim() != '') router.push(`/view/${content}`);
  }

  const onChange: ChangeEventHandler = (e) => {
    const content = (e.target as HTMLInputElement).value as string;

    if (content === "") return setAutoComplete(RecentChanges);
    else {
      editTime = new Date();
      let temp = editTime;

      setTimeout(() => {
        if (editTime == temp) {
          queryDocumentAPI(content).then(r => {
            if (r !== null) setAutoComplete(r.map(({ title }: { title: string }) => title));
          })
        }

      }, 50);

    }
  }

  const onBlur = () => {
    setTimeout(() => {
      setAutoComplete([]);
    }, 150);
  }

  return (
    <>
      <form className={styles["container-search"]} onSubmit={onSubmit}>
        <div>
          <input id="search" onFocus={() => setAutoComplete(RecentChanges)} onBlur={onBlur} onChange={onChange} />
          {
            (autoCompleteNames.length != 0 && (
              <div className={styles["container-autocomplete"]}>
                {
                  autoCompleteNames.map((n, i) => (
                    <div key={i} onClick={() => router.push(`/view/${n}`)}>{n}</div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <button type="submit"><span className="material-symbols-outlined">search</span></button>
      </form>
    </>
  )
}
