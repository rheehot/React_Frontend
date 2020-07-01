const SUCCESS = "booking/SUCCESS";
const ERROR = "booking/ERROR";
const LOADING = "booking/LOADING";

const SET_SELECTED_DATE = "booking/SELECTED_DATE";
const SET_SELECTED_HOUR = "booking/SELECTED_HOUR";
const SET_SELECTED_REGION = "booking/SELECTED_REGION";
const SET_SELECTED_THEATER = "booking/SELECTED_THEATER";

const setSelectedDate = (date) => ({ type: SET_SELECTED_DATE, date });
const setSelectedHour = (hour) => ({ type: SET_SELECTED_HOUR, hour });
const setSelectRegion = (region) => ({ type: SET_SELECTED_REGION, region });
const setSelectTheater = (theater) => ({ type: SET_SELECTED_THEATER, theater });

const initialState = {
  selectedOption: {
    selectedDate: "",
    selectedRegion: "",
    selectedtheather: [],
    selectedMovieTitle: ["살아있다", "결백"],
    movieAgeGrade: "All",
    screenHall: "2관",
    selectedHour: "19",
    selectedTime: "19:40",
    endTime: "",
    seletedSeat: [],
  },
  ticket: {
    selectedDate: "2020-07-10",
    selectedtheather: "강남",
    selectedMovieTitle: "살아있다",
    movieAgeGrade: "All",
    screenHall: "2관",
    seletedTime: "19:40",
    endTime: "",
    seats: [],
    ticketType: {
      adult: 0,
      teen: 0,
      preferential: 0,
    },
    price: 0,
  },
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedDate: action.date,
        },
      };
    case SET_SELECTED_HOUR:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedHour: action.hour,
        },
      };
    case SET_SELECTED_REGION:
      return {
        ...state,
        selectedOption: {
          ...state.selectedOption,
          selectedRegion: action.region,
        },
      };
    case SUCCESS:
    case ERROR:
    case LOADING:
    default:
      return state;
  }
};

export {
  bookingReducer,
  setSelectedDate,
  setSelectedHour,
  setSelectRegion,
  setSelectTheater,
};
