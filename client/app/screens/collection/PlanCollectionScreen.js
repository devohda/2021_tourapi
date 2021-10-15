import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TextInput,
    Pressable,
    FlatList,
    Modal,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import RBSheet from 'react-native-raw-bottom-sheet';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import ScreenContainerView from '../../components/ScreenContainerView';

import { tipsList } from '../../contexts/TipsListContextProvider';
import {useToken} from '../../contexts/TokenContextProvider';
import { updatedList } from '../../contexts/UpdatedListContextProvider';

import TipsList from './TipsList';
import DragAndDropList from './DragAndDropList';
import ShowPlaces from './ShowPlaces';

import Jewel from '../../assets/images/jewel.svg';
import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';
import DefaultProfile from '../../assets/images/profile_default.svg';

import moment from 'moment';
import 'moment/locale/ko';
import * as SecureStore from 'expo-secure-store';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PlanCollectionScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const {data} = route.params;
    const [collectionData, setCollectionData] = useState({});
    const [placeData, setPlaceData] = useState([]);
    const [commentsData, setCommentsData] = useState([]);
    const [placeLength, setPlaceLength] = useState(0);
    const [tmpData, setTmpData] = tipsList();
    const [updatedData, setUpdatedData] = updatedList();
    const [isEditPage, setIsEditPage] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [planDays, setPlanDays] = useState([]);
    const [keywords, setKeywords] = useState([]);

    const isFocused = useIsFocused();
    const [isLimited, setIsLimited] = useState(false);

    const [token, setToken] = useToken();
    const [userData, setUserData] = useState({});
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const refRBSheet = useRef();
    const [replacementData, setReplacementData] = useState([]);
    const [alertDuplicated, setAlertDuplicated] = useState(false);

    const isDeleted = (deletedData) => {
        setIsDeletedOrigin(deletedData);
    };

    const isCommentPosted = (postedCommentMapPk, postedComment) => {
        //map pk랑 comment
        setIsPostedCommentMapPk(postedCommentMapPk);
        setIsPostedComment(postedComment);
    };

    const isCommentEdited = (editedCommentMapPk, editedComment) => {
        //map pk랑 comment
        setIsEditedCommentMapPk(editedCommentMapPk);
        setIsEditedComment(editedCommentMapPk);
    };

    const isCommentDeleted = (deletedCommentData) => {
        setIsDeletedComment(deletedCommentData);
    };

    const isReplacementGotten = (gottenReplacementData) => {
        setIsGottenReplacementMapPk(gottenReplacementData);
    };

    const isReplacementDeleted = (deletedReplacementData) => {
        console.log(deletedReplacementData);
        setIsDeletedReplacement(deletedReplacementData);
    };

    const getUserData = () => {
        try {
            fetch('http://34.64.185.40/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setUserData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getInitialCollectionData();
        getInitialPlaceData();
        getCollectionCommentsData();

        setTmpData([{
            day: 1,
            places : [
                {
                    id: 1,
                    tip: '근처에 xxx파전 맛집에서 막걸리 한잔 캬',
                },
                {
                    id: 2,
                    tip: '두번째 팁'
                },
                {
                    id: 3,
                    tip: '근처에 xxx파전 맛집에서 막걸리 한잔 캬',
                },
                {
                    id: 4,
                    tip: '네번째 팁'
                }
            ]
        }, {
            day: 2,
            places: [
                {
                    id: 1,
                    tip: '와웅',
                },
                {
                    id: 2,
                    tip: '두번째 팁'
                }  
            ]
        }
        ]);

        getUserData();
    }, [isFocused]);

    const getInitialCollectionData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setCollectionData(response.data);
                    setStartDate(response.data.collection_start_date.split('T')[0]);
                    setEndDate(response.data.collection_end_date.split('T')[0]);
                    setKeywords(response.data.keywords);

                    // console.log(response.data)
                    var gap = moment(response.data.collection_end_date.split('T')[0]).diff(moment(response.data.collection_start_date.split('T')[0]), 'days');
                    var newArr = [];
                    for(var i=0;i<=gap;i++) {
                        newArr.push({
                            id: i,
                            days: moment(response.data.collection_start_date.split('T')[0]).add(i, 'd').format('YYYY.MM.DD')
                        });
                    }
                    setPlanDays(newArr);
                    setFalse(newArr);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getInitialPlaceData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/places`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then(res => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setPlaceData(response.data.placeList);
                    var exceptLength = 0;
                    for(let i = 0; i < response.data.placeList.length; i++) {
                        if(response.data.placeList[i].place_pk === -1 || response.data.placeList[i].place_pk === -2) exceptLength += 1;
                    }
                    setPlaceLength(response.data.placeList.length - exceptLength);

                    var pressed = [];
                    for (let i = 0; i < placeLength; i++) {
                        pressed.push(false);
                    }
                    setIsPress(pressed);
                    setDeletedData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getCollectionCommentsData = () => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    setCommentsData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const postCollectionCommentsData = (comment) => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}/comments`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: comment
                })
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getCollectionCommentsData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkDeletedPlace = () => {
        for(var i=0;i<isDeletedOrigin.length;i++) {
            if(isDeletedOrigin[i] === true) {
                // console.log(placeData[i]);
                deletePlace(placeData[i].cpm_map_pk, placeData[i].cpm_plan_day);
            }
        }
        for(var i=0;i<isDeletedComment.length;i++) {
            if(isDeletedComment[i] !== false) {
                deletePlaceComment(placeData[i].cpm_map_pk, isDeletedComment[i]);
            }
        }
    };

    const checkDeletedReplacement = () => {
        for(var i=0;i<isDeletedComment.length;i++) {
            if(isDeletedComment[i] !== false) {
                deleteReplacement(placeData[i].cpm_map_pk, isDeletedComment[i]);
            }
        }
    };

    const deletePlace = (map_pk, day) => {
        // 공간 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${map_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkTrue = () => {
        if (collectionData.collection_private) return true;
        return false;
    };

    const checkPrivate = () => {
        if (collectionData.is_creator) return true;
        return false;
    };

    const [isPress, setIsPress] = useState([]);
    const setFalse = (data) => {
        var pressed = [];
        for (let i = 0; i < data.length; i++) {
            pressed.push(false);
        }
        setIsLimited(pressed);
    };
    const deleteCollection = (refRBSheet) => {
        try {
            fetch(`http://34.64.185.40/collection/${data.collection_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    Alert.alert('', '삭제되었습니다.', [
                        {text : 'OK', onPress: () => {
                            navigation.goBack();
                            refRBSheet.current.close();
                        }}]);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const LikeCollection = () => {
        //보관함 좋아요
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const DeleteLikedCollection = () => {
        //보관함 좋아요 삭제
        try {
            fetch(`http://34.64.185.40/like/collection/${collectionData.collection_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async (response) => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialCollectionData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const postPlaceComment = (mapPk, addedComment) => {
        //한줄평 등록
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${mapPk}/comment`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: addedComment,
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const putPlaceComment = (mapPk, editedComment) => {
        //한줄평 수정
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${mapPk}/comment`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    comment: editedComment,
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deletePlaceComment = (cpmMapPk, deletedComment) => {
        //한줄평 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/comment`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: {
                    comment: deletedComment
                }
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getInitialPlaceData();
                    
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const getReplacement = (cpmMapPk) => {
        console.log(cpmMapPk);
        //대체공간 불러오기
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/replacements`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }
console.log(response.data)
                    setReplacementData(response.data);
                    setDeletedReplacementData(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const setDeletedReplacementData = (data) => {
        var newArr = [];
        for(var i=0;i<data.length;i++) {
            newArr.push(false);
        }
        setIsDeletedReplacement(newArr);
    };

    const postReplacement = (mapPk, placePk, prev) => {
        //대체공간 추가
        // console.log(replacementData.length+prev+1);
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${mapPk}/replacement`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    order: replacementData.length+prev+1,
                    placeId: placePk
                })
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    // getInitialPlaceData();
                    getReplacement(mapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const putReplacement = (cpmMapPk, editedComment) => {
        //대체공간 수정
        // replacementPlaceList : 추후
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/replacement/place`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: {
                    replacementPlaceList : replacementPlaceList
                }
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getReplacement(cpmMapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deleteReplacement = (cpmMapPk, place_pk) => {
        //대체공간 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/replacement/${place_pk}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getReplacement(cpmMapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };
    
    const deleteAllReplacement = (cpmMapPk) => {
        //대체공간 자체를 삭제
        try {
            fetch(`http://34.64.185.40/collection/${collectionData.collection_pk}/place/${cpmMapPk}/replacements`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
            }).then((res) => res.json())
                .then(async response => {
                    if (response.code === 405 && !alertDuplicated) {
                        Alert.alert('', '다른 기기에서 로그인했습니다.');
                        setAlertDuplicated(true);
                    }

                    if (parseInt(response.code / 100) === 4) {
                        await SecureStore.deleteItemAsync('accessToken');
                        setToken(null);
                        setIsSignedIn(false);
                        return;
                    }

                    getReplacement(cpmMapPk);
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const Keyword = props => {
        return (
            <AppText style={{color: colors.gray[2], fontSize: 10, marginEnd: 8}}># {props.keyword}</AppText>
        );
    };

    //공간 삭제
    const [isDeletedOrigin, setIsDeletedOrigin] = useState([]);

    //한줄평 추가 : map Pk, 코멘트
    const [isPostedCommentMapPk, setIsPostedCommentMapPk] = useState(0);
    const [isPostedComment, setIsPostedComment] = useState('');

    //한줄평 수정 : map Pk, 코멘트
    const [isEditedCommentMapPk, setIsEditedCommentMapPk] = useState(0);
    const [isEditedComment, setIsEditedComment] = useState('');

    //대체공간 가져오기 : map Pk
    const [isGottenReplacementMapPk, setIsGottenReplacementMapPk] = useState(0);

    //한줄평 삭제, 대체공간 삭제
    const [isDeletedComment, setIsDeletedComment] = useState([]);
    const [isDeletedReplacement, setIsDeletedReplacement] = useState([]);

    const setDeletedData = (data) => {
        var newArr = [];
        for(var i=0;i<data.length;i++) {
            newArr.push(false);
        }
        setIsDeletedOrigin(newArr);
        setIsDeletedComment(newArr);
    };

    const SwipeList = props => {
        return (
            <SafeAreaView>
                <FlatList data={placeData}
                    renderItem={({item, index}) => <ShowPlaces day={props.idx} item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} comment={item.comment} navigation={navigation} length={placeLength} private={collectionData.is_creator} pk={collectionData.collection_pk} navigation={navigation} originData={placeData} isDeleted={isDeleted} isDeletedOrigin={isDeletedOrigin} isLimited={isLimited[props.idx]}
                        isCommentPosted={isCommentPosted} isPostedCommentMapPk={isPostedCommentMapPk} isPostedComment={isPostedComment}
                        isCommentEdited={isCommentEdited} isEditedCommentMapPk={isEditedCommentMapPk} isEditedComment={isEditedComment}
                        isCommentDeleted={isCommentDeleted} isDeletedComment={isDeletedComment}
                        isReplacementGotten={isReplacementGotten} isGottenReplacementMapPk={isGottenReplacementMapPk}
                        isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement} setDeletedReplacementData={setDeletedReplacementData}
                        postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment}
                        postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} replacementData={replacementData}
                    />}
                    keyExtractor={(item, idx) => {idx.toString();}}
                    key={(item, idx) => {idx.toString();}}
                    nestedScrollEnabled/>

            </SafeAreaView>
        );};

    const EditList = props => (
        // <View></View>
        // <DragAndDropList data={placeData} idx={props.idx} isEditPage={isEditPage} isPress={isPress} key={props.idx}/>
        <SafeAreaView>
            <FlatList data={placeData}
                renderItem={({item, index}) => <ShowPlaces day={props.idx} item={item} index={index} key={index} isEditPage={isEditPage} isPress={isPress} comment={item.comment} navigation={navigation} length={placeLength} private={collectionData.is_creator} pk={collectionData.collection_pk} navigation={navigation} originData={placeData} isDeleted={isDeleted} isDeletedOrigin={isDeletedOrigin} isLimited={isLimited[props.idx]}
                    isCommentPosted={isCommentPosted} isPostedCommentMapPk={isPostedCommentMapPk} isPostedComment={isPostedComment}
                    isCommentEdited={isCommentEdited} isEditedCommentMapPk={isEditedCommentMapPk} isEditedComment={isEditedComment}
                    isCommentDeleted={isCommentDeleted} isDeletedComment={isDeletedComment}
                    isReplacementGotten={isReplacementGotten} isGottenReplacementMapPk={isGottenReplacementMapPk}
                    isReplacementDeleted={isReplacementDeleted} isDeletedReplacement={isDeletedReplacement} checkDeletedReplacement={checkDeletedReplacement} setDeletedReplacementData={setDeletedReplacementData}
                    postPlaceComment={postPlaceComment} putPlaceComment={putPlaceComment}
                    postReplacement={postReplacement} getReplacement={getReplacement} getInitialPlaceData={getInitialPlaceData} replacementData={replacementData}
                />}
                keyExtractor={(item, idx) => {idx.toString();}}
                key={(item, idx) => {idx.toString();}}
                nestedScrollEnabled/>
        </SafeAreaView>
    );

    const ShowDays = ({item, index}) => {
        const idx = index;
        const checkLength = () => {
            var placeLengthInDay = 0;
            for(var i=0;i<placeData.length;i++) {
                if(idx === 0) {
                    if((placeData[i].cpm_plan_day === -1 || placeData[i].cpm_plan_day === idx)&& placeData[i].place_pk != -1 && placeData[i].place_pk != -2) {
                        placeLengthInDay += 1;
                    }
                }
                else {
                    if(placeData[i].cpm_plan_day === idx && placeData[i].place_pk != -1 && placeData[i].place_pk != -2) {
                    // console.log(placeData[i])
                        placeLengthInDay += 1;
                    }
                }
            }
            return placeLengthInDay;
        };
        return (
            <>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View>
                                <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '700'}}>Day {idx+1}</AppText>
                            </View>
                            <View style={{marginStart: 8}}>
                                <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '400'}}>{item.days}</AppText>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={()=>navigation.navigate('SearchForAdd', {pk: collectionData.collection_pk, placeData: placeData, day : idx, replace: false})}
                                style={!collectionData.is_creator && {display: 'none'}}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon type="ionicon" name={'add-outline'} size={18} color={colors.mainColor} />
                                    <AppText style={{color: colors.mainColor, fontSize: 14, lineHeight: 22.4, fontWeight: '700'}}>공간 추가하기</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {!isEditPage ? <SwipeList idx={idx} key={idx}/> : <EditList idx={idx} key={idx}/>}
                {checkLength() > 5 && !isEditPage && <TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 16,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        { !isLimited[idx] ?
                            <TouchableOpacity onPress={()=>{
                                var newArr = [...isLimited];
                                newArr[idx] = true;
                                setIsLimited(newArr);
                            }}
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <AppText style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    color: colors.gray[2]
                                }}>전체보기</AppText>
                                <Image source={require('../../assets/images/showWhole_forDir.png')}
                                    style={{
                                        width: 15,
                                        height: 15,
                                        marginLeft: 10,
                                        marginBottom: 5
                                    }}></Image>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={()=>{
                                var newArr = [...isLimited];
                                newArr[idx] = false;
                                setIsLimited(newArr);
                            }}
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <AppText style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    color: colors.gray[2]
                                }}>닫기</AppText>
                                <Image source={require('../../assets/images/showWhole_forDir.png')}
                                    style={{
                                        width: 15,
                                        height: 15,
                                        marginLeft: 10,
                                        marginTop: 7,
                                        transform: [{rotate: '180deg'}]
                                    }}></Image>
                            </TouchableOpacity>
                        }
                    </View>
                </TouchableOpacity>}
            </>
        );
    };

    const [showMenu, setShowMenu] = useState(false);
    const [deleteMenu, setDeleteMenu] = useState(false);

    const list = [
        { 
            title: '공간 수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        { 
            title: '보관함 정보수정',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        { 
            title: '보관함 공유',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.mainColor, fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
        {
            title: '보관함 삭제',
            containerStyle: { backgroundColor: colors.backgroundColor },
            titleStyle: { color: colors.red[3], fontSize: 16, fontWeight: '500', lineHeight: 25.6 },
        },
    ];

    const DeleteModal = props => (
        <Modal
            transparent={true}
            visible={deleteMenu}
            onRequestClose={() => {
                setDeleteMenu(!deleteMenu);
                props.refRBSheet.current.close();
            }}
        >
            <View style={styles.centeredView}>
                <View style={{...styles.modalView, backgroundColor: colors.backgroundColor}}>
                    <AppText style={{...styles.modalText, color: colors.blue[1]}}>보관함을 삭제할까요?</AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.gray[4]}}
                            onPress={() => {
                                props.refRBSheet.current.close();
                                setDeleteMenu(!deleteMenu);
                            }}
                        >
                            <AppText style={styles.textStyle}>취소하기</AppText>
                        </Pressable>
                        <Pressable
                            style={{...styles.button, backgroundColor: colors.mainColor}}
                            onPress={() => {
                                setDeleteMenu(!deleteMenu);
                                deleteCollection(props.refRBSheet);
                            }}
                        >
                            <AppText style={styles.textStyle}>삭제하기</AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const setDate = () => {
        if(Object.keys(collectionData).length === 0 && collectionData.constructor === Object) return '';
        else {
            //년도가 다를 경우
            if(parseInt(startDate.split('-')[0]) !== parseInt(endDate.split('-')[0])) {
                return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('YYYY.MM.DD')}`;
            }
            //월이 다를 경우
            if(parseInt(startDate.split('-')[1]) !== parseInt(endDate.split('-')[1])) {
                return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('MM.DD')}`;
            }
            //일이 다를 경우
            if(parseInt(startDate.split('-')[2]) !== parseInt(endDate.split('-')[2])) {
                return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}-${moment(endDate.split('T')[0]).format('DD')}`;
            }
            //시작일과 종료일이 같을 경우
            else return `${moment(startDate.split('T')[0]).format('YYYY.MM.DD')}`;
        }
    };

    const setBGColor = (idx) => {
        if (idx === 0 || idx === 2) {
            return colors.red[3];
        } else if (idx === 1 || idx === 6) {
            return '#FFC36A';
        } else if (idx === 3 || idx === 8) {
            return '#639A94';
        } else if (idx === 4 || idx === 5) {
            return colors.blue[2];
        } else {
            return '#8F6DA4';
        }
    };

    const ShowComments = props => {
        const { data, idx } = props;
        return (
            <>
                <View flexDirection="row" style={{flex: 1, alignItems: 'flex-start'}}>
                    <View style={{...styles.authorImage, backgroundColor: setBGColor(idx)}}>
                        <DefaultProfile width={36} height={36}/>
                    </View>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                            flexWrap: 'wrap'
                        }}>
                            <AppText style={{color: colors.mainColor, fontSize: 12}}>{data.user_nickname}</AppText>
                            <AppText style={{
                                marginHorizontal: 8,
                                color: colors.gray[5],
                                fontSize: 10
                            }}>|</AppText>
                            <AppText style={{color: colors.gray[4], fontSize: 12}}>{moment(data.cc_create_time).format('YY.MM.DD')}</AppText>
                        </View>
                        <View style={{flex: 1, width: '100%'}}><AppText style={{
                            fontSize: 12,
                            color: colors.mainColor,
                            lineHeight: 16,
                            fontWeight: '700',
                            flexWrap: 'wrap',
                            width: windowWidth - 100
                        }}>{data.collection_comment}
                        </AppText></View>
                    </View>
                </View>

                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.red_gray[6],
                    zIndex: -1000,
                    marginVertical: 12
                }}></View>
            </>
        );
    };

    const ShowCollectionComments = () => {
        const [comments, setComments] = useState('');
        return (
            <View flex={1} style={{marginVertical: 20, justifyContent: 'flex-end'}}>
                <View flexDirection="row" style={{...styles.comment_box, borderColor: colors.gray[5]}}>
                    <TextInput flex={1} style={{fontSize: 16}}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="보관함에 댓글을 남겨보세요!"
                        value={comments}
                        placeholderTextColor={colors.gray[5]}
                        onChangeText={(text)=>setComments(text)}
                        onSubmitEditing={()=>{
                            if(comments !== '') {
                                setComments(comments);
                                postCollectionCommentsData(comments);
                            }
                            setComments('');
                        }}
                    />
                    <Pressable style={{marginLeft: 5}} onPress={()=>{
                        if(comments !== '') {
                            setComments(comments);
                            postCollectionCommentsData(comments);
                        }
                        setComments('');
                    }}>
                        <Icon style={{color: colors.gray[5], marginTop: 3, marginRight: 2}} type="ionicon"
                            name={'pencil'} size={16}></Icon>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: 20,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <TouchableOpacity onPress={() => {
                        if(data.now) {
                            if(isEditPage) setIsEditPage(false);
                            else navigation.pop(2);
                        }
                        else {
                            if(isEditPage) setIsEditPage(false);
                            else navigation.goBack();
                        }}}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                {checkPrivate() && <>
                    {
                        !isEditPage ?
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    style={{flex: 1, height: '100%'}} onPress={() => {
                                        refRBSheet.current.open();
                                    }}>
                                    <MoreIcon style={{color: colors.mainColor}}/>
                                </TouchableOpacity>
                                <RBSheet
                                    ref={refRBSheet}
                                    closeOnDragDown={true}
                                    closeOnPressMask={true}
                                    height={250}
                                    customStyles={{
                                        wrapper: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        },
                                        draggableIcon: {
                                            display: 'none'
                                        },
                                        container: {
                                            borderTopLeftRadius: 10,
                                            borderTopRightRadius: 10,
                                            backgroundColor: colors.yellow[7],
                                            paddingTop: 10
                                        }
                                    }}
                                >
                                    {list.map((l, i) => (
                                        <TouchableOpacity onPress={()=>{
                                            if(i === 0) {
                                                setIsEditPage(true);
                                            }
                                            if(i === 1) {
                                                refRBSheet.current.close();
                                                navigation.navigate('MakePlanCollection', {data: collectionData, update: true});
                                            }
                                            if(i === 3) {
                                                setDeleteMenu(true);
                                            }
                                        }}>
                                            <View key={i} style={{marginLeft: 20, marginVertical: 11.5}}>
                                                <AppText style={l.titleStyle}>{l.title}</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <DeleteModal refRBSheet={refRBSheet}/>
                                </RBSheet>
                            </View> :
                            <View style={{position: 'absolute', right: 0}}>
                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{flex: 1, height: '100%'}}
                                    onPress={() => {
                                        setIsEditPage(false);
                                        isDeleted(isDeletedOrigin);
                                        isCommentDeleted(isDeletedComment);
                                        checkDeletedPlace();
                                    }}>
                                    <View>
                                        <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 19.2, fontWeight: '700'}}>완료</AppText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }</>}
            </View>

            <ScrollView>
                <ScreenContainerView>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8
                    }}>
                        <View
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={[styles.dirType,
                                {
                                    borderColor: colors.defaultColor,
                                    backgroundColor: colors.defaultColor,
                                    shadowColor: colors.red[8]
                                }]}>
                                <AppText style={{...styles.dirFreeText, color: colors.red[3]}}>일정</AppText>
                            </View>
                            {
                                keywords.map((keyword, idx) => (
                                    <Keyword keyword={keyword} key={idx} />
                                ))
                            }
                        </View>
                        <View>
                            {checkTrue() &&
                            <Image source={require('../../assets/images/lock_forDir.png')}
                                style={{width: 22, height: 22}}></Image>}
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                            <AppText style={{color: colors.blue[1], fontSize: 16, lineHeight: 25.6, fontWeight: '500'}}>
                                {setDate()}
                            </AppText>
                            <AppText style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: colors.mainColor
                            }}>{collectionData.collection_name}</AppText>
                            <AppText style={{
                                fontSize: 12,
                                fontWeight: '400',
                                color: colors.gray[2],
                                lineHeight: 19.2,
                                marginTop: 12
                            }}>by. {collectionData.created_user_name}</AppText>
                        </View>
                        {
                            userData.user_nickname !== collectionData.created_user_name &&
                           <TouchableOpacity onPress={() => {
                               if (collectionData.like_flag) {
                                   DeleteLikedCollection();
                               } else {
                                   LikeCollection();
                               }
                           }}>
                               <View style={{
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   marginVertical: 5
                               }}>
                                   <Jewel width={26} height={21}
                                       style={collectionData.like_flag ? {color: colors.red[3]} : {color: colors.red_gray[3]}}/>
                                   <AppText style={{
                                       fontSize: 10,
                                       fontWeight: '700',
                                       color: collectionData.like_flag ? colors.red[3] : colors.red_gray[3],
                                       marginTop: 2
                                   }}>{collectionData.like_cnt}</AppText>
                               </View>
                           </TouchableOpacity>
                        }
                    </View>
                </ScreenContainerView>

                <View style={{marginTop: 20}}>
                    {/* <Image source={require('../../assets/images/map_tmp.png')} style={{width: '100%', height: 201}}/> */}
                    
                    <View>
                        <MapView style={{width: Dimensions.get('window').width, height: 200}}
                            initialRegion={{
                                latitude: 37.56633546113615,
                                longitude: 126.9779482762618,
                                latitudeDelta: 0.0015,
                                longitudeDelta: 0.0015,
                            }}
                        ><Marker coordinate={{
                                latitude: 37.56633546113615,
                                longitude: 126.9779482762618
                            }}
                            title="서울시청"
                            description="기본값입니다"/>
                        </MapView>
                    </View>
                </View>

                <ScreenContainerView>
                    <View style={{marginTop: 16}}>
                        <View style={{marginBottom: 16}}>
                            <AppText style={{color: colors.gray[4]}}>총 <AppText
                                style={{fontWeight: '700'}}>{placeLength}개</AppText> 공간</AppText>
                        </View>
                        <SafeAreaView>
                            {/* {
                                            placeData.length > 5 ?
                                        } */}
                            {/* {collectionData.place.map((item, idx) =>(
                                            <ShowPlaces item={item} idx={idx} key={idx}/>
                                        ))} */}
                            {/* <FlatList data={collectionData.places} renderItem={ShowPlaces}
                                                keyExtractor={(item) => item.place_pk.toString()}
                                                nestedScrollEnabled/> */}
                            <FlatList data={planDays} renderItem={ShowDays}
                                keyExtractor={(item, index) => index.toString()}
                                key={(item, index) => index.toString()}
                                nestedScrollEnabled/>
                        </SafeAreaView>
                    </View>
                </ScreenContainerView>

                <ScreenDivideLine style={{marginVertical: 16}}/>

                <ScreenContainerView flex={1}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AppText style={{...styles.titles, color: colors.mainColor}}>댓글</AppText>
                        <AppText style={{
                            color: colors.gray[3],
                            fontSize: 14,
                            marginStart: 11,
                            marginTop: 5
                        }}>총 <AppText style={{fontWeight: '700'}}>{commentsData.length}개</AppText></AppText>
                    </View>
                </ScreenContainerView>

                <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScreenContainerView flex={1}>
                        <ShowCollectionComments />
                        {
                            commentsData.length !== 0 &&
                            <View style={{marginTop: 4}}>{
                                commentsData.map((data, idx) => (
                                    <ShowComments data={data} key={idx} idx={idx}/>
                                ))
                            }</View>
                        }
                    </ScreenContainerView>
                </KeyboardAvoidingView>
            </ScrollView>
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    titles: {
        fontSize: 20,
        // marginLeft: '5%',
        fontWeight: 'bold'
    },
    dirType: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 8,
        marginEnd: 8,
        borderRadius: 14,
        width: 43,
        height: 22,
        flexDirection: 'row',
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 1},
        elevation: 1
    },
    dirFreeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewImage: {
        width: 56,
        height: 56,
        borderRadius: 50,

    },
    comment_box: {
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },

    //swipe style
    rowBackTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '50%'
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 75,
        right: 0
    },

    //drag and sort style
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_children: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    item_icon: {
        marginLeft: 15,
        resizeMode: 'contain',
    },
    item_text: {
        marginRight: 55,
        color: 'black'
    },

    //modal example
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150
    },
    button: {
        borderRadius: 10,
        marginHorizontal: 9.5,
        marginTop: 26,
        width: 108,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '500'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22.4,
        fontWeight: '700'
    },
    authorImage: {
        width: 44,
        height: 44,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
});

export default PlanCollectionScreen;