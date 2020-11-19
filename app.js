const country = document.querySelector('.country');
const population = document.querySelector('.population');
const cases = document.querySelector('.cases');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const input = document.querySelector('.input');
var enterCountry = document.getElementById('entercountry');
const button = document.getElementById('submit');
const button2 = document.getElementById('submitstate');
const covidData = document.querySelector('.covidData');
const body = document.querySelector('body');
const state = document.querySelector('.state');
const enterState = document.getElementById('enterstate');
const left = document.getElementById('left');
const right = document.getElementById('right');

const showChart = document.getElementById('showChart');
const canvasChart = document.getElementById('canvasChart');
const close = document.getElementById('x');
const canvasTitle = document.getElementById('canvasTitle');
var controller = new AbortController();
var red = 120;
var green = 0;
var blue = 0;
var date = new Date();
var day = date.getDate();
var month = date.getUTCMonth() + 1;
var year = date.getFullYear();
var isWhite = false;

var canvas = document.getElementById('myChart');
var ctx = document.getElementById('myChart').getContext('2d');

ctx.fillStyle = 'white';
canvas.width = 700;
canvas.height = 350;

console.log(canvas.width);

// function realDate(date) {
//   var test = date.split('');
//   var year = test.slice(0, 4);
//   var month = test.slice(5, 7);
//   var day = test.slice(8, 10);

//   year = year.join('').toString();
//   month = month.join('').toString();
//   day = day.join('').toString();

//   test = `${month}-${day}-${year}`;
//   return test;
// }

close.addEventListener('click', function () {
  canvasChart.classList.add('fadeOut');
  setTimeout(function () {
    canvasChart.style.display = 'none';
  }, 850);
});

