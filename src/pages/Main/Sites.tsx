import React, { useEffect, useState } from 'react';
import { tns } from 'tiny-slider/src/tiny-slider';
import { Category } from '../../models/Configure';
import { getSitesVisible, storeSitesVisible } from '../../helpers/Configure';
import 'tiny-slider/src/tiny-slider.scss';
import './Sites.scss';

interface Props {
  categories: Category[];
}

const Sites = (props: Props) => {
  const [sectionClassName, setSectionClassName] = useState('sites');
  const [visible, setVisible] = useState(false);

  document.addEventListener(
    'dblclick',
    () => {
      setVisible(!visible);
      storeSitesVisible(!visible);
    },
    true
  );

  useEffect(() => {
    const visible = getSitesVisible();
    setVisible(visible);
  }, []);

  useEffect(() => {
    tns({
      container: '.site-slider',
      items: 1,
      slideBy: 'page',
      autoplay: false,
      mouseDrag: true,
      controls: false,
      navPosition: 'bottom',
    });
    setSectionClassName('sites loaded');
  }, [props.categories]);

  return (
    <section
      className={sectionClassName}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className="slider-wrapper">
        <div className="site-slider">
          {props.categories?.map((category) => (
            <div className="site-slider-item" key={category.uid}>
              <div className="site-items-wrapper">
                {category.sites.map((site) => (
                  <div className="site-item" key={site.url}>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="site-item-inner"
                      title={site.desc}
                    >
                      <img src={site.icon} alt={site.name} />
                      <div>{site.name}</div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="category-name">&lt; {category.alias} &gt;</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sites;
