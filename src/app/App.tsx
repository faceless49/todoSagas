import {
	AppBar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar';
import { logout } from '../features/Login/auth-sagas';
import { Login } from '../features/Login/Login';
import { TodolistsList } from '../features/TodolistsList/TodolistsList';
import { RequestStatusType } from './app-reducer';
import { initializeApp } from './app-sagas';
import './App.css';
import { AppRootStateType } from './store';

type PropsType = {
	demo?: boolean;
};

function App({ demo = false }: PropsType) {
	const status = useSelector<AppRootStateType, RequestStatusType>(
		state => state.app.status
	);
	const isInitialized = useSelector<AppRootStateType, boolean>(
		state => state.app.isInitialized
	);
	const isLoggedIn = useSelector<AppRootStateType, boolean>(
		state => state.auth.isLoggedIn
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(initializeApp());
	}, []);

	const logoutHandler = useCallback(() => {
		dispatch(logout());
	}, []);

	if (!isInitialized) {
		return (
			<div
				style={{
					position: 'fixed',
					top: '30%',
					textAlign: 'center',
					width: '100%',
				}}
			>
				<CircularProgress />
			</div>
		);
	}

	return (
		<BrowserRouter>
			<div className='App'>
				<ErrorSnackbar />
				<AppBar position='static'>
					<Toolbar>
						<IconButton edge='start' color='inherit' aria-label='menu'>
							<Menu />
						</IconButton>
						<Typography variant='h6'>News</Typography>
						{isLoggedIn && (
							<Button color='inherit' onClick={logoutHandler}>
								Log out
							</Button>
						)}
					</Toolbar>
					{status === 'loading' && <LinearProgress />}
				</AppBar>
				<Container fixed>
					<Route
						exact
						path={'/'}
						render={() => <TodolistsList demo={demo} />}
					/>
					<Route path={'/login'} render={() => <Login />} />
				</Container>
			</div>
		</BrowserRouter>
	);
}

export default App;