button.addEventListener('click', function (e) {
  submit.disabled = true;
  if (
    enterCountry.value !== '' &&
    enterCountry.value.toLowerCase() !== 'usa' &&
    enterCountry.value.toLowerCase() !== 'united states' &&
    enterCountry.value.toLowerCase() !== 'united states of america'
  ) {
    // Get the country's 2 digit code for the flags
    input.classList.add('fadeOut');
    setTimeout(function () {
      input.style.display = 'none';
      state.style.display = 'none';
    }, 750);

    async function getCode() {
      let response = await fetch(
        `https://restcountries-v1.p.rapidapi.com/name/${enterCountry.value}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              '5f7daf8231mshe0f6a7f36012aa4p1a2ae1jsn91d66c35c706',
            'x-rapidapi-host': 'restcountries-v1.p.rapidapi.com',
          },
        }
      );
      let data = await response.json();
      data = JSON.stringify(data);
      data = JSON.parse(data);
      return data;
    }

    // Get the actual data

    async function getData() {
      let response = await fetch(
        `https://covid-193.p.rapidapi.com/history?country=${enterCountry.value}&day=${year}-${month}-${day}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              '5f7daf8231mshe0f6a7f36012aa4p1a2ae1jsn91d66c35c706',
            'x-rapidapi-host': 'covid-193.p.rapidapi.com',
          },
        }
      );
      let data = await response.json();
      data = JSON.stringify(data);
      data = JSON.parse(data);
      return data;
    }

    // Get country data for chart

    async function getChartData() {
      let response = await fetch(
        `https://coronavirus-map.p.rapidapi.com/v1/spots/year?region=${enterCountry.value}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              '5f7daf8231mshe0f6a7f36012aa4p1a2ae1jsn91d66c35c706',
            'x-rapidapi-host': 'coronavirus-map.p.rapidapi.com',
          },
        }
      );
      let data = await response.json();
      data = JSON.stringify(data);
      data = JSON.parse(data);
      return data;
    }

    // Populate page with data
    async function logData() {
      var collect = await getData();
      var code = await getCode();
      var chartData = await getChartData();
      console.log(collect);
      console.log(code);
      chartData = Object.entries(chartData.data);
      console.log(chartData[chartData.length - 1][0]);

      if (collect.results == '0' || code.message == 'Not Found') {
        alert(
          `Sorry, we couldn't find results for ${enterCountry.value.toUpperCase()}. Please try another country.`
        );
      }
      if (
        enterCountry.value.toLowerCase() === 'usa' ||
        enterCountry.value.toLowerCase() === 'united states' ||
        enterCountry.value.toLowerCase() === 'united states of america'
      ) {
        country.innerHTML = `<h1><span><img src="https://gds.baguette.engineering/flags/us.png" id="leftpic"></span>   ${collect.parameters.country.toUpperCase()} <span><img src="https://gds.baguette.engineering/flags/us.png" id="rightpic"></span>  </h1>`;
      } else {
        country.innerHTML = `<h1><span><img src="https://gds.baguette.engineering/flags/${code[0].alpha2Code.toLowerCase()}.png" id="leftpic"></span>   ${collect.parameters.country.toUpperCase()} <span><img src="https://gds.baguette.engineering/flags/${code[0].alpha2Code.toLowerCase()}.png" id="rightpic"></span>  </h1>`;
      }

      population.innerHTML = `<h2>POPULATION: ${collect.response[0].population}</h2>`;
      cases.innerHTML = `<h2>ACTIVE CASES: ${collect.response[0].cases.active}</h2> <span><h3>(Critical: ${collect.response[0].cases.critical})</h3></span>`;
      deaths.innerHTML = `<h2>DEATHS: ${collect.response[0].deaths.total}</h2> <span><h3>(New: ${collect.response[0].deaths.new})</h3></span>`;
      recovered.innerHTML = `<h2>RECOVERED: ${collect.response[0].cases.recovered}</h2>`;
      setTimeout(function () {
        covidData.classList.add('fadeIn');
        enterCountry.value = '';

        covidData.style.display = 'block';
      }, 250);
      canvasTitle.innerHTML = `COVID STATS FOR ${code[0].name.toUpperCase()}`;
      console.log(chartData[chartData.length - 1][1].deaths);
      console.log(chartData);

      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: [
            `${realDate(chartData[17][0])}`,
            `${realDate(chartData[14][0])}`,
            `${realDate(chartData[11][0])}`,
            `${realDate(chartData[8][0])}`,
            `${realDate(chartData[5][0])}`,
            `${realDate(chartData[2][0])}`,
            `${realDate(chartData[0][0])}`,
          ],
          datasets: [
            {
              label: 'COVID Deaths',
              backgroundColor: 'rgba(255, 0, 0, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                chartData[17][1].deaths,
                chartData[14][1].deaths,
                chartData[11][1].deaths,
                chartData[8][1].deaths,
                chartData[5][1].deaths,
                chartData[2][1].deaths,
                chartData[0][1].deaths,
              ],
            },
            {
              label: 'COVID Recovered',
              backgroundColor: 'rgba(0, 255, 0, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                0,
                chartData[14][1].recovered,
                chartData[11][1].recovered,
                chartData[8][1].recovered,
                chartData[5][1].recovered,
                chartData[2][1].recovered,
                chartData[0][1].recovered,
              ],
            },
            {
              label: 'Total Cases',
              backgroundColor: 'rgba(0, 0, 255, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                chartData[17][1].total_cases,
                chartData[14][1].total_cases,
                chartData[11][1].total_cases,
                chartData[8][1].total_cases,
                chartData[5][1].total_cases,
                chartData[2][1].total_cases,
                chartData[0][1].total_cases,
              ],
            },
          ],
        },

        // Configuration options go here
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tickMarkLength: 50,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
      });

      left.addEventListener('click', function () {
        chart.destroy();
      });
      right.addEventListener('click', function () {
        chart.destroy();
      });

      showChart.addEventListener('click', function () {
        canvasChart.classList.remove('fadeOut');
        canvasChart.classList.add('fadeIn');

        setTimeout(function () {
          canvasChart.style.display = 'block';
        }, 850);
      });
    }

    logData();
  } else if (
    enterCountry.value.toLowerCase() === 'usa' ||
    enterCountry.value.toLowerCase() === 'united states' ||
    enterCountry.value.toLowerCase() === 'united states of america'
  ) {
    enterCountry.value = 'usa';
    state.style.display = 'block';
  } else {
    alert('Please enter a country');
  }
  e.preventDefault();
});

