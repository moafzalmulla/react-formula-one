import './App.css';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import HeroImage from './images/hero-image.png';

const WrapperStyled = styled.div`
  color: black;
`;
const HeroArea = styled.div`
  height: 400px;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: url(${HeroImage});
`;

// I would normally use an ENV file for these end points and API keys below
const seasonsEndpoint = 'https://api-formula-1.p.rapidapi.com/seasons';
const teamsEndpoint = 'https://api-formula-1.p.rapidapi.com/rankings/teams?season=';
const driversEndpoint = 'https://api-formula-1.p.rapidapi.com/rankings/drivers?season=';

// Get all data function
async function getAllData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '8e2c7178e6msh09567fa617b4c31p198210jsn0ea234b20ee2',
      'X-RapidAPI-Host': 'api-formula-1.p.rapidapi.com'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return response.json(); // parses JSON response into native JavaScript objects
}
// Get all data by passing a parameter
async function getAllDataWithParameter(url = '', season = '') {
  // Default options are marked with *
  const response = await fetch(url + season, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '8e2c7178e6msh09567fa617b4c31p198210jsn0ea234b20ee2',
      'X-RapidAPI-Host': 'api-formula-1.p.rapidapi.com'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  return response.json(); // parses JSON response into native JavaScript objects
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple - tabpanel - ${index} `}
      aria-labelledby={`simple - tab - ${index} `}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
//Accessibility labelling
function a11yProps(index) {
  return {
    id: `simple - tab - ${index} `,
    'aria-controls': `simple - tabpanel - ${index} `,
  };
}

const TeamHeaders = [
  {
    field: 'id',
    headerName: 'Position',
    flex: 1,
  },
  {
    field: 'teamName',
    headerName: 'Team name',
    flex: 1,
  },
  {
    field: 'logo',
    headerName: 'Logo',
    flex: 1,
    renderCell: (params) => {
      return (
        <>
          <Avatar sx={{ width: 50, height: 50 }} src={params.value} />
        </>
      );
    }
  },
  {
    field: 'points',
    headerName: 'Points',
    flex: 1
  }
]

const DriverHeaders = [
  {
    field: 'id',
    headerName: 'Position',
    flex: 1,
  },
  {
    field: 'driverName',
    headerName: 'Driver name',
    flex: 1,
  },
  {
    field: 'image',
    headerName: 'Image',
    flex: 1,
    renderCell: (params) => {
      return (
        <>
          <Avatar sx={{ width: 50, height: 50 }} src={params.value} />
        </>
      );
    }
  },
  {
    field: 'number',
    headerName: 'Number',
    flex: 1,
  },
  {
    field: 'points',
    headerName: 'Points',
    flex: 1,
  }
]

function App() {
  const [currentSeason, setCurrentSeason] = useState(2012);
  const [seasons, setSeasons] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(false);
  const [apiLimit, setApiLimit] = useState();

  // TEAM: position, team name, logo and points. 
  // DRIVER: position, driver name, image, number and points. 

  const handleSwitch = (e) => {
    setChecked(e.target.checked);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentSeason(seasons[newValue])
  };

  useEffect(() => {
    setCurrentSeason(currentSeason);
    getAllData(seasonsEndpoint)
      .then((data) => {
        setSeasons(data.response);
      })
      .catch((err) => {
        setApiLimit({
          error: err.message
        })
        alert(apiLimit);
      })
    getAllDataWithParameter(driversEndpoint, currentSeason)
      .then((data) => {
        let theData = data.response;
        const rowsWithIdDrivers = theData.map((row) => {
          const { position, driver, points, season } = row;
          return { id: position, driverName: driver.name, image: driver.image, number: driver.number, points: points, season: season, minWidth: 250, flex: 1 };
        });
        setDrivers(rowsWithIdDrivers.filter((i) => i.season === currentSeason));
      }
      ).catch((err) => {
        setApiLimit({
          error: err.message
        })
        alert(apiLimit);
      })

    getAllDataWithParameter(teamsEndpoint, currentSeason)
      .then((data) => {
        let theData = data.response;
        const rowsWithIdTeams = theData.map((row) => {
          const { position, team, points, season } = row;
          return { id: position, teamName: team.name, logo: team.logo, points: points, season: season, minWidth: 250, flex: 1 };
        });
        setTeams(rowsWithIdTeams.filter((i) => i.season === currentSeason));
      }
      ).catch((err) => {
        setApiLimit({
          error: err.message
        })
        alert(apiLimit);
      })

  }, [currentSeason]);

  return (
    <div className="App">
      {
        <WrapperStyled sx={{ bgcolor: 'white' }}>
          <HeroArea />
          <Container maxWidth={'xl'}>
            <Box>
              <Typography variant="h4" variantMapping="h1" align="left" style={{ padding: '30px 0' }}>
                Seasons
            </Typography>
            </Box>
            <Box>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                {seasons && seasons.map((i, k) => (
                  <Tab key={k} label={i} {...a11yProps(0)}
                  />
                ))}
              </Tabs>
            </Box>
            <Box>
              {drivers.map((i, k) => (
                <TabPanel value={value} index={k} fullwidth>
                  <Box display="flex" justifyContent="flex-end" style={{ height: '80px' }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={checked}
                            onChange={handleSwitch}
                            inputProps={{ 'aria-label': 'controlled' }} />} label={checked ? 'Drivers' : 'Teams'}
                        style={{ align: 'right' }} />
                    </FormGroup>
                  </Box>
                  <Box
                    sx={{
                      height: '100vh',
                      width: '100%',
                      flexGrow: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <DataGrid
                      rows={checked ? (drivers && drivers) : (teams && teams)}
                      columns={checked ? DriverHeaders : TeamHeaders}
                      pageSize={15}
                      rowsPerPageOptions={[15]}
                      checkboxSelection
                      disableSelectionOnClick
                      padding={10}
                    />
                  </Box>
                </TabPanel>
              ))}
            </Box>
          </Container>
        </WrapperStyled>
      }
    </div >
  );
}

export default App;
