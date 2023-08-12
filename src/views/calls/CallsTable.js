// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/calls'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomTextField from 'src/@core/components/mui/text-field'
import ConfirmationModal from 'src/views/calls/confirmationModal'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

// ** Vars

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 90,
    headerName: '# ID',
    renderCell: ({ row }) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'call_type',
    headerName: 'Call Type',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.call_type}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 80,
    field: 'duration',
    headerName: 'Duration',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.duration} sec</Typography>
  },
  {
    flex: 0.34,
    minWidth: 145,
    field: 'created_at',
    headerName: 'Created Date',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.created_at}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'direction',
    headerName: 'Direction',
    renderCell: ({ row }) => <Typography sx={{ color: '#7367F0' }}>{row.direction}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 90,
    field: 'from',
    headerName: 'From',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.from}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 90,
    field: 'to',
    headerName: 'To',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.to}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 90,
    align: 'center',
    field: 'is_archived',
    headerName: 'Archived',
    renderCell: ({ row }) => (
      <Typography
        sx={{
          backgroundColor: row.is_archived ? '#B4DFB9' : '#FFD0D0', // Light green for archived, light red for unarchived
          color: row.is_archived ? '#386737' : '#842727', // Darker text color for better readability
          padding: '8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}
      >
        {row.is_archived ? 'Archived' : 'Unarchive'}
      </Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 90,
    field: 'via',
    headerName: 'Via',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.via}</Typography>
  }
  // {
  //   flex: 0.2,
  //   minWidth: 90,
  //   field: 'notes',
  //   headerName: 'Notes',
  //   renderCell: ({ row }) => (
  //     <Typography sx={{ color: 'text.secondary' }}>{row.notes && row.notes.length > 0 ? 'Yes' : 'No'}</Typography>
  //   )
  // }
]

const CallsTable = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [modalRow, setModalRow] = useState(null)
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 6 })

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.calls)
  console.log(store)
  useEffect(() => {
    dispatch(
      fetchData({
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value])


  const handleNote = row => {
    setOpen(true)
    setOpenModal(true)
    setModalRow(row)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            size='small'
            variant='contained'
            color='primary' // Set the color you prefer
            onClick={() => {
              handleNote(row)
            }}
          >
            Add Note
          </Button>
        </Box>
      )
    }
  ]

  const handleClose = () => {
    setOpenModal(false)
  }

  return (
    <Card>
      <CardContent
        sx={{ gap: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* <Button component={Link} variant='contained' href='/apps/invoice/add' startIcon={<Icon icon='tabler:plus' />}>
          Create Invoice
        </Button> */}
        <Box sx={{ gap: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomTextField value={value} placeholder='Search Call' onChange={e => setValue(e.target.value)} />
          <CustomTextField
            select
            sx={{ pr: 4, '& .MuiFilledInput-input.MuiSelect-select': { minWidth: '8rem !important' } }}
            SelectProps={{
              displayEmpty: true,
              value: statusValue,
              onChange: e => setStatusValue(e.target.value)
            }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='Archived'>Archived</MenuItem>
            <MenuItem value='Unarchive'>Unarchive</MenuItem>
          </CustomTextField>
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rowHeight={54}
        rows={store.data}
        columns={columns}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        pageSizeOptions={[6, 10, 25, 50]}
        onPaginationModelChange={setPaginationModel}
      />
      <ConfirmationModal
        open={openModal}
        handleClickOpen={handleNote}
        setOpen={setOpenModal}
        handleClose={handleClose}
        row={modalRow}
        title={'Add Notes'}
      />
    </Card>
  )
}

export default CallsTable
