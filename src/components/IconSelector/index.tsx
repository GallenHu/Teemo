import React from 'react';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const icons = [
  'shezhi',
  'user',
  'shandian',
  'shangchuan',
  'shouye',
  'tishi',
  'weixin',
  'xiazai',
  'xiaoshi',
  'yanchu',
  'dianying',
  'huati',
  'lihe',
  'network',
  'travel',
  'calculator',
  'good',
  'home',
  'more',
  'movie',
  'picture',
  'shop',
  'wallet',
  'zhibo',
];

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect }) => {
  return (
    <div className="icon-selector-container">
      {icons.map(icon => (
        <div
          className={['icon-selector', selectedIcon === icon && 'active'].join(' ')}
          key={icon}
          onClick={() => onIconSelect(icon)}
        >
          <i className={`iconfont icon-${icon}`} style={{ fontSize: '24px', margin: '8px', cursor: 'pointer' }}></i>
        </div>
      ))}
    </div>
  );
};

export default IconSelector;
