import {
  Card,
  Title,
  TabBar,
  Tab,
  Container,
  Paragraph,
  ResultList,
  ResultRow,
  Key,
  Value,
} from './colorimetric_styles'
import { useEffect, useState } from 'react'
import DataForm from '../waves/DataForm'
// import HigherWaves from '../waves/HigherWaves'
import localForage from 'localforage'
import {
  Grid,
  HR,
  LoadingWrapper,
  Spacer,
  Subtitle,
} from '../waves/waves_styles'
import { Button, CircularProgress, Fab } from '@material-ui/core'
import { BlurLinearOutlined, BlurOn } from '@material-ui/icons'
import { calcReduction } from '../waves/Calculations'

/**
 * Colorimetrics
 */
const Colorimetric = () => {
  /**
   * States
   */
  const [TabName, setTabName] = useState('lower')
  const [Loading, setLoading] = useState(false)
  const [Results, setResults] = useState([])

  /**
   * Setting state values in indexedDB
   */
  useEffect(() => {
    const setLocalData = async () => {
      const lower = await localForage.getItem('lower')
      const higher = await localForage.getItem('higher')

      if (!lower) {
        await localForage.setItem('lower', {
          posCtrls: [0, 0, 0],
          negCtrls: [0, 0, 0],
          params: [{ name: '', values: [0, 0, 0] }],
        })
      }

      if (!higher) {
        await localForage.setItem('higher', {
          posCtrls: [0, 0, 0],
          negCtrls: [0, 0, 0],
          params: [{ name: '', values: [0, 0, 0] }],
        })
      }

      setLoading(false)
    }

    setLocalData()
  }, [])

  /**
   * Render tabs
   */
  // const RenderTabs = () =>
  //   TabName === 'lower' ? <DataForm /> : <HigherWaves />

  /**
   * Render
   */
  if (Loading)
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    )

  /**
   * Render Results
   */
  const RenderResults = () =>
    Results.map(({ name, value }) => (
      <ResultRow>
        <Key>{name}:</Key>
        <Value>{value}</Value>
      </ResultRow>
    ))

  /**
   * Render
   */
  return (
    <>
      <Container>
        <Card>
          <Title>Alamar Blue Colorimetric Calculator</Title>
          <Paragraph>
            Use the two tabs below to input your data separated by lower
            wavelengths and higher wavelengths into the forms.
          </Paragraph>
          {/* <Divider /> */}

          <TabBar>
            <Tab
              onClick={() => setTabName('lower')}
              selected={TabName === 'lower'}
            >
              Lower Wavelength
            </Tab>

            <Tab
              onClick={() => setTabName('higher')}
              selected={TabName === 'higher'}
            >
              Higher Wavelength
            </Tab>
          </TabBar>

          {/* <RenderTabs /> */}
          <DataForm tabName={TabName} />

          <HR />
          <Subtitle>Calculations</Subtitle>

          <Spacer />

          <Grid cols={2} gap='2em'>
            <Fab
              variant='extended'
              size='small'
              color='primary'
              aria-label='add'
            >
              <BlurOn />
              Difference
            </Fab>

            <Button
              variant='outlined'
              size='small'
              color='primary'
              startIcon={<BlurLinearOutlined />}
              // onClick={calcReduction}
              onClick={async () => setResults(await calcReduction())}
            >
              Reduction
            </Button>
          </Grid>

          <Spacer />

          <HR />
          <Subtitle>Results</Subtitle>

          <Spacer />

          <ResultList>
            <RenderResults />
          </ResultList>

          <Spacer />
        </Card>
      </Container>
    </>
  )
}

export default Colorimetric
