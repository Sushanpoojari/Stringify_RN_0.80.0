import React from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome';

const CodeEditorHeader = () => {
  return (
    <View style={{ flexDirection: 'row', height: 25, alignItems: 'center' }}>
      <FontAwesome6 name="circle" size={20} color={'#ff735aff'} style={{ marginRight: 5 }} />
      <FontAwesome6 name="circle" size={20} color={'#ffbb00ff'} style={{ marginRight: 5 }} />
      <FontAwesome6 name="circle" size={20} color={'#24AB00'} style={{ marginRight: 5 }} />
    </View>
  );
};

const CustomCodeEditor = ({ codeToBeDisplayed, isReadOnly = false, setCode = () => {} }) => {
  const formattedCode = codeToBeDisplayed ? codeToBeDisplayed.split("\\n") : [];

  return (
    <SafeAreaView style={styles.container}>
      <CodeEditorHeader />

      <TextInput
        value={formattedCode.join("\n")}
        onChangeText={setCode}
        multiline
        scrollEnabled={true}      
        style={[
          styles.codeInput,
          { height: isReadOnly ? 200 : 300 }
        ]}
        placeholder=" Write your code here"
        placeholderTextColor="#888"
        cursorColor={colors.PRIMARY}
        textAlignVertical="top"
        editable={true} 
        showSoftInputOnFocus={!isReadOnly} 
      />
      <View style={{ height: 5 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 8,
  },
  codeInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    borderRadius: 8,
    padding: 10,
  },
});

export default CustomCodeEditor;
