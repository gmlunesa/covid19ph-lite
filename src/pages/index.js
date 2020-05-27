import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import SEO from "../components/seo";
import * as ENDPOINT from "../../lib/const";
import { toDateString } from "../../lib/util"
import { Grid, Loader, Table, Icon, Button } from "semantic-ui-react";
import classes from "../styles/styles.module.scss";
import CountUp from "react-countup";

const loader = <Loader active inline />
const IndexPage = () => {
  const [summary, setSummary] = useState({
    updated: null,
    confirmed: 0,
    deaths: 0,
    recovered: 0,
    activeCases: 0,
  })

  const [newData, setNewData] = useState({
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  });

  const [cityData, setCityData] = useState([])
  const [dailyData, setDailyData] = useState([])


  const [cityLoading, setCityLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      await axios
        .get(
          "https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=PH"
        )
        .then(({ data }) => {
          if (data && data.length > 0) {
            const currDate = new Date();
            const lastUpdated = currDate - new Date(data[0].lastUpdated);
            let date = Math.round(lastUpdated / 60000);

            if(date > 60) {
              date =  Math.round(date / 60).toString() + ' hour(s) ago';
            } else{
              date =  date.toString() + ' minute(s) ago';
            }

            setSummary({
              ...summary,
              activeCases: data[0].activeCases,
              confirmed: data[0].totalConfirmed,
              deaths: data[0].totalDeaths,
              recovered: data[0].totalRecovered,
              updated: date,
            })
          }
          setSummaryLoading(false)
        })
    }
    const fetchDaily = async () => {
      const date = new Date()
      var today = new Date();
      const lastDay = toDateString(
        new Date(date.getFullYear(), date.getMonth() + 1, date.getDay() +1)
      )
      await axios
        .get(
          `https://api.coronatracker.com/v3/analytics/trend/country?countryCode=PH&startDate=2020-01-23&endDate=${lastDay}`
        )
        .then(({ data }) => {
          if (date && data.length > 1) {
            const reverseData = data.reverse()
            setNewData({
              ...newData,
              newDeaths:
                reverseData[0].total_deaths - reverseData[1].total_deaths,
              newConfirmed:
                reverseData[0].total_confirmed - reverseData[1].total_confirmed,
              newRecovered:
                reverseData[0].total_recovered - reverseData[1].total_recovered
            })
          }
         
        })
    }
    const fetchDataByCity = async () => {
      await axios.get(ENDPOINT.BY_CITY_ENDPOINT).then(({ data }) => {
        setCityData(data.features)
        setCityLoading(false)
      })
    }
    fetchSummary()
    fetchDataByCity()
    fetchDaily()
  }, [])

  let byCityData = cityLoading ? (
    loader
  ) : (
    byCityData ?
    <Table striped inverted singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>City</Table.HeaderCell>
          <Table.HeaderCell>Number of Cases</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {cityData.map((city, i) => (
          <Table.Row key={i}>
            <Table.Cell>{city.attributes.residence}</Table.Cell>
            <Table.Cell>{city.attributes.value}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    
    : 'Information not available right now.'
  )

  let newActive = newData.newConfirmed - newData.newRecovered - newData.newDeaths;

  return (
    <Layout>
      <SEO
        title="COVID-19 Philippines"
        description="COVID-19 Status Summary"
      />
      <div className={classes.Container}>
        {/* Title */}
        <Grid textAlign="center" columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <h2 className={classes.Title}>
                COVID-19 Philippines Status
              </h2>
              <p>Information as of {summary.updated}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Grid
          doubling
          className={classes.Summary}
          textAlign="center"
          columns={4}>
          <Grid.Row>
            <Grid.Column className={classes.Confirmed}>
              <h2>
                <Icon name="stethoscope" size="small" />
                {summaryLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={summary.confirmed} />
                    <span className={classes.Added}>
                      (+
                      <CountUp end={newData.newConfirmed} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Confirmed</p>
            </Grid.Column>
            <Grid.Column className={classes.Active}>
              <h2>
                <Icon name="hospital outline" size="small" />
                {summaryLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={summary.activeCases} />
                    <span className={classes.Added}>
                      (+
                      <CountUp end={newActive} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Active</p>
            </Grid.Column>
            <Grid.Column className={classes.Deaths}>
              <h2>
                <Icon name="frown outline" size="small" />
                {summaryLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={summary.deaths} />
                    <span className={classes.Added}>
                      (+
                      <CountUp end={newData.newDeaths} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Deaths</p>
            </Grid.Column>
            <Grid.Column className={classes.Recovered}>
              <h2>
                <Icon name="thumbs up outline" size="small" />
                {summaryLoading ? (
                  loader
                ) : (
                  <>
                    <CountUp end={summary.recovered} />
                    <span className={classes.Added}>
                      (+
                      <CountUp end={newData.newRecovered} />)
                    </span>
                  </>
                )}
              </h2>
              <p>Recovered</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className={classes.Hotline}>
          <Grid stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={12}>
                <h3> Emergency hotlines</h3>
                <p>
                  If you are experiencing symptoms of COVID-19, or if you have experienced
                  close contact with a confirmed case, please call the DOH hotlines. Available 24/7.
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <a className={classes.Button} href="tel:1555">
                  <Button fluid primary>
                    <Icon name="phone" size="small" /> 1555 | Toll-free
                  </Button>
                </a>
                <a  className={classes.Button} href="tel:894-26843">
                  <Button fluid primary>
                    <Icon name="phone" size="small" />894-26843 | Landline
                  </Button>
                </a>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div>
          <br />
          <h3>Confirmed Cases by City</h3>
          <div className={classes.Table}> 
            {byCityData}
          </div>
        </div>
        
        <br/>
      </div>
    </Layout>
  )
}

export default IndexPage
