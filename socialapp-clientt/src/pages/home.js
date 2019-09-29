import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';

import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

class home extends Component {
	state = { posts: null };
	componentDidMount () {
		this.props.getPosts();
	}
	render () {
		const { posts, loading } = this.props.data;
		if (posts != null && (posts.length > 0 || loading)) {
			let recentPostsMarkup = !loading ? posts.map((post) => <Post key={post.postId} post={post} />) : <PostSkeleton />;
			return (
				<Grid container spacing={1}>
					<Grid item sm={8} xs={8}>
						{recentPostsMarkup}
					</Grid>
					<Grid item sm={4} xs={4}>
						<Profile />
					</Grid>
				</Grid>
			);
		} else {
			console.log('TOO MANY REQUESTS');
			return <p>Something went wrong</p>;
		}
	}
}

home.propTypes = {
	getPosts: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	data: state.data
});

export default connect(mapStateToProps, { getPosts })(home);
