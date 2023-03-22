import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Nav,
  NavList,
  NavItem,
  MenuGroup,
  Divider,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Popper,
} from '@patternfly/react-core';
import { getCurrentPath } from './LayoutHelper';

const titleWithIcon = (title, iconClass) => (
  <div>
    <span className={classNames(iconClass, 'nav-title-icon')} />
    <span className="nav-title">{title}</span>
  </div>
);

const Navigation = ({ items, flyoutActiveItem, setFlyoutActiveItem }) => {
  const clearTimerRef = useRef();
  useEffect(
    () => () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    },
    []
  );
  const onDocumentClick = (event, triggerElement, popperElement) => {
    if (flyoutActiveItem !== null) {
      // check if we clicked within the popper, if so don't do anything
      const isChild = popperElement && popperElement.contains(event.target);
      if (!isChild) {
        setFlyoutActiveItem(null);
        // clicked outside the popper
      }
    }
  };
  const onPopperMouseLeave = (event, triggerElement, popperElement) => {
    if (flyoutActiveItem !== null) {
      // check if we clicked within the popper, if so don't do anything
      const isChild = popperElement && popperElement.contains(event.target);
      if (!isChild) {
        clearTimerRef.current = setTimeout(() => {
          setFlyoutActiveItem(null);
        }, 1000);
      }
    }
  };

  const onMouseOver = index => {
    clearTimeout(clearTimerRef.current);
    if (flyoutActiveItem !== index) {
      setFlyoutActiveItem(index);
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
      if (flyoutActiveItem !== index) {
        setFlyoutActiveItem(index);
      }
    }

    if (key === 'Escape' || key === 'ArrowLeft') {
      setFlyoutActiveItem(null);
    }
  };
  const withPopper = (trigger, popper, index) => (
    <Popper
      key={index}
      onDocumentClick={onDocumentClick}
      onPopperMouseEnter={() => clearTimeout(clearTimerRef.current)}
      onPopperMouseLeave={onPopperMouseLeave}
      trigger={trigger}
      popper={popper}
      placement="right-start"
      appendTo={document.body}
      isVisible={flyoutActiveItem === index}
      enableFlip
      flipBehavior={['right-start', 'right-end']}
    />
  );

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
        {groupedItems.map(({ title, iconClass, groups, className }, index) =>
          withPopper(
            <NavItem
              key={index}
              className={classNames(
                className,
                flyoutActiveItem === index && 'open-flyout'
              )}
              flyout={<div> </div>}
              itemId={index}
              isActive={
                subItemToItemMap[pathFragment(getCurrentPath())] === title
              }
            >
              <div
                onMouseOver={() => onMouseOver(index)}
                onClick={() => onMouseOver(index)}
                onKeyDown={e => handleFlyout(e, index)}
                onFocus={() => {
                  onMouseOver(index);
                }}
              >
                {titleWithIcon(title, iconClass)}
              </div>
            </NavItem>,
            <Menu isScrollable key={index} containsFlyout>
              <MenuContent className="foreman-nav-menu">
                <MenuList>
                  {groups.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      {group.title && groupIndex !== 0 && <Divider />}
                      <MenuGroup label={group.title} labelHeadingLevel="h3">
                        {group.groupItems.map(
                          ({
                            id,
                            title: subItemTitle,
                            className: subItemClassName,
                            href,
                            onClick,
                          }) => (
                            <MenuItem
                              key={id}
                              className={subItemClassName}
                              id={id}
                              to={href}
                              onClick={onClick}
                            >
                              {subItemTitle}
                            </MenuItem>
                          )
                        )}
                      </MenuGroup>
                    </React.Fragment>
                  ))}
                </MenuList>
              </MenuContent>
            </Menu>,
            index
          )
        )}
      </NavList>
    </Nav>
  );
};

Navigation.propTypes = {
  items: PropTypes.array.isRequired,
  flyoutActiveItem: PropTypes.number,
  setFlyoutActiveItem: PropTypes.func.isRequired,
};
Navigation.defaultProps = {
  flyoutActiveItem: null,
};

export default Navigation;
