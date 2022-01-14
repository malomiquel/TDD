import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

const expectToBeInputFieldOfTypeText = formElement => {
  expect(formElement).not.toBeNull();
  expect(formElement.tagName).toEqual('INPUT');
  expect(formElement.type).toEqual('text');
};


describe('first name field', () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const firstNameField = () => form('customer').elements.firstName;
  const labelFor = formElement => container.querySelector(`label[for="${formElement}"]`);

  it('renders as a text box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(firstNameField())
  });

  it('includes the existing value', () => {
    render(<CustomerForm firstName="Ashley" />);
    expect(firstNameField().value).toEqual('Ashley');
  });


  it('renders a label', () => {
    render(<CustomerForm />);
    expect(labelFor('firstName').textContent).toEqual('First name');
  });

  it('assigns an id that matches the label id', () => {
    render(<CustomerForm />);
    expect(firstNameField().id).toEqual('firstName');
  });

  it('saves existing value when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) =>
          expect(firstName).toEqual('Ashley')
        }
      />
    );
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

  it('saves new value when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) =>
          expect(firstName).toEqual('Jamie')
        }
      />
    );
    await ReactTestUtils.Simulate.change(firstNameField(), {
      target: { value: 'Jamie' }
    });
    await ReactTestUtils.Simulate.submit(form('customer'));
  });


});
