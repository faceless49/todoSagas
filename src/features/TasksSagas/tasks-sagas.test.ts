import { call, put } from 'redux-saga/effects';
import { addTaskWorkerSaga, fetchTasksWorkerSaga } from '.';
import {
	GetTasksResponse,
	TaskPriorities,
	TaskStatuses,
	todolistsAPI,
} from '../../api/todolists-api';
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer';
import { setTasksAC } from '../TodolistsList/tasks-reducer';

test('fetchTasksWorkerSaga success flow', () => {
	const gen = fetchTasksWorkerSaga({ type: '', todolistId: 'todolistId' });
	let result = gen.next();
	expect(result.value).toEqual(put(setAppStatusAC('loading')));

	result = gen.next();
	expect(result.value).toEqual(call(todolistsAPI.getTasks, 'todolistId'));

	const fakeApiResponse: GetTasksResponse = {
		error: '',
		totalCount: 1,
		items: [
			{
				id: '1',
				title: 'CSS',
				status: TaskStatuses.New,
				todoListId: 'todolistId',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriorities.Low,
			},
		],
	};
	result = gen.next(fakeApiResponse);

	expect(result.value).toEqual(
		put(setTasksAC(fakeApiResponse.items, 'todolistId'))
	);
	result = gen.next();
	expect(result.value).toEqual(put(setAppStatusAC('succeeded')));
});

test('addTaskWorkerSaga success flow', () => {
	const todolistId = 'todolistId';
	const title = 'task title';

	const gen = addTaskWorkerSaga({
		type: 'TASKS/ADD-TASK',
		title,
		todolistId,
	});

	expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
	expect(gen.next().value).toEqual(
		call(todolistsAPI.createTask, todolistId, title)
	);
	expect(gen.throw({ message: 'Some Error' }).value).toEqual(
		put(setAppErrorAC('Some Error'))
	);
	expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
});
