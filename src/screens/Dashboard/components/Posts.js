import React, { useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import colors from '../../../constants/colors'
import DATEFORMATS from '../../../constants/DateFormat'
import { fetchDashboardData, votePost } from '../../../redux/slices/postSlice'
import formatDate from '../../../utils/commonHelpers/DateFormatterHelper'
import CustomCodeEditor from '../../components/CodeEditor'
import { useNavigation } from '@react-navigation/native'

const USER_TYPE = {
    UPVOTE: "upvote",
    DOWNVOTE: "downvote"
}




const Posts = ({ postData }) => {
    const dispatch = useDispatch();
    const [userVoteType, setuserVoteType] = useState(null);
    const { isVoting, userVoting, isRefreshing } = useSelector(state => state.posts);
    const user = useSelector(state => state.auth.user);
    const pageNumber = useRef(1);
    const navigation = useNavigation();


    const handleVote = (questionId, voteType) => {
        if (!user?._id || isVoting) return;
        setuserVoteType(voteType);
        dispatch(votePost({ questionId, userId: user._id, voteType }));
    };

    const handleOnCommentsPressed = (postData) => {
        navigation.navigate('Comments',{postData})
    }


    const Post = ({ item }) => {
    return (
        <View style={styles.postContainer}>
            <PostHeader item={item} />
            <Text style={styles.postTitle}>{item.title}</Text>
            <CustomCodeEditor codeToBeDisplayed={item.code} isReadOnly={true} />
            {/* <Tags tags={item.tags} /> */}
            <PostFooter item={item} />
        </View>
    )
}

    const PostHeader = ({ item }) => {
        const formattedDate = formatDate(item.created_at, DATEFORMATS.MONTH_DAY_YEAR)
        return (
            <View style={styles.postHeaderContainer}>
                <View style={{ marginRight: 10, width: 40, height: 40, borderRadius: 20 }}>
                    <Image source={item?.user?.profilePicURL ? { uri: item?.user?.profilePicURL } : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }} style={styles.postHeaderImage} />
                </View>
                <View>
                    <Text style={styles.postHeaderText}>{item?.user?.username}</Text>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
            </View>
        )
    }

    const PostFooter = ({ item }) => {
        const userSubmittedVote = item?.hasCurrentUserVoted?.length > 0
            ? item.hasCurrentUserVoted[0]?.voteType
            : null;

        const isUpvoteDisabled = isVoting || userSubmittedVote === USER_TYPE.UPVOTE || (userVoteType === USER_TYPE.UPVOTE && userVoting[item._id]);
        const isDownvoteDisabled = isVoting || userSubmittedVote === USER_TYPE.DOWNVOTE || (userVoteType === USER_TYPE.DOWNVOTE && userVoting[item._id]);

        return (
            <View style={styles.postFooterContainer}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => handleVote(item._id, USER_TYPE.UPVOTE)}
                        disabled={isUpvoteDisabled}>
                        {userVoteType === USER_TYPE.UPVOTE && userVoting[item._id] ?
                            <ActivityIndicator size={20} color="green" /> :
                            <IonIcons name="arrow-up-circle-outline" size={28} color={userSubmittedVote === USER_TYPE.UPVOTE ? "grey" : "green"} />}
                    </TouchableOpacity>
                    <Text>{item.upvotes}</Text>

                    <TouchableOpacity
                        onPress={() => handleVote(item._id, USER_TYPE.DOWNVOTE)}
                        disabled={isDownvoteDisabled}>
                        {userVoteType === USER_TYPE.DOWNVOTE && userVoting[item._id] ?
                            <ActivityIndicator size={20} color="red" /> :
                            <IonIcons name="arrow-down-circle-outline" size={28} color={userSubmittedVote === USER_TYPE.DOWNVOTE ? "grey" : "red"} />}
                    </TouchableOpacity>
                    <Text>{item.downvotes}</Text>
                </View>
                <TouchableOpacity onPress={()=>handleOnCommentsPressed(item)} >
                    <FontAwesome name="comment" size={28} color={colors.PRIMARY} />
                </TouchableOpacity>

            </View>
        )
    };




    const fetchMoreData = () => {
        pageNumber.current = pageNumber.current + 1;
        dispatch(fetchDashboardData({ userId: user?._id, pageNumber: pageNumber.current }))
    }

    return (
        <View>
            <FlatList
                data={postData}
                // keyExtractor={(item) => item.post_id.toString()}
                renderItem={({ item }) => (
                    <Post item={item} />
                )}
                refreshing={true}
                ListFooterComponent={() => {
                    return (
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            {isRefreshing && <ActivityIndicator size={"large"} color={colors.PRIMARY} />}
                        </View>
                    )
                }}
                removeClippedSubviews={true}
                onEndReached={fetchMoreData}
                contentContainerStyle={{ paddingBottom: 200 }}
            />
        </View>
    )
}



export default Posts

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
    postContent: {
        fontSize: 16,
        color: '#333',
    },
    postCode: {
        fontSize: 14,
        color: '#333',
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    postHeaderImage: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    postFooterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    postFooterText: {
        fontSize: 16,
    }
});