import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

let render, container;
beforeEach(() => {
  ({ render, container } = createContainer());
});

const expectToBeInputFieldOfTypeText = formElement => {
  expect(formElement).not.toBeNull();
  expect(formElement.tagName).toEqual('INPUT');
  expect(formElement.type).toEqual('text');
};

const itRendersAsATextBox = (fieldName) =>
  it('renders as a text box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(field(fieldName));
  });

const itIncludesTheExistingValue = (fieldName) =>
  it('includes the existing value', () => {
    render(<CustomerForm {...{ [fieldName]: 'value' }} />);
    expect(field(fieldName).value).toEqual('value');
  });

const itRendersALabel = (fieldName, value) =>
  it('renders a label', () => {
    render(<CustomerForm />);
    expect(labelFor(fieldName).textContent).toEqual(value);
  });

const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
  it('assigns an id that matches the label id', () => {
    render(<CustomerForm {...{ [fieldName]: 'value' }} />);
    expect(field(fieldName).id).toEqual(fieldName);
  });

const itSubmitsExistingValue = (fieldName, value) =>
  it('saves existing value when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
        firstName={fieldName}
        onSubmit={({ firstName }) =>
          expect(firstName).toEqual(value)
        }
      />
    );
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

const itSubmitsNewValue = (fieldName, value) =>
  it('saves new value when submitted', async () => {
    expect.hasAssertions();
    render(
      <CustomerForm
        {...{ [fieldName]: 'existingValue' }}
        onSubmit={props =>
          expect(props[fieldName]).toEqual(value)
        }
      />);
    await ReactTestUtils.Simulate.change(field(fieldName), {
      target: { value, name: fieldName }
    });
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

const form = id => container.querySelector(`form[id="${id}"]`);
const field = name => form('customer').elements[name];
const labelFor = formElement => container.querySelector(`label[for="${formElement}"]`);

describe('first name field', () => {
  itRendersAsATextBox('firstName');
  itIncludesTheExistingValue('firstName');
  itRendersALabel('firstName', 'First name');
  itAssignsAnIdThatMatchesTheLabelId('firstName');
  itSubmitsExistingValue('firstName', 'firstName');
  itSubmitsNewValue('firstName', 'anotherFirstName');
});

describe('last name field', () => {
  itRendersAsATextBox('lastName');
  itIncludesTheExistingValue('lastName');
  itRendersALabel('lastName', 'Last name');
  itAssignsAnIdThatMatchesTheLabelId('lastName');
  itSubmitsExistingValue('lastName', 'lastName');
  itSubmitsNewValue('lastName', 'anotherlastName');
})

describe('phone number field', () => {
  itRendersAsATextBox('phoneNumber');
  itIncludesTheExistingValue('phoneNumber');
  itRendersALabel('phoneNumber', 'Phone number');
  itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
  itSubmitsExistingValue('phoneNumber', 'phoneNumber');
  itSubmitsNewValue('phoneNumber', 'anotherphoneNumber');
})

it('has a submit button', () => {
  render(<CustomerForm />);
  const submitButton = container.querySelector(
    'input[type="submit"]'
  );
  expect(submitButton).not.toBeNull();
});