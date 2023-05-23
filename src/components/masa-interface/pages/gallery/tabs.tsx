import React, { useState } from 'react';

const Tab = ({ title, active, onClick }) => (
  <li className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
    {title}
  </li>
);

export const Tabs = ({ tabs, wrapperClassName, onAdd }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={'tabs-container'}>
      <div className={'tabs-header'}>
        <div className={'tabs-wrapper'}>
          <ul className={'tabs'} data-active-tab={activeTab}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                title={tab.title}
                active={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </ul>
        </div>
        <div className={'plus-button'} onClick={onAdd}>
          +
        </div>
      </div>
      <div className={`tab-content ${wrapperClassName}`}>
        {tabs[activeTab].content()}
      </div>
    </div>
  );
};
