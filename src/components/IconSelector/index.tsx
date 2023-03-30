import React from 'react';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const icons = [
  'icon-shezhi',
  'icon-user',
  'icon-shandian',
  'icon-shangchuan',
  'icon-shouye',
  'icon-tishi',
  'icon-weixin',
  'icon-xiazai',
  'icon-xiaoshi',
  'icon-yanchu',
  'icon-dianying',
  'icon-huati',
  'icon-lihe',
  'icon-network',
  'icon-travel',
  'icon-calculator',
  'icon-good',
  'icon-home',
  'icon-more',
  'icon-movie',
  'icon-picture',
  'icon-shop',
  'icon-wallet',
  'icon-zhibo',
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
          <i className={`iconfont ${icon}`} style={{ fontSize: '24px', margin: '8px', cursor: 'pointer' }}></i>
        </div>
      ))}
    </div>
  );
};

export default IconSelector;
