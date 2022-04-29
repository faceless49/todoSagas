import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, takeEvery } from 'redux-saga/effects';
import thunkMiddleware from 'redux-thunk';
import { authReducer } from '../features/Login/auth-reducer';
import {
	fetchTasksWorkerSaga,
	removeTaskWorkerSaga,
	tasksWatcherSaga,
} from '../features/TasksSagas';
import { tasksReducer } from '../features/TodolistsList/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer';
import { appReducer } from './app-reducer';
import { appWatcherSaga, initializeAppWorkerSaga } from './app-sagas';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
	auth: authReducer,
});

// * 1 Create middleware

const sagaMiddleware = createSagaMiddleware();
// * 2 непосредственно создаём store, подключаем сагу или санку

export const store = createStore(
	rootReducer,
	applyMiddleware(thunkMiddleware, sagaMiddleware)
);
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

// * 3. Скармливаем сагу которая является вотчером
// * Take Every принимает 2 параметра 1 - экшн активатор, 2 воркерную сага, которую нужноо активировать когда кто то задиспатчит экшн который в саг вотчере
//
function* rootWatcher() {
	yield all([appWatcherSaga(), tasksWatcherSaga()]);
}

// setTimeout(() => {
// 	//@ts-ignore
// 	store.dispatch({ type: 'ACTIVATOR' });
// }, 1000);
sagaMiddleware.run(rootWatcher);
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
