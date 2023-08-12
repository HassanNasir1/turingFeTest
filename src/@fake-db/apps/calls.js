// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

const now = new Date()
const currentMonth = now.toLocaleString('default', { month: 'short' })

const data = {
  invoices: [
    {
      id: 'C001',
      direction: 'inbound',
      from: '+1234567890',
      to: '+9876543210',
      duration: 180,
      is_archived: false,
      call_type: 'answered',
      via: '+1122334455',
      created_at: '2023-08-12T09:30:00Z',
      notes: []
    },
    {
      id: 'C002',
      direction: 'outbound',
      from: '+9876543210',
      to: '+1234567890',
      duration: 240,
      is_archived: false,
      call_type: 'missed',
      via: '+1122334455',
      created_at: '2023-08-12T10:45:00Z',
      notes: []
    },
    {
      id: 'C003',
      direction: 'inbound',
      from: '+5432109876',
      to: '+9876543210',
      duration: 120,
      is_archived: false,
      call_type: 'voicemail',
      via: '+1122334455',
      created_at: '2023-08-12T11:15:00Z',
      notes: []
    },
    {
      id: 'C004',
      direction: 'outbound',
      from: '+9876543210',
      to: '+5432109876',
      duration: 300,
      is_archived: true,
      call_type: 'answered',
      via: '+1122334455',
      created_at: '2023-08-12T12:30:00Z',
      notes: []
    },
    {
      id: 'C005',
      direction: 'inbound',
      from: '+9876543210',
      to: '+5555555555',
      duration: 150,
      is_archived: false,
      call_type: 'missed',
      via: '+1122334455',
      created_at: '2023-08-12T13:45:00Z',
      notes: []
    },
    {
      id: 'C006',
      direction: 'outbound',
      from: '+5555555555',
      to: '+9876543210',
      duration: 180,
      is_archived: true,
      call_type: 'answered',
      via: '+1122334455',
      created_at: '2023-08-12T14:15:00Z',
      notes: []
    },
    {
      id: 'C007',
      direction: 'inbound',
      from: '+9876543210',
      to: '+4444444444',
      duration: 90,
      is_archived: false,
      call_type: 'answered',
      via: '+1122334455',
      created_at: '2023-08-12T15:30:00Z',
      notes: []
    },
    {
      id: 'C008',
      direction: 'outbound',
      from: '+4444444444',
      to: '+9876543210',
      duration: 120,
      is_archived: false,
      call_type: 'voicemail',
      via: '+1122334455',
      created_at: '2023-08-12T16:45:00Z',
      notes: []
    },
    {
      id: 'C009',
      direction: 'inbound',
      from: '+9876543210',
      to: '+6666666666',
      duration: 210,
      is_archived: true,
      call_type: 'missed',
      via: '+1122334455',
      created_at: '2023-08-12T17:15:00Z',
      notes: []
    },
    {
      id: 'C010',
      direction: 'outbound',
      from: '+6666666666',
      to: '+9876543210',
      duration: 180,
      is_archived: true,
      call_type: 'answered',
      via: '+1122334455',
      created_at: '2023-08-12T18:30:00Z',
      notes: []
    }
  ]
}

// ------------------------------------------------
// GET: Return Invoice List
// ------------------------------------------------
mock.onGet('/apps/invoice/invoices').reply(config => {
  const { q = '', status = '', dates = [] } = config.params ?? '';
  const queryLowered = q.toLowerCase();

  let filteredData = data.invoices.filter(invoice => {
    if (dates.length) {
      const [start, end] = dates;
      const range = getDateRange(start, end);
      const invoiceDate = new Date(invoice.created_at);

      return (
        range.some(date => {
          const rangeDate = new Date(date);
          return (
            invoiceDate.getFullYear() === rangeDate.getFullYear() &&
            invoiceDate.getDate() === rangeDate.getDate() &&
            invoiceDate.getMonth() === rangeDate.getMonth()
          );
        }) &&
        (invoice.direction.toLowerCase().includes(queryLowered) ||
          invoice.from.toLowerCase().includes(queryLowered) ||
          invoice.to.toLowerCase().includes(queryLowered) ||
          String(invoice.duration).includes(queryLowered) ||
          invoice.call_type.toLowerCase().includes(queryLowered) ||
          invoice.via.toLowerCase().includes(queryLowered))
      );
    } else {
      return (
        invoice.direction.toLowerCase().includes(queryLowered) ||
        invoice.from.toLowerCase().includes(queryLowered) ||
        invoice.to.toLowerCase().includes(queryLowered) ||
        String(invoice.duration).includes(queryLowered) ||
        invoice.call_type.toLowerCase().includes(queryLowered) ||
        invoice.via.toLowerCase().includes(queryLowered)
      );
    }
  });

  if (status === 'Archived') {
    filteredData = filteredData.filter(invoice => invoice.is_archived);
  } else if (status === 'Unarchive') {
    filteredData = filteredData.filter(invoice => !invoice.is_archived);
  }

  return [
    200,
    {
      params: config.params,
      allData: data.invoices,
      invoices: filteredData,
      total: filteredData.length,
    },
  ];
});


// ------------------------------------------------
// GET: Return Single Invoice
// ------------------------------------------------
mock.onGet('apps/invoice/single-invoice').reply(config => {
  const { id } = config.params
  const invoiceData = data.invoices.filter(invoice => invoice.id === parseInt(id, 10))
  if (invoiceData.length) {
    const responseData = {
      invoice: invoiceData[0],
      paymentDetails: {
        totalDue: '$12,110.55',
        bankName: 'American Bank',
        country: 'United States',
        iban: 'ETD95476213874685',
        swiftCode: 'BR91905'
      }
    }

    return [200, responseData]
  } else {
    return [404, { message: 'Unable to find the requested invoice!' }]
  }
})

// ------------------------------------------------
// GET: Return Clients
// ------------------------------------------------
mock.onGet('/apps/invoice/clients').reply(() => {
  const clients = data.invoices.map(invoice => {
    const { address, company, companyEmail, country, contact, name } = invoice

    return {
      name,
      address,
      company,
      country,
      contact,
      companyEmail
    }
  })

  return [200, clients.slice(0, 5)]
})

// ------------------------------------------------
// DELETE: Deletes Invoice
// ------------------------------------------------
mock.onDelete('/apps/invoice/delete').reply(config => {
  // Get invoice id from URL
  const invoiceId = Number(config.data)
  const invoiceIndex = data.invoices.findIndex(t => t.id === invoiceId)
  data.invoices.splice(invoiceIndex, 1)

  return [200]
})
