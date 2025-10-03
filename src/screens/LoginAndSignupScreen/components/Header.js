import { View, Text, Image } from 'react-native'
import React from 'react'
import colors from '../../../constants/colors'

const Header = () => {
  return (
    <View style={{height:"25%",alignItems:'center',justifyContent:'center'}}>
      <Image source={require("../../../assets/images/Stringify.png")} style={{height:150,width:200}}/>
    </View>
  )
}

export default Header