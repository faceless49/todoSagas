import { call, put, takeEvery } from 'redux-saga/effects';
import { authAPI, LoginParamsType } from '../../api/todolists-api';
import { setAppStatusAC } from '../../app/app-reducer';
import { setIsLoggedInAC } from './auth-reducer';

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
	yield put(setAppStatusAC('loading'));

	const res = yield call(authAPI.login, action.data);
	if (res.data.resultCode === 0) {
		yield put(setIsLoggedInAC(true));
		yield put(setAppStatusAC('succeeded'));
	}
}

export function* logoutWorkerSaga(action: ReturnType<typeof logout>) {
	yield put(setAppStatusAC('loading'));
	const res = yield call(authAPI.logout);
	if (res.data.resultCode === 0) {
		yield put(setIsLoggedInAC(false));
		yield put(setAppStatusAC('succeeded'));
	}
}

export const login = (data: LoginParamsType) => ({
	type: 'AUTH/LOGIN',
	data,
});

export const logout = () => ({ type: 'AUTH/LOGOUT' });

export function* authWatcherSaga() {
	yield takeEvery('AUTH/LOGIN', loginWorkerSaga);
	yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga);
}
