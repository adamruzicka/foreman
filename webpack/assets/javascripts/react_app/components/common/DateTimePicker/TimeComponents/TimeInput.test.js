import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TimeInput from './TimeInput';

test('TimeInput is working properly', () => {
  const time = new Date('2019-01-04   14:22:31');
  const component = shallow(<TimeInput time={time} />);

  expect(toJson(component.render())).toMatchSnapshot();
});
test('TimeInput toggles view to hours', () => {
  const time = new Date('2019-01-04   14:22:31');
  const component = mount(<TimeInput time={time} />);
  component
    .find('.timepicker-hour')
    .first()
    .simulate('click');
  expect(toJson(component.render())).toMatchSnapshot();
});
test('TimeInput toggles view to minutes', () => {
  const time = new Date('2019-01-04   14:22:31');
  const component = mount(<TimeInput time={time} />);
  component
    .find('.timepicker-minute')
    .first()
    .simulate('click');
  expect(toJson(component.render())).toMatchSnapshot();
});
