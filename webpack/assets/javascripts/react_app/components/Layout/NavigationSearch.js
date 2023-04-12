import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from '@patternfly/react-core';

export const NavigationSearch = ({ items }) => {
  const navItems = [];
  const navLinks = {};
  items.forEach(item => {
    navItems.push(
      ...item.subItems
        .filter(({ isDivider }) => !isDivider)
        .map(group => group.title)
    );
    item.subItems
      .filter(({ isDivider }) => !isDivider)
      .forEach(group => {
        navLinks[group.title] = group.href;
      });
  });
  const menuNav = navItem => (
    <MenuItem to={navLinks[navItem]} itemId={navItem} key={navItem}>
      {navItem}
    </MenuItem>
  );
  const [value, setValue] = React.useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const onToggleExpand = (_event, _isExpanded) => {
    setIsExpanded(!_isExpanded);
    if (_isExpanded) {
      setIsAutocompleteOpen(false);
    }
  };
  const [autocompleteOptions, setAutocompleteOptions] = useState(
    navItems.slice(0, 10).map(menuNav)
  );

  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const onChange = newValue => {
    if (
      newValue !== '' &&
      searchInputRef &&
      searchInputRef.current &&
      searchInputRef.current.contains(document.activeElement)
    ) {
      setIsAutocompleteOpen(true);

      // When the value of the search input changes, build a list of no more than 10 autocomplete options.
      // Options which start with the search input value are listed first, followed by options which contain
      // the search input value.

      let options = navItems
        .filter(option => option.toLowerCase().includes(newValue.toLowerCase()))
        .map(menuNav);
      if (options.length > 10) {
        options = options.slice(0, 10);
      } else {
        options = [
          ...options,
          ...navItems
            .filter(
              option =>
                !option.includes(newValue.toLowerCase()) &&
                option.includes(newValue.toLowerCase())
            )
            .map(menuNav),
        ].slice(0, 10);
      }

      // The menu is hidden if there are no options
      setIsAutocompleteOpen(options.length > 0);

      setAutocompleteOptions(options);
    } else {
      setIsAutocompleteOpen(false);
    }
    setValue(newValue);
  };

  // Whenever an autocomplete option is selected, set the search input value, close the menu, and put the browser
  // focus back on the search input
  const onSelect = (e, itemId) => {
    e.stopPropagation();
    setValue(itemId);
    setIsAutocompleteOpen(false);
    searchInputRef.current.focus();
  };

  useEffect(() => {
    const handleMenuKeys = event => {
      // keyboard shortcut to focus the search, will not focus if the key is typed into an input
      if (
        event.key === '/' &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        searchInputRef.current.focus();
      }
      // if the autocomplete is open and the browser focus is on the search input,
      else if (isAutocompleteOpen && searchInputRef?.current === event.target) {
        // the escape key closes the autocomplete menu and keeps the focus on the search input.
        if (event.key === 'Escape') {
          setIsAutocompleteOpen(false);
          searchInputRef.current.focus();
          // the up and down arrow keys move browser focus into the autocomplete menu
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          const firstElement = autocompleteRef.current.querySelector(
            'li > button:not(:disabled)'
          );
          firstElement && firstElement.focus();
          event.preventDefault(); // by default, the up and down arrow keys scroll the window
        } else if (
          autocompleteRef?.current?.contains(event.target) &&
          event.key === 'Tab'
        ) {
          event.preventDefault();

          setIsAutocompleteOpen(false);
          searchInputRef.current.focus();
        }
      }
    };
    // The autocomplete menu should close if the user clicks outside the menu.
    const handleClickOutside = event => {
      if (
        isAutocompleteOpen &&
        autocompleteRef?.current &&
        !autocompleteRef.current.contains(event.target) &&
        searchInputRef?.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsAutocompleteOpen(false);
      }
    };
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isAutocompleteOpen]);

  const searchInput = (
    <SearchInput
      className="navigation-search"
      placeholder="Find by name"
      value={value}
      onChange={onChange}
      expandableInput={{
        isExpanded,
        onToggleExpand,
        toggleAriaLabel: 'Expandable search input toggle',
      }}
      ref={searchInputRef}
      id="navigation-search"
      onSearch={searchValue => {
        console.log('searching for: ', searchValue);
        console.log('navItems: ', navItems);
        console.log('navItems: ', navLinks);
        if (navItems.includes(searchValue)) {
          window.location.href = navLinks[searchValue];
        }
      }}
      onClick={e => {
        // if the user clicks on the search input, open the autocomplete menu
        if (e.target.type === 'text') setIsAutocompleteOpen(true);
      }}
    />
  );

  const autocomplete = (
    <Menu ref={autocompleteRef} onSelect={onSelect}>
      <MenuContent>
        <MenuList>{autocompleteOptions}</MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <Popper
      trigger={searchInput}
      popper={autocomplete}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
      // append the autocomplete menu to the search input in the DOM for the sake of the keyboard navigation experience
      appendTo={() => document.querySelector('#navigation-search')}
    />
  );
};
NavigationSearch.propTypes = {
  items: PropTypes.array.isRequired,
};
