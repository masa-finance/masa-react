import React, { useCallback, useState } from 'react';
import { GalleryItem } from './GalleryItem';
import { Tab } from './Tab';
import { TabsInterface } from '../../../masa';

export interface GalleryProps {
  tabs: TabsInterface[];
  wrapperClassName: string;
}

export const Gallery = ({ tabs, wrapperClassName }: GalleryProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleActive = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  return (
    <article className="tabs-container">
      <header className="tabs-header">
        <nav className="tabs-wrapper">
          <ul className="tabs" data-active-tab={activeTab}>
            {tabs.map((tab, index) => (
              <li key={`list-header-tab-${tab.title}`}>
                <Tab
                  title={tab.title}
                  active={activeTab === index}
                  onClick={() => handleActive(index)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <section className={`tab-content ${wrapperClassName}`}>
        {tabs[activeTab].items.map((tab) => {
          return <GalleryItem {...tab} key={tab.name} />;
        })}
      </section>
    </article>
  );
};
