import React from 'react';
import { Category } from '../../models/Configure';

const Sidebar = (props: { categories: Category[] }) => {
  return props.categories?.length ? (
    <section className="sites">
      {props.categories.map((cat) => (
        <div key={cat.uid} className="sites-section">
          <h2 className="category" id={`category_${cat.uid}`}>
            <span>{cat.alias}</span>
          </h2>
          <ul>
            {cat.sites.map((site) => (
              <li key={site.name}>
                <a href={site.url} target="_blank" rel="noopener noreferrer">
                  <img alt="icon" src={site.icon || ''} />
                  <span>
                    <span>{site.name}</span>
                    <p>{site.desc || site.name}</p>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  ) : null;
};

export default Sidebar;
