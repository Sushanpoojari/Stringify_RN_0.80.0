import {
    Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity,
    View, ScrollView, Alert, PermissionsAndroid, Platform,
    ActivityIndicator
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProfileData } from '../../redux/slices/userProfileSlice';
import Header from '../components/Header';
import formatDate from '../../utils/commonHelpers/DateFormatterHelper';
import Tags from '../Dashboard/components/Tags';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { validate } from '../../utils/validation/validation';
import ImagePicker from 'react-native-image-crop-picker';
import { userAPI } from '../../api/userAPI/userAPI';
import CustomAlert from '../../commonComponents/CustomAlert';

const Profile = () => {
    const user = useSelector(state => state.auth.user);
    const { profile = [], isLoading, error } = useSelector(state => state.userProfile);
    const dispatch = useDispatch();

    const [updateProfileModalVisibility, setUpdateProfileModalVisibility] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedProfilePic, setUpdatedProfilePic] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Custom Alert states
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [customAlertDetails, setCustomAlertDetails] = useState({
        type: 'info', title: '', message: '', okButtonText: 'OK'
    });

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchProfileData({ userId: user?._id }));
        }, [])
    );

    const handleProfileClick = () => {
        setUpdatedUsername(profile?.username || '');
        setUpdatedProfilePic(profile?.profilePicURL || null);
        setUpdateProfileModalVisibility(true);
    };

    const updateProfile = async () => {
        try {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append('userId', user?._id);
            formData.append('userName', updatedUsername);

            if (updatedProfilePic) {
                formData.append('profilePic', {
                    uri: updatedProfilePic,
                    name: `${user?._id}_profile.jpg`,
                    type: 'image/jpeg',
                });
            }

            const response = await userAPI.updateProfile(formData);

            if (response?.status === 200) {
                setCustomAlertDetails({
                    type: 'success',
                    title: 'Success',
                    message: 'Profile updated successfully',
                });
                setUpdateProfileModalVisibility(false);
                setCustomAlertVisible(true);
                dispatch(fetchProfileData({ userId: user?._id }));
            } else {
                setCustomAlertDetails({
                    type: 'error',
                    title: 'Error',
                    message: response?.data?.errorMessage || 'Failed to update profile',
                });
                setUpdateProfileModalVisibility(false)
                setCustomAlertVisible(true);

            }
        } catch (error) {
            setCustomAlertDetails({
                type: 'error',
                title: 'Error',
                message: 'Something went wrong!',
            });
            setCustomAlertVisible(true);
            console.log('Update Profile Error:', error);
        }
    };

    const handleUpdateProfile = () => {
        const usernameValidation = validate(updatedUsername, { minLength: 3, maxLength: 20 });
        if (!usernameValidation.isValid) {
            setCustomAlertDetails({
                type: 'error',
                title: 'Validation Error',
                message: usernameValidation.message,
            });
            setCustomAlertVisible(true);
            return;
        }
        updateProfile();
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            let permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];

            if (Platform.Version >= 33) {
                permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
            } else {
                permissions.push(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
            }

            try {
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
                const storageGranted = Platform.Version >= 33
                    ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED
                    : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
                    && granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;

                if (cameraGranted && storageGranted) return true;

                setCustomAlertDetails({
                    type: 'error',
                    title: 'Permission Denied',
                    message: 'Camera and storage permissions are required.',
                });
                setCustomAlertVisible(true);
                return false;

            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS handles permissions automatically
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                { text: 'Camera', onPress: openCamera },
                { text: 'Gallery', onPress: openGallery },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
            compressImageQuality: 0.8,
        }).then(image => {
            setUpdatedProfilePic(image.path);
        }).catch(error => console.log('Camera Error: ', error));
    };

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            compressImageQuality: 0.8,
        }).then(image => {
            setUpdatedProfilePic(image.path);
        }).catch(error => console.log('Gallery Error: ', error));
    };

    const ProfileCard = ({ userData }) => (
        <TouchableOpacity style={styles.cardContainer} onPress={handleProfileClick}>
            <View style={styles.row}>
                <View style={styles.profilePicContainer}>
                    <Image
                        source={userData?.profilePicURL
                            ? { uri: userData.profilePicURL }
                            : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
                        style={styles.profilePic}
                    />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{userData?.username}</Text>
                    <View style={styles.infoRow}>
                        <Icon name="email" size={18} color={colors.WHITE} />
                        <Text style={styles.email}>{userData?.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-today" size={18} color={colors.WHITE} />
                        <Text style={styles.joined}>Joined: {formatDate(userData?.createdAt, "DD MMM YYYY")}</Text>
                    </View>
                </View>
            </View>
            <Tags tags={userData?.role || []} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header />
            {
                isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.PRIMARY} />
                </View> : <ProfileCard userData={profile} />
            }

            <Modal
                visible={updateProfileModalVisibility}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setUpdateProfileModalVisibility(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Update Profile</Text>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <TouchableOpacity onPress={pickImage} style={styles.profilePicPicker}>
                                <Image
                                    source={updatedProfilePic
                                        ? { uri: updatedProfilePic }
                                        : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
                                    style={styles.profilePicModal}
                                />
                                <Text style={styles.changePicText}>Change Profile Picture</Text>
                            </TouchableOpacity>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={updatedUsername}
                                onChangeText={setUpdatedUsername}
                                placeholder="Enter Username"
                            />
                            {
                                isUpdating ? <ActivityIndicator size="large" color={colors.PRIMARY} style={{ marginTop: 20 }} /> :
                                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                                        <Text style={styles.updateButtonText}>Update</Text>
                                    </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setUpdateProfileModalVisibility(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <CustomAlert
                alertModalVisibilty={customAlertVisible}
                setAlertModalVisibilty={setCustomAlertVisible}
                alertModalDetails={customAlertDetails}
            />
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardContainer: {
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingTop: 25,
        paddingBottom: 10,
        backgroundColor: colors.PRIMARY,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profilePic: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: colors.WHITE,
    },
    userInfo: {
        marginLeft: 25,
        marginTop: 10,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    username: {
        fontSize: 18,
        fontWeight: '400',
        color: colors.WHITE,
    },
    email: {
        fontSize: 16,
        color: colors.WHITE,
    },
    joined: {
        fontSize: 16,
        color: colors.WHITE,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    profilePicPicker: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicModal: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    changePicText: {
        color: colors.PRIMARY,
        fontWeight: 'bold',
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 5,
    },
    updateButton: {
        backgroundColor: colors.PRIMARY,
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.PRIMARY,
    },
    cancelButtonText: {
        color: colors.PRIMARY,
        fontWeight: 'bold',
    },
});
