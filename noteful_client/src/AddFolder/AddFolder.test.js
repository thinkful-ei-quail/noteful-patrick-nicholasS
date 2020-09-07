import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import AddFolder from './AddFolder'

describe(`AddFolder component`, () => {

  it('renders without crashing', () => {
    const wrapper = shallow(<AddFolder />)
    expect(toJson(wrapper)).toMatchSnapshot()
  });

})
