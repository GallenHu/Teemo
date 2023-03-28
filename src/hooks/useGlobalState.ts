import storage from '@/utils/storage';
import Configuration from '@/utils/configuration';
import { createGlobalState } from 'react-use';

const { data, error } = storage.getParsedLocalConfiguration();
const initConf = error ? new Configuration() : new Configuration(data);

// Only store configure to avoid unnecessary re-rendering,
// Do NOT store 'currentPageIndex' here.
export interface GlobalStateType {
  configuration: Configuration;
}

const useGlobalValue = createGlobalState<GlobalStateType>({ configuration: initConf });

export default useGlobalValue;
