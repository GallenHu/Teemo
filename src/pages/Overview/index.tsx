import Search from './Search';
import ScrollDown from './ScrollDown';
import HeWeather from '../../components/HeWeather';
import Time from './Time';
import Collection from './Collection';
import Configure from './Configure';
import styles from './index.module.css';
import { CategoryType, RemoteConfigure } from '../../types/remote-configure';
import GistUtils from '../../utils/GistUtils';

interface Props {
  config: CategoryType[];
  onRefresh?: (newConfig: CategoryType[]) => void;
}

export default function Overview(props: Props) {
  // const [config, setConfig] = useState([]);

  const handleRefreshConfigure = (rConfig: RemoteConfigure, scope: string) => {
    const content = GistUtils.parseRemoteData(rConfig) as any;
    const contentObj = JSON.parse(content);

    props.onRefresh && props.onRefresh(contentObj.user[scope]);
  };


  return (
    <div className={[styles.page, 'slide-section'].join(' ')}>
      <Time></Time>

      <div className={styles.searchWrap}>
        <Search></Search>
      </div>

      <Collection list={props.config || []}></Collection>

      <Configure onRefresh={handleRefreshConfigure}></Configure>
      <ScrollDown></ScrollDown>

      <HeWeather />
    </div>
  );
}
