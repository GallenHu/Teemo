import LinkGroup from "../../components/LinkGroup";
import { CategoryType } from '../../types/remote-configure';
import styles from './Collection.module.css';

interface Props {
  list: CategoryType[];
}

export interface SiteModel {
  name: string;
  icon: string;
  url: string;
}

const ICON_NUM_IN_ONE_LINE = 6;

export default function Collection(props: Props) {
  // top sites
  const sites = props.list?.length ? props.list[0].sites : [];
  const len = sites.length || 0;
  const extraClassName = len > ICON_NUM_IN_ONE_LINE ? styles.twoLine : styles.oneLine;

  return (
    <div className={[styles.collection, extraClassName].join(" ")}>
      <LinkGroup sites={sites}></LinkGroup>
    </div>
  );
}
