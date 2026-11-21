import { describe, expect, it } from 'vitest';
import {
  findCustomerByEmail,
  mergeCustomerEdits,
  parseCustomerList,
  parseStoredCustomers,
  usedCustomerIds,
  type CustomerRecord
} from './customer-log';

function customer(row: Pick<CustomerRecord, 'id' | 'name'> & Partial<CustomerRecord>) {
  return {
    roastery: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: '',
    ...row
  };
}

describe('customer log', () => {
  it('keeps the contact details of each customer', () => {
    const result = parseCustomerList([
      {
        id: 'customer-1',
        name: ' Ada Lovelace ',
        roastery: ' Resistance Roastery ',
        email: ' ada@example.com ',
        phone: '+41 79 000 00 00',
        street: '12 Roastery Lane',
        postalCode: '1200',
        city: 'Geneva',
        country: 'Switzerland'
      }
    ]);

    expect(result).toEqual({
      ok: true,
      customers: [
        customer({
          id: 'customer-1',
          name: 'Ada Lovelace',
          roastery: 'Resistance Roastery',
          email: 'ada@example.com',
          phone: '+41 79 000 00 00',
          street: '12 Roastery Lane',
          postalCode: '1200',
          city: 'Geneva',
          country: 'Switzerland'
        })
      ]
    });
  });

  it('ignores a customer row that was added and left empty', () => {
    expect(parseCustomerList([{ id: 'customer-1', name: '  ', city: ' ' }])).toEqual({
      ok: true,
      customers: []
    });
  });

  it('asks for a name when a customer row has other details only', () => {
    expect(parseCustomerList([{ id: 'customer-1', name: '', city: 'Geneva' }])).toEqual({
      ok: false,
      message: 'Enter a name for each customer.'
    });
  });

  it('rejects a list that is not a list', () => {
    expect(parseCustomerList({ name: 'Ada' })).toEqual({
      ok: false,
      message: 'The customer list could not be read.'
    });
  });

  it('reads a saved customer list and refuses a file it does not understand', () => {
    expect(parseStoredCustomers([{ id: 'customer-1', name: 'Ada Lovelace' }])).toEqual([
      customer({ id: 'customer-1', name: 'Ada Lovelace' })
    ]);
    expect(() => parseStoredCustomers({ name: 'Ada' })).toThrow('Customer file is not a list.');
  });

  it('finds a customer by email, ignoring case and spaces', () => {
    const ada = customer({ id: 'customer-1', name: 'Ada', email: 'Ada@Example.com' });
    const grace = customer({ id: 'customer-2', name: 'Grace', email: 'grace@example.com' });

    expect(findCustomerByEmail([grace, ada], ' ada@example.COM ')).toBe(ada);
    expect(findCustomerByEmail([grace, ada], 'nobody@example.com')).toBeUndefined();
    expect(findCustomerByEmail([customer({ id: 'c', name: 'No email' })], '')).toBeUndefined();
  });

  it('keeps a customer who arrived while the page was open, and a removed row stays removed', () => {
    const ada = customer({ id: 'customer-1', name: 'Ada' });
    const grace = customer({ id: 'customer-2', name: 'Grace' });
    const katherine = customer({ id: 'customer-3', name: 'Katherine' });
    const edited = { ...ada, city: 'Geneva' };

    expect(mergeCustomerEdits([grace, ada], [edited], ['customer-1', 'customer-2'])).toEqual([
      edited
    ]);
    expect(mergeCustomerEdits([katherine, ada], [edited], ['customer-1'])).toEqual([
      katherine,
      edited
    ]);
  });

  it('lists the customers that samples and orders point to', () => {
    const used = usedCustomerIds([{ customerId: 'customer-1' }, { customerId: 'customer-2' }], {
      washed: { sales: [{ customerId: 'customer-2' }, { customerId: 'customer-3' }] }
    });

    expect([...used].sort()).toEqual(['customer-1', 'customer-2', 'customer-3']);
  });
});
