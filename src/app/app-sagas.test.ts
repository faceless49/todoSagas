import { call, put } from 'redux-saga/effects';
import { authAPI, MeResponseType } from '../api/todolists-api';
import { setIsLoggedInAC } from '../features/Login/auth-reducer';
import { setAppInitializedAC } from './app-reducer';
import { initializeAppWorkerSaga } from './app-sagas';

let fakeMeResponse: MeResponseType;

beforeEach(() => {
	fakeMeResponse = {
		resultCode: 0,
		data: { email: '', id: 2, login: 'Asd' },
		messages: [],
	};
});
test('initializeAppWorkerSaga login success', () => {
	const gen = initializeAppWorkerSaga();
	expect(gen.next().value).toEqual(call(authAPI.me));
	expect(gen.next(fakeMeResponse).value).toEqual(put(setIsLoggedInAC(true)));
	expect(gen.next().value).toEqual(put(setAppInitializedAC(true)));
});

test('initializeAppWorkerSaga login failed', () => {
	const gen = initializeAppWorkerSaga();
	expect(gen.next().value).toEqual(call(authAPI.me));

	fakeMeResponse.resultCode = 1;
	expect(gen.next(fakeMeResponse).value).toEqual(
		put(setAppInitializedAC(true))
	);
});
