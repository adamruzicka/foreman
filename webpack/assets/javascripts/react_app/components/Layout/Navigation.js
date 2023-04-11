import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  Divider,
} from '@patternfly/react-core';
import { getCurrentPath } from './LayoutHelper';

const titleWithIcon = (title, iconClass) => (
  <div>
    <span className={classNames(iconClass, 'nav-title-icon')} />
    <span className="nav-title">{title}</span>
  </div>
);

const Navigation = ({ items, navigationActiveItem, setNavigationActiveItem }) => {
  const clearTimerRef = useRef();
  useEffect(
    () => () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    },
    []
  );

  const onMouseOver = index => {
    clearTimeout(clearTimerRef.current);
    if (navigationActiveItem !== index) {
      setNavigationActiveItem(index);
    }
  };

  const pathFragment = path => path.split('?')[0];
  const subItemToItemMap = {};

  items.forEach(item => {
    item.subItems.forEach(subItem => {
      if (!subItem.isDivider) {
        // don't keep the query parameters for the key
        subItemToItemMap[pathFragment(subItem.href)] = item.title;
      }
    });
  });

  const handleFlyout = (
    { key, target, stopPropagation, preventDefault },
    index
  ) => {
    if (key === ' ' || key === 'ArrowRight') {
      stopPropagation();
      preventDefault();
      if (navigationActiveItem !== index) {
        setNavigationActiveItem(index);
      }
    }

    if (key === 'Escape' || key === 'ArrowLeft') {
      setNavigationActiveItem(null);
    }
  };
  const groupedItems = items.map(({ subItems, ...rest }) => {
    const groups = [];
    let currIndex = 0;
    if (subItems.length) {
      if (subItems[0].isDivider) {
        groups.push({ title: subItems[0].title, groupItems: [] });
      } else {
        groups.push({ title: '', groupItems: [] });
      }
      subItems.forEach(sub => {
        if (sub.isDivider) {
          groups.push({ title: sub.title, groupItems: [] });
          currIndex++;
        } else {
          groups[currIndex].groupItems.push(sub);
        }
      });
    }
    return { ...rest, groups };
  });

  return (
    <Nav id="foreman-nav">
      <NavList>
        {groupedItems.map(({ title, iconClass, groups, className }, index) => (
          <NavExpandable
            title={titleWithIcon(title, iconClass)}
            groupId="nav-expandable-group-1"
            isActive={
              subItemToItemMap[pathFragment(getCurrentPath())] === title
            }
            key={index}
            className={classNames(
              className,
              navigationActiveItem === index && 'open-flyout'
            )}
            onMouseOver={() => onMouseOver(index)}
            onClick={() => onMouseOver(index)}
            onKeyDown={e => handleFlyout(e, index)}
            onFocus={() => {
              onMouseOver(index);
            }}
          >
            {groups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.title && groupIndex !== 0 && <Divider />}
                {group.groupItems.map(
                  ({
                    id,
                    title: subItemTitle,
                    className: subItemClassName,
                    href,
                    onClick,
                  }) => (
                    <NavItem
                      key={id}
                      className={subItemClassName}
                      id={id}
                      to={href}
                      onClick={onClick}
                    >
                      {subItemTitle}
                    </NavItem>
                  )
                )}
              </React.Fragment>
            ))}
          </NavExpandable>
        ))}
      </NavList>
    </Nav>
  );
};

Navigation.propTypes = {
  items: PropTypes.array.isRequired,
  navigationActiveItem: PropTypes.number,
  setNavigationActiveItem: PropTypes.func.isRequired,
};
Navigation.defaultProps = {
  navigationActiveItem: null,
};

export default Navigation;
