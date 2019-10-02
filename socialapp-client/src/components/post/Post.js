import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import Deletepost from './Deletepost';
import PostDialog from './PostDialog';
import LikeButton from './LikeButton';
// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';

const styles = {
	card: {
		position: 'relative',
		display: 'flex',
		marginBottom: 20
	},
	image: {
		minWidth: '25%',
		maxHeight: '25%'
	},
	content: {
		padding: 25,
		objectFit: 'cover',
		marginRight: 40
	}
};

class Post extends Component {
	render () {
		dayjs.extend(relativeTime);
		const {
			classes,
			post: { body, createdAt, userImage, userHandle, postId, likeCount, commentCount },
			user: { authenticated, credentials: { handle } }
		} = this.props;

		const deleteButton = authenticated && userHandle === handle ? <Deletepost postId={postId} /> : null;
		return (
			<Card className={classes.card}>
				<CardMedia image={userImage} title='Profile image' className={classes.image} />
				<CardContent className={classes.content}>
					<Typography variant='h5'>{body}</Typography>
					<Typography variant='body1' component={Link} to={`/users/${userHandle}`} color='primary'>
						{userHandle}
					</Typography>
					{deleteButton}
					<Typography variant='body2' color='textSecondary'>
						{dayjs(createdAt).fromNow()}
					</Typography>
					<LikeButton postId={postId} />
					<span>{likeCount} Likes</span>
					<MyButton tip='Comments' disabled='true'>
						<ChatIcon color='primary' />
					</MyButton>
					<span>{commentCount} comments</span>
					<PostDialog postId={postId} userHandle={userHandle} openDialog={this.props.openDialog} />
				</CardContent>
			</Card>
		);
	}
}

Post.propTypes = {
	user: PropTypes.object.isRequired,
	post: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
	user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
