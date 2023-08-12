// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports

import CallsTable from 'src/views/calls/CallsTable'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const Home = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          <CallsTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home
