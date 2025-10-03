import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './components/Header'
import colors from '../../constants/colors'
import Auth from './components/Login'

const LoginAndSignup = () => {
  return (
    <View style={{ backgroundColor: colors.PRIMARY, flex: 1 }}>
      <Header />
      <Auth />
    </View>
  )
}

export default LoginAndSignup

const styles = StyleSheet.create({})