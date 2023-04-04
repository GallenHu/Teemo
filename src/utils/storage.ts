import Configuration from '@/utils/configuration';

export class StorageUtils {
  private KEY_LOCAL_CONFIGURATION = 'teemo_configuration';
  private KEY_ENGINE = 'teemo_search_engine';

  getLocalConfiguration() {
    return localStorage.getItem(this.KEY_LOCAL_CONFIGURATION) || '';
  }

  getParsedLocalConfiguration() {
    const config = this.getLocalConfiguration();
    if (!config) return { data: null, error: 'Local Configuration Not Found.' };

    const { data, error } = Configuration.parseConfig(config);
    return { data, error };
  }

  setLocalConfiguration(configure: Configuration) {
    localStorage.setItem(this.KEY_LOCAL_CONFIGURATION, JSON.stringify(configure));
  }

  setSearchEngine(val: string) {
    localStorage.setItem(this.KEY_ENGINE, val);
  }
  getSearchEngine() {
    return localStorage.getItem(this.KEY_ENGINE);
  }
}

export default new StorageUtils();