import { removeTaskAC } from './../TodolistsList/tasks-reducer';
import { call, put, takeEvery } from 'redux-saga/effects';
import { todolistsAPI } from '../../api/todolists-api';
import { setAppStatusAC } from '../../app/app-reducer';
import { fetchTasks, setTasksAC } from '../TodolistsList/tasks-reducer';

// ! SAGAS

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
	yield put(setAppStatusAC('loading'));

	const res = yield call(todolistsAPI.getTasks, action.todolistId);
	const tasks = res.data.items;
	yield put(setTasksAC(tasks, action.todolistId));
	yield put(setAppStatusAC('succeeded'));
}

export function* removeTaskWorkerSaga(
	action: ReturnType<typeof removeTaskAction>
) {
	yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId);
	yield put(removeTaskAC(action.taskId, action.todolistId));
	console.log('removetaskworker');
}

export const removeTaskAction = (taskId: string, todolistId: string) => ({
	type: 'TASKS/REMOVE-TASK',
	taskId,
	todolistId,
});

export function* tasksWatcherSaga() {
	yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga);
	yield takeEvery('TASKS/REMOVE-TASK', removeTaskWorkerSaga);
	console.log('removetaskwatcher');
}
