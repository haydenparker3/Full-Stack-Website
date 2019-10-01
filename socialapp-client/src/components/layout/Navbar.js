import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import PostAPost from '../post/PostAPost';
import Notifications from './Notifications';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';

import { logoutUser } from '../../redux/actions/userActions';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

class Navbar extends Component {
	handleLogout = () => {
		this.props.logoutUser();
	};
	render () {
		const { authenticated } = this.props;
		return (
			<AppBar>
				<Toolbar>
					{authenticated ? (
						<Fragment>
							<div className='home-container'>
								<PostAPost />
								<Link to='/'>
									<MyButton tip='Home'>
										<HomeIcon />
									</MyButton>
								</Link>
							</div>
							<div className='button-container'>
								<Notifications />
								<MyButton color='inherit' tip='Logout' onClick={this.handleLogout}>
									<KeyboardReturn color='inherit' />
								</MyButton>
							</div>
						</Fragment>
					) : (
						<Fragment>
							<div className='home-container'>
								<Button color='inherit' component={Link} to='/'>
									Home
								</Button>
							</div>
							<div className='button-container'>
								<Button color='inherit' component={Link} to='/login'>
									Login
								</Button>
								<Button color='inherit' component={Link} to='/signup'>
									Sign Up
								</Button>
							</div>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>
		);
	}
}

Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
