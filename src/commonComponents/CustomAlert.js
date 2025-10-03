import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';

const alertTypes = {
  error: {
    iconName: 'warning-outline',
    color: colors.ERROR,
  },
  success: {
    iconName: 'checkmark-done-circle-outline',
    color: colors.SUCCESS,
  },
  info: {
    iconName: 'information-circle-outline',
    color: colors.INFO,
  },
};

function getAlertModalStyleDetails(type) {
  return alertTypes[String(type).toLowerCase()] || alertTypes.info;
}

const CustomAlert = ({ alertModalVisibilty, setAlertModalVisibilty, alertModalDetails }) => {
  const { type,
    title,
    message,
    okButtonText,
    handleOnOkayPress = () => { }
  } = alertModalDetails;
  const alertDetails = getAlertModalStyleDetails(type);

  return (
    <Modal animationType="fade" transparent={true} visible={alertModalVisibilty}>
      <View style={styles.modalContainer}>
        <View style={styles.alertCardContainer}>
          <TouchableOpacity onPress={() => setAlertModalVisibilty(false)} style={styles.closeIcon}>
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>

          <Ionicons name={alertDetails.iconName} size={36} color={alertDetails.color} style={styles.icon} />

          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          <TouchableOpacity onPress={() => {
            setAlertModalVisibilty(false)
            handleOnOkayPress()

          }}
          style={[styles.buttonContainer, { backgroundColor: colors.PRIMARY ,borderColor: colors.PRIMARY}]}
          >
            <Text style={[styles.buttonText, { color: colors.WHITE }]}>
              {okButtonText || 'OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertCardContainer: {
    width: '80%',
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  icon: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    color: colors.DRAK_GRAY,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer:{
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    // borderColor: colors.LIGHT_GRAY,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
