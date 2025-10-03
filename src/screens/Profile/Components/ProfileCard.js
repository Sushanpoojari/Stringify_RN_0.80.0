import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../constants/colors'

const ProfileCard = ({ profileData }) => {
  return (
    <View style={styles.profileCardContainer}>
      <Text style={styles.profileCardTitle}>Profile</Text>
      {profileData && (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <Image
            source={profileData.avatar ? { uri: profileData.avatar } : require('../../../assets/images/stringifyLogo.png')}
            style={{
              width: 100,
              height: 100,
              resizeMode: 'cover',
              backgroundColor: colors.WHITE, 
            }}
          />
          <View>
            <Text style={styles.text}>{profileData.first_name} {profileData.last_name}</Text>
            <Text style={styles.text}>{profileData.email}</Text>
          </View>
          {/* Add more fields as needed */}
        </View>
      )}
    </View>
  )
}

export default ProfileCard

const styles = StyleSheet.create({
  profileCardContainer: {
    padding: 20,
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
    margin: 20,
    elevation: 3,
  },
  profileCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
    marginBottom: 10,
  },
  profileImageContainer: {
    marginRight: 20,
    borderRadius: 50,
    overflow: 'hidden',
    width: 100,
    height: 100,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.WHITE,
    marginVertical: 5,
  }
})