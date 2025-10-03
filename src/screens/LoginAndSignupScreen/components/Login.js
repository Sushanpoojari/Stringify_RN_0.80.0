import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../../constants/colors';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAlert from '../../../commonComponents/CustomAlert';
import { authAPI } from '../../../api/authAPI/authAPI';
import { useNavigation } from '@react-navigation/native';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const validateFields = (isSignUp, fields) => {
    if (isSignUp) {
        const { name, email, password, confirmPassword } = fields;
        if (!name || !email || !password || !confirmPassword)
            return 'All fields are required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Invalid email format.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
    } else {
        const { email, password } = fields;
        if (!email || !password) return 'All fields are required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Invalid email format.';
    }
    return null;
};

const CustomTextInput = ({
    value,
    handleOnChange,
    placeholderText,
    iconName,
    secureTextEntry = false,
    toggleVisibility,
}) => {
    return (
        <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={handleOnChange}
            value={value}
            placeholder={placeholderText}
            right={
                iconName === 'lock' ? (
                    <TextInput.Icon
                        icon={() => (
                            <TouchableOpacity onPress={toggleVisibility}>
                                <MaterialCommunityIcons
                                    name={secureTextEntry ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#007bff"
                                />
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <TextInput.Icon
                        icon={() => (
                            <MaterialCommunityIcons
                                name={iconName}
                                size={20}
                                color="#007bff"
                            />
                        )}
                    />
                )
            }
            secureTextEntry={secureTextEntry}
            activeOutlineColor={colors.PRIMARY || '#2196F3'}
        />
    );
};

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [name, setName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isUserSubmitting, setIsUserSubmitting] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [alertModalVisibilty, setAlertModalVisibilty] = useState(false);
    const [alertModalDetails, setAlertModalDetails] = useState({
        type: 'info',
        title: '',
        message: '',
        okButtonText: 'OK',
    });

    const showAlert = (type, title, message) => {
        setAlertModalDetails({ type, title, message, okButtonText: 'OK' });
        setAlertModalVisibilty(true);
        console.log("title", title, "message", message)
    };

    const handleAuth = async () => {
        try {
            setIsUserSubmitting(true);
            const fields = isSignUp
                ? { name, email: signupEmail, password: signupPassword, confirmPassword }
                : { email, password };

            const errorMsg = validateFields(isSignUp, fields);
            if (errorMsg) {
                showAlert('error', 'Validation Error', errorMsg);
                return;
            }

            try {
                let response;

                if (isSignUp) {
                    const signUpPayload = {
                        username: name,
                        email: signupEmail,
                        password: signupPassword,
                    };
                    response = await authAPI?.signup(signUpPayload);
                } else {
                    const loginPayload = { email, password };
                    response = await authAPI?.login(loginPayload);
                }

                if (response?.status === 201 || response?.status === 200) {
                    showAlert(
                        'success',
                        isSignUp ? 'Account Created' : 'Login Successful',
                        response?.data?.message || (isSignUp ? 'You can now log in.' : 'Welcome back!')
                    );
                    dispatch(loginSuccess({
                        user: response?.data?.data,
                        accessToken: response?.data?.accessToken,
                        refreshToken: response?.data?.refreshToken
                    }));
                    setAlertModalDetails(prev => ({
                        ...prev,
                        handleOnOkayPress: () => {
                            navigation.replace('Dashboard');
                            setAlertModalVisibilty(false);
                        }
                    }));
                } else {
                    showAlert(
                        'error',
                        'Error',
                        response?.data?.message || 'Something went wrong, please try again.'
                    );
                }
            } catch (error) {
                showAlert('error', 'API Error', error.message || 'Unable to connect to server.');
            }
        } catch (error) {
            console.log("Error Handle Auth :: ", error)
        } finally {
            setIsUserSubmitting(false);
        }

    };


    return (
        <ScrollView contentContainerStyle={styles.authContainer}>
            <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back User'}</Text>

            {isSignUp ? (
                <View>
                    <CustomTextInput
                        value={name}
                        handleOnChange={setName}
                        placeholderText="Enter your name"
                        iconName="account"
                    />

                    <CustomTextInput
                        value={signupEmail}
                        handleOnChange={setSignupEmail}
                        placeholderText="Enter your email"
                        iconName="email"
                    />

                    <CustomTextInput
                        value={signupPassword}
                        handleOnChange={setSignupPassword}
                        placeholderText="Enter your password"
                        iconName="lock"
                        secureTextEntry={!showSignupPassword}
                        toggleVisibility={() => setShowSignupPassword(prev => !prev)}
                    />

                    <CustomTextInput
                        value={confirmPassword}
                        handleOnChange={setConfirmPassword}
                        placeholderText="Confirm your password"
                        iconName="lock"
                        secureTextEntry={!showConfirmPassword}
                        toggleVisibility={() => setShowConfirmPassword(prev => !prev)}
                    />

                    <TouchableOpacity style={styles.actionButton} onPress={handleAuth}>
                        {isUserSubmitting ? <ActivityIndicator size={20} color={colors?.WHITE} /> : <Text style={styles.actionButtonText}>Sign Up</Text>
                        }
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <CustomTextInput
                        value={email}
                        handleOnChange={setEmail}
                        placeholderText="Enter your email"
                        iconName="email"
                    />

                    <CustomTextInput
                        value={password}
                        handleOnChange={setPassword}
                        placeholderText="Enter your password"
                        iconName="lock"
                        secureTextEntry={!showLoginPassword}
                        toggleVisibility={() => setShowLoginPassword(prev => !prev)}
                    />

                    <TouchableOpacity style={styles.actionButton} onPress={handleAuth}>
                        {isUserSubmitting ? <ActivityIndicator size={20} color={colors?.WHITE} /> : <Text style={styles.actionButtonText}>Log in</Text>
                        }
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.footerText}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Text
                    style={styles.signupText}
                    onPress={() => setIsSignUp(prev => !prev)}
                >
                    {isSignUp ? 'Log In' : 'Sign Up'}
                </Text>
            </Text>

            <CustomAlert
                alertModalVisibilty={alertModalVisibilty}
                setAlertModalVisibilty={setAlertModalVisibilty}
                alertModalDetails={alertModalDetails}
            />
        </ScrollView>
    );
};

export default Auth;

const styles = StyleSheet.create({
    authContainer: {
        flexGrow: 1,
        backgroundColor: colors.WHITE,
        padding: 20,
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.PRIMARY || '#2196F3',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        marginBottom: 20,
        backgroundColor: colors.WHITE,
    },
    actionButton: {
        backgroundColor: colors.PRIMARY || '#2196F3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    actionButtonText: {
        color: colors.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
    signupText: {
        color: colors.PRIMARY || '#2196F3',
        fontWeight: 'bold',
    },
});
