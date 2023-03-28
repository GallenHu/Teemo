import AutoSuggest from 'react-autosuggest';
import { StatefulPopover, TRIGGER_TYPE } from 'baseui/popover';
import { FormEvent, useState } from 'react';
import { getSuggestion } from '@/services/search';
import SearchIcon from 'baseui/icon/search';

class Suggestion {
  text = '';
  type: 'normal' | 'addition' = 'normal';
  additionText = '';
  additionUri = '';
  additionIcon = '';

  constructor(options: {
    type: 'normal' | 'addition';
    text: string;
    additionText?: string;
    additionUri?: string;
    additionIcon?: string;
  }) {
    this.text = options.text || '';
    this.type = options.type || 'normal';
    this.additionText = options.additionText || '';
    this.additionUri = options.additionUri || '';
    this.additionIcon = options.additionIcon || '';
  }
}

export default function SearchBox() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentEngine, setCurrentEngine] = useState('baidu');
  let submitting = false;

  const ENGINES: Record<string, string> = {
    baidu: 'https://www.baidu.com/s?wd=',
    google: 'https://www.google.com/search?newwindow=1&q=',
    bing: 'https://www.bing.com/search?q=',
  };
  const ADDITIONAL_ENGINES: Record<string, { uri: string; name: string; icon: string }> = {
    SOUGOU_TRANSLATE: {
      uri: 'https://fanyi.sogou.com/text?keyword=',
      name: '搜狗翻译',
      icon: 'https://s2.loli.net/2023/03/19/kRVfP6KQoGqaT78.png',
    },
  };

  const handleChangeEngine = (key: string, close: () => void) => {
    setCurrentEngine(key);
    close();
  };

  const renderEngineIcon = (type: string) => {
    return <div key={type} className={['engine-icon', type].join(' ')}></div>;
  };

  const renderEngineSelector = ({ close }: any) => {
    return (
      <div className="engine-selector">
        {Object.keys(ENGINES).map(key => {
          return (
            <div className="engine-selector-item" key={key} onClick={() => handleChangeEngine(key, close)}>
              {renderEngineIcon(key)}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * 渲染列表项
   * 高亮变化时会执行
   * @param suggestion
   */
  const renderSuggestion = (suggestion: Suggestion) => {
    return (
      <div className="suggestion-item">
        {suggestion.type === 'addition' ? (
          <>
            <span className="suggestion-icon" style={{ backgroundImage: `url(${suggestion.additionIcon})` }}></span>
            <span className="suggestion-content">{`${suggestion.additionText}${suggestion.text}`}</span>
          </>
        ) : (
          <>
            <SearchIcon className="suggestion-icon"></SearchIcon>
            <span className="suggestion-content">{suggestion.text}</span>
          </>
        )}
      </div>
    );
  };

  /**
   * 高亮选择项时告诉输入框录入什么值
   * @param suggestion
   */
  const getSuggestionValue = (suggestion: Suggestion) => {
    return suggestion.text;
  };

  /**
   * 需要更新 suggestions 时调用
   * @param suggestion
   */
  const onSuggestionsFetchRequested = async (suggestion: { value: string; reason: string }) => {
    if (suggestion.value) {
      const res = await getSuggestion(suggestion.value);

      const s = (res.s || []).map(text => new Suggestion({ type: 'normal', text }));
      Object.keys(ADDITIONAL_ENGINES).forEach(key => {
        s.push(
          new Suggestion({
            type: 'addition',
            text: suggestion.value,
            additionText: ADDITIONAL_ENGINES[key].name + '：',
            additionUri: ADDITIONAL_ENGINES[key].uri,
            additionIcon: ADDITIONAL_ENGINES[key].icon,
          })
        );
      });
      setSuggestions(s);
    }
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const shouldRenderSuggestions = (value: string) => {
    return !!value;
  };
  const submit = (event: any, data: { suggestion: Suggestion }) => {
    if (!submitting) {
      submitting = true;
      const { type, text, additionUri } = data.suggestion;

      if (type === 'normal') {
        window.open(`${ENGINES[currentEngine]}${text}`);
      }
      if (type === 'addition') {
        window.open(`${additionUri}${text}`);
      }

      setSuggestions([]);

      setTimeout(() => {
        submitting = false;
      }, 100);
    }
  };
  /**
   * 输入框配置
   */
  const inputProps = {
    placeholder: '搜索一下',
    value: inputValue,
    autoFocus: true,
    onChange: (event: FormEvent<HTMLElement>, { newValue }: any) => {
      // value 为 undefined 时将导致错误
      typeof newValue !== 'undefined' && setInputValue(newValue);
      if (newValue === '') {
        setSuggestions([]);
      }
    },
    onKeyDown: (event: any) => {
      const { keyCode } = event;
      const input = event.target;

      if (keyCode === 13 && input.value.length) {
        submit(event, { suggestion: new Suggestion({ type: 'normal', text: input.value.trim() }) });
        // setInputValue('');
      }

      event.stopPropagation();
    },
    onClick(e: any) {
      e.target.select();
    },
  };

  return (
    <div className="search-box">
      <div className="engine">
        <StatefulPopover
          triggerType={TRIGGER_TYPE.click}
          content={renderEngineSelector}
          placement={'bottom'}
          returnFocus
          autoFocus
        >
          {renderEngineIcon(currentEngine)}
        </StatefulPopover>
      </div>
      <div className="input-wrapper">
        <AutoSuggest
          getSuggestionValue={getSuggestionValue}
          suggestions={suggestions}
          renderSuggestion={renderSuggestion}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          shouldRenderSuggestions={shouldRenderSuggestions}
          onSuggestionSelected={submit}
          inputProps={inputProps}
        />
      </div>
    </div>
  );
}
