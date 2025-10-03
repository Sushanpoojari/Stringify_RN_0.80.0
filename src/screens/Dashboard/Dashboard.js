import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { userAPI } from '../../api/userAPI/userAPI';
import colors from '../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import CustomCodeEditor from '../components/CodeEditor';
import Posts from './components/Posts';
import { fetchDashboardData } from '../../redux/slices/postSlice';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const pageNumber = useRef(1);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.posts);

 useEffect(() => {
  dispatch(fetchDashboardData({ userId: user?._id, pageNumber: pageNumber.current, pageSize: 10 }))
 }, [pageNumber])
 

  return (
    <View>
      <Header />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
        </View>
      ) : (
        <Posts postData={posts?.data} />
      )}
    </View>
  );
}

export default Dashboard

const styles = StyleSheet.create({})