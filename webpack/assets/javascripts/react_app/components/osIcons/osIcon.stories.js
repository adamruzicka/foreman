import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import OsIcon from './index';

storiesOf('OsIcon', module)
  .addDecorator(withKnobs)
  .add('without name or family', () => {
    return <OsIcon />;
  })
  .add('with unknown name and family', () => <OsIcon name="something" family="somefamily" />)
  .add('with known name and family', () => <OsIcon name={text("Name", "Fedora")} family={text("Family", "RedHat")} />)
