import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import appName from '../../constants/constants'
import colors from '../../constants/colors'
import { useSelector } from 'react-redux'

const Header = () => {
  const user = useSelector(state => state.auth.user)
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{appName}</Text>
      <View style={{ width: 40, height: 40, margin: 10 }}>
        <Image
          style={styles.avatarImage}
          source={user?.profilePicURL ? { uri: user.profilePicURL } : { uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }}
        />
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // elevation:1,
    paddingLeft: 20,
    borderRadius: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.PRIMARY
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    borderRadius: 20
  }
})