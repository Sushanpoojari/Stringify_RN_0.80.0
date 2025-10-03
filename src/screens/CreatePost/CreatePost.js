import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { use, useState } from 'react'
import Header from '../components/Header'
import colors from '../../constants/colors'
import CustomCodeEditor from '../components/CodeEditor'
import { useSelector } from 'react-redux'
import { postAPI } from '../../api/postAPI/postAPI'
import CustomAlert from '../../commonComponents/CustomAlert'

const CreatePost = () => {
    // STATES
    const [postTitle, setPostTitle] = useState(null)
    const [postContent, setPostContent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertModalVisibilty, setAlertModalVisibilty] = useState(false);
    const [alertModalDetails, setAlertModalDetails] = useState({
        title: '',
        message: '',
    })
    const user = useSelector(state => state.auth.user);

    const handleSubmitPost = async () => {
        try {
            setIsSubmitting(true);

            const postData = {
                title: postTitle,
                code: postContent,
                tags: [],
                postedBy: user?._id
            }
            console.log('postData', JSON.stringify(postData, null, 2));
            const response = await postAPI?.createPost(postData);
            console.log('Post created successfully:', JSON.stringify(response, null, 2));
            if (response?.data?.statusCode === 200) {
                setAlertModalVisibilty(true);
                setAlertModalDetails({
                    title: 'Success',
                    message: 'Post created successfully',
                });
            }
            setPostTitle(null);
            setPostContent(null);

        } catch (error) {
            console.log('Error creating post:', error)
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.titleText}>Create Post</Text>
            <TextInput
                style={styles.titleInput}
                placeholder="Enter post title..."
                placeholderTextColor={colors.GREY}
                editable={true}
                value={postTitle}
                maxLength={50}
                onChangeText={setPostTitle}
            />
            <KeyboardAvoidingView style={styles.codeEditorContainer}>
                <CustomCodeEditor codeToBeDisplayed={postContent} setCode={setPostContent} />
            </KeyboardAvoidingView>
            <TouchableOpacity style={[styles.savebutton, { opacity: isSubmitting || !postTitle || !postContent ? 0.5 : 1 }]} onPress={handleSubmitPost} disabled={isSubmitting || !postTitle || !postContent}>
                {
                    isSubmitting ? <ActivityIndicator size={'small'} color={colors.WHITE}></ActivityIndicator> : <Text style={styles.savebuttonText}>Post</Text>
                }
            </TouchableOpacity>
            <CustomAlert
                alertModalVisibilty={alertModalVisibilty}
                setAlertModalVisibilty={setAlertModalVisibilty}
                alertModalDetails={alertModalDetails}
            />
        </View>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    titleInput: {
        margin: 10,
        padding: 10,
        fontSize: 18,
        color: colors.BLACK,
        borderRadius: 8,
        elevation: 2,
        backgroundColor: colors.WHITE
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.BLACK,
        marginLeft: 20
    },
    codeEditorContainer: {
        padding: 20
    },
    savebutton: {
        marginHorizontal: 20,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: colors.PRIMARY,
        borderRadius: 8,
        alignItems: 'center',
    },
    savebuttonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.WHITE,
    },

})