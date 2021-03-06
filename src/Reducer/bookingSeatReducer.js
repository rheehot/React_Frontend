import { select, put, takeLatest, call } from "redux-saga/effects";
import { movieApi } from "../Api/api";

import { openModal } from "./modalReducer";

const RESET = "seat/RESET";
const CHANGE_COUNT = "seat/CHANGE_COUNT";
const SET_SELECTSEAT = "seat/SET_SELECTSEAT";
const SET_RESERVED = "seat/SET_RESERVED";
const START_LOADING = "seat/START_LOADING";
const END_LOADING = "seat/END_LOADING";

// saga 진입용
const SET_SELECT_SEAT_SAGA = "seat/SET_SELECT_SEAT_SAGA";
const SET_RESERVED_SEAT_SAGA = "seat/SET_RESERVED_SEAT_SAGA";

const initSeatState = {
  reserved: [],
  personal: {
    adult: 0,
    teen: 0,
    preferential: 0,
  },
  selectedSeat: [],
  isLoading: false,
};

export const resetSeat = () => ({
  type: RESET,
});
export const changePersonalCount = (type, value) => ({
  type: CHANGE_COUNT,
  personType: type,
  value: value,
});
export const setSelectSeat = (seat) => ({
  type: SET_SELECTSEAT,
  selected: seat,
});
export const setRerved = (reserved) => ({
  type: SET_RESERVED,
  reserved,
});
export const startLoading = () => ({
  type: START_LOADING,
});
export const endLoading = () => ({
  type: END_LOADING,
});
export const selectSeatSaga = (seat) => ({
  type: SET_SELECT_SEAT_SAGA,
  seat,
});
export const setReservedSeat = () => ({
  type: SET_RESERVED_SEAT_SAGA,
});

export const resetThunk = (url) => (dispatch) => {
  if (url === "/booking/seat") dispatch(resetSeat());
};

function* setSelectSeatSaga(action) {
  const state = yield select();

  if (state.Seat.selectedSeat.indexOf(action.seat) > -1)
    yield put(setSelectSeat(action.seat));
  else {
    try {
      // 로딩 처리
      yield put(startLoading());
      // 예약된 좌석 정보 불려오기
      const getReservation = yield call(
        movieApi.getReservedSeats,
        state.Booking.ticket.scheduleId
      );
      // 로딩 끝
      yield put(endLoading());
      // 예약된 좌석이면 팝업 오픈
      if (
        getReservation.data
          .map((seat) => seat.reserved_seat)
          .indexOf(action.seat) === -1
      )
        yield put(setSelectSeat(action.seat));
      else {
        yield put(openModal("이미 선택된 좌석입니다."));
      }
    } catch (e) {
      console.error(e.response);
    }
  }
}

function* setReservedSeatSaga() {
  const state = yield select();
  yield put(startLoading());
  try {
    const getReservation = yield call(
      movieApi.getReservedSeats,
      state.Booking.ticket.scheduleId
    );
    const reserved_seat = getReservation.data.map((seat) => seat.reserved_seat);
    yield put(setRerved(reserved_seat));
  } catch (e) {
    console.error(`error : ${e.state}`);
    console.error(`${e.response}`);
  }
  yield put(endLoading());
}

export function* seatSaga() {
  yield takeLatest(SET_SELECT_SEAT_SAGA, setSelectSeatSaga);
  yield takeLatest(SET_RESERVED_SEAT_SAGA, setReservedSeatSaga);
}

const seatReducer = (state = initSeatState, action) => {
  switch (action.type) {
    case RESET:
      return { ...initSeatState };
    case CHANGE_COUNT:
      return {
        ...state,
        personal: {
          ...state.personal,
          [action.personType]: action.value,
        },
      };
    case SET_SELECTSEAT:
      return {
        ...state,
        selectedSeat:
          state.selectedSeat.indexOf(action.selected) > -1
            ? state.selectedSeat.filter((seat) => seat !== action.selected)
            : [...state.selectedSeat, action.selected].sort(
              (a, b) =>
                a[0].charCodeAt() - b[0].charCodeAt() ||
                +a.slice(1) - +b.slice(1)
            ),
      };
    case SET_RESERVED:
      return {
        ...state,
        reserved: action.reserved,
      };
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case END_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default seatReducer;