submitstate.addEventListener('click', function (e) {
  if (enterState.value.length > 2) {
    alert('Please enter 2 digit state code. (Ex: MA, PA, FL, etc...)');
    e.preventDefault();
  } else {
    submitstate.disabled = true;
    state.classList.add('fadeOut');
    input.classList.add('fadeOut');
    setTimeout(function () {
      input.style.display = 'none';
      state.style.display = 'none';
    }, 750);
    // Get state data
    async function getState() {
      let response = await fetch(
        `https://api.covidtracking.com/v1/states/${enterState.value}/current.json`,
        {
          method: 'GET',
        }
      );
      let data = await response.json();
      data = JSON.stringify(data);
      data = JSON.parse(data);
      return data;
    }

    async function getStateHistory() {
      let response = await fetch(
        `https://api.covidtracking.com/v1/states/${enterState.value}/daily.json`,
        {
          method: 'GET',
        }
      );
      let data = await response.json();
      data = JSON.stringify(data);
      data = JSON.parse(data);
      return data;
    }

    // Do stuff with State
    async function populateState() {
      var info = await getState();
      var history = await getStateHistory();

      if (info.recovered == null) {
        info.recovered = 'N/A';
      }

      country.innerHTML = `<h1><span><img src="https://gds.baguette.engineering/flags/us.png" id="leftpic"></span>   ${info.state.toUpperCase()} <span><img src="https://gds.baguette.engineering/flags/us.png" id="rightpic"></span>  </h1>`;
      population.innerHTML = `<h2>TOTAL TESTS: ${history[0].totalTestResults}</h2>`;
      cases.innerHTML = `<h2>ACTIVE CASES: ${
        info.positive
      }</h2> <span><h3>(Critical: ${
        info.onVentilatorCurrently + info.inIcuCurrently
      })</h3></span>`;
      deaths.innerHTML = `<h2>DEATHS: ${info.death}</h2> <span><h3>(New: ${info.deathIncrease})</h3></span>`;
      recovered.innerHTML = `<h2>RECOVERED: ${info.recovered}</h2>`;
      setTimeout(function () {
        covidData.classList.add('fadeIn');
        covidData.style.display = 'block';
        canvasTitle.innerHTML = `COVID STATS FOR ${info.state.toUpperCase()}`;
      }, 850);
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: [
            `${history[240].date}`,
            `${history[200].date}`,
            `${history[160].date}`,
            `${history[120].date}`,
            `${history[80].date}`,
            `${history[40].date}`,
            `${history[0].date}`,
          ],
          datasets: [
            {
              label: 'COVID Deaths',
              backgroundColor: 'rgba(255, 0, 0, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                history[240].death,
                history[200].death,
                history[160].death,
                history[120].death,
                history[80].death,
                history[40].death,
                history[0].death,
              ],
            },
            {
              label: 'COVID Recovered',
              backgroundColor: 'rgba(0, 255, 0, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                0,
                history[200].recovered,
                history[160].recovered,
                history[120].recovered,
                history[80].recovered,
                history[40].recovered,
                history[0].recovered,
              ],
            },
            {
              label: 'Total Cases',
              backgroundColor: 'rgba(0, 0, 255, 0.50)',
              borderColor: 'rgb(0, 0, 0)',

              data: [
                history[240].positive,
                history[200].positive,
                history[160].positive,
                history[120].positive,
                history[80].positive,
                history[40].positive,
                history[0].positive,
              ],
            },
          ],
        },

        // Configuration options go here
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tickMarkLength: 50,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
      });
      left.addEventListener('click', function () {
        chart.destroy();
      });
      right.addEventListener('click', function () {
        chart.destroy();
      });
    }

    showChart.addEventListener('click', function () {
      canvasChart.classList.remove('fadeOut');
      canvasChart.classList.add('fadeIn');

      setTimeout(function () {
        canvasChart.style.display = 'block';
      }, 850);
    });
    populateState();

    e.preventDefault();
  }
});

async function getMapQuest() {
  let response = await fetch(
    'https://www.mapquestapi.com/search/v4/place?location=-71.3664015%2C%2041.8590784&sort=distance&feedback=false&key=z0uZWXKAua1VdNQ2jjkf4xGG7ePGkcbv&q=covid%20testing'
  );
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
}

async function mapQuest() {
  let data = await getMapQuest();

  console.log(data);
}

left.addEventListener('click', function () {
  covidData.classList.remove('fadeIn');
  covidData.classList.add('fadeOut');
  setTimeout(function () {
    covidData.style.display = 'none';
    input.style.display = 'block';
    enterCountry.value = '';
    enterState.value = '';
    submit.disabled = false;
    input.classList.remove('fadeOut');
    covidData.classList.remove('fadeOut');
  }, 700);
});

right.addEventListener('click', function () {
  covidData.classList.remove('fadeIn');
  covidData.classList.add('fadeOut');
  setTimeout(function () {
    covidData.style.display = 'none';
    enterState.value = '';
    state.style.display = 'block';
    submitstate.disabled = false;
    input.classList.remove('fadeOut');
    state.classList.remove('fadeOut');
    covidData.classList.remove('fadeOut');
  }, 700);
});
mapQuest();
function success(pos) {
  var crd = pos.coords;
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
window.navigator.geolocation.getCurrentPosition(success, error);

setInterval(function () {
  if (red === 120) {
    isWhite = false;
  } else if (red === 255) {
    isWhite = true;
  }

  if (isWhite === false) {
    red++;
  } else if (isWhite === true) {
    red--;
  }

  deaths.style = `background: linear-gradient(0deg, rgba(${red}, 0, 0, 0.75), rgba(${red}, 0, 0, 0.95)),
  url('./covid.jpg') no-repeat center center fixed`;
}, 7);

function realDate(when) {
  let test = when.split('');
  let year = test.slice(0, 4);
  let month = test.slice(5, 7);
  let day = test.slice(8, 10);

  year = year.join('').toString();
  month = month.join('').toString();
  day = day.join('').toString();

  test = `${month}-${day}-${year}`;
  return test;
}

function clearApi() {
  info = [];
  history = [];
  collect = [];
  code = [];
  chartData = [];
}
