import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomCodeEditor from '../../components/CodeEditor';
import formatDate from '../../../utils/commonHelpers/DateFormatterHelper';
import DATEFORMATS from '../../../constants/DateFormat';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, postAComment } from '../../../redux/slices/commentsSlice';
import colors from '../../../constants/colors';

const Comments = (props) => {
    const { postData } = props.route.params;
    const { comments, loading } = useSelector(state => state.comments);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchComments({ questionID: postData._id }));
    }, [dispatch, postData._id]);

    const PostHeader = ({ item }) => {
        const formattedDate = formatDate(item.created_at, DATEFORMATS.MONTH_DAY_YEAR);
        return (
            <View style={styles.postHeaderContainer}>
                <View style={styles.postHeaderImageWrapper}>
                    <Image
                        source={item?.user?.profilePicURL ? { uri: item.user.profilePicURL } : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
                        style={styles.postHeaderImage}
                    />
                </View>
                <View>
                    <Text style={styles.postHeaderText}>{item?.user?.username}</Text>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
            </View>
        );
    };

    const Post = ({ item }) => (
        <View style={styles.postContainer}>
            <PostHeader item={item} />
            <Text style={styles.postTitle}>{item.title}</Text>
            <CustomCodeEditor codeToBeDisplayed={item.code} isReadOnly={true} />
        </View>
    );

    const CommentsHeader = () => (
        <View style={styles.commentsHeader}>
            <Text>Comments</Text>
        </View>
    );

    const CommentTextinput = () => {
        const [enteredComment, setEnteredComment] = useState('');
        return (
            <View style={styles.commentInputContainer}>
                <View style={styles.commentUserImageWrapper}>
                    <Image
                        source={user?.profilePicURL ? { uri: user.profilePicURL } : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
                        style={styles.commentUserImage}
                    />
                </View>
                <TextInput
                    placeholder='Add a comment...'
                    style={styles.commentTextInput}
                    value={enteredComment}
                    onChangeText={setEnteredComment}
                    maxLength={190}
                    returnKeyType='send'
                    onSubmitEditing={() => {
                        if (enteredComment.trim()) {
                            console.log("Posting comment: ", enteredComment);
                            dispatch(postAComment({ parentId: postData._id, parentType: "Question", content: enteredComment, postedBy: user?._id }));
                        }
                    }}
                />
            </View>
        );
    };

    const CommentsList = ({ item }) => {
        const renderComments = ({ item }) => (
            <View style={styles.commentItem}>
                <View style={styles.commentImageWrapper}>
                    <Image
                        source={item?.postedBy?.profilePicURL ? { uri: item.postedBy.profilePicURL } : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
                        style={styles.commentImage}
                    />
                </View>
                <View style={styles.commentContent}>
                    <Text style={styles.commentUserText}>
                        {item?.postedBy?._id === user?._id ? 'You' : item?.postedBy?.username}  {formatDate(item?.createdAt, DATEFORMATS.MONTH_DAY_YEAR)}
                    </Text>
                    <Text style={styles.commentText}>{item?.content}</Text>
                </View>
            </View>
        );

        return <FlatList data={item} renderItem={renderComments} />;
    };

    const CommentsSection = ({ item }) => (
        <View>
            <CommentsHeader />
            <CommentTextinput />
            <CommentsList item={item} />
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <KeyboardAvoidingView>
                <Post item={postData} />
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <CommentsSection item={comments} />
                )}
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default Comments;

const styles = StyleSheet.create({
    postContainer: {
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 1,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    postHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    postHeaderText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 14,
        fontWeight: '400',
    },
    postHeaderImageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        overflow: 'hidden',
    },
    postHeaderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    commentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 20,
    },
    commentUserImageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    commentUserImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    commentTextInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginLeft: 15,
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    commentItem: {
        flexDirection: 'row',
        gap: 10,
        padding: 15,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
    },
    commentImageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    commentImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    commentContent: {
        flex: 1,
        gap: 5,
    },
    commentUserText: {
        fontSize: 16,
    },
    commentText: {
        fontSize: 14,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});
