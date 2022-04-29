import { call, put, takeEvery } from 'redux-saga/effects';
import { GetTasksResponse, todolistsAPI } from '../../api/todolists-api';
import { setAppStatusAC } from '../../app/app-reducer';
import {
	handleServerAppErrorSaga,
	handleServerNetworkErrorSaga,
} from '../../utils/error-utils';
import { fetchTasks, setTasksAC } from '../TodolistsList/tasks-reducer';
import { addTaskAC, removeTaskAC } from './../TodolistsList/tasks-reducer';

// ! SAGAS

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
	yield put(setAppStatusAC('loading'));

	const data: GetTasksResponse = yield call(
		todolistsAPI.getTasks,
		action.todolistId
	);
	const tasks = data.items;
	yield put(setTasksAC(tasks, action.todolistId));
	yield put(setAppStatusAC('succeeded'));
}

export function* removeTaskWorkerSaga(
	action: ReturnType<typeof removeTaskAction>
) {
	yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId);
	yield put(removeTaskAC(action.taskId, action.todolistId));
}

export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
	yield put(setAppStatusAC('loading'));
	try {
		const res = yield call(
			todolistsAPI.createTask,
			action.todolistId,
			action.title
		);
		if (res.data.resultCode === 0) {
			const task = res.data.data.item;
			yield put(addTaskAC(task));
			yield put(setAppStatusAC('succeeded'));
		} else {
			yield handleServerAppErrorSaga(res.data);
		}
	} catch (err) {
		// @ts-ignore
		yield* handleServerNetworkErrorSaga(err);
	}
}

// * Actions of Sagas
export const removeTaskAction = (taskId: string, todolistId: string) => ({
	type: 'TASKS/REMOVE-TASK',
	taskId,
	todolistId,
});

export const addTask = (title: string, todolistId: string) =>
	({
		type: 'TASKS/ADD-TASK',
		title,
		todolistId,
	} as const);

export function* tasksWatcherSaga() {
	yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga);
	yield takeEvery('TASKS/REMOVE-TASK', removeTaskWorkerSaga);
	yield takeEvery('TASKS/ADD-TASK', addTaskWorkerSaga);
}
