import { Site } from '../../types/remote-configure';
import styles from "./index.module.css";

interface Props {
  sites: Site[];
}

export default function LinkGroup(props: Props) {
  return (
    <ul className={styles.ul}>
      {props.sites.map((site) => {
        return (
          <li key={site.name} title={site.name}>
            <a className={styles.linkItem} href={site.url} rel="noreferrer" target="_blank">
              <span className={styles.iconWrap}>
                <img src={site.icon} alt={site.name} />
              </span>
              <span className={styles.linkName}>{site.name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
