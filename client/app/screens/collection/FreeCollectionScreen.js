import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform,
    TextInput,
    Pressable,
    FlatList
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import styled from 'styled-components/native';
import {Icon} from 'react-native-elements';

// import MapView, {Marker} from 'react-native-maps';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import NavigationTop from '../../components/NavigationTop';
import ScreenDivideLine from '../../components/ScreenDivideLine';
import {useIsUserData} from '../../contexts/UserDataContextProvider';
import Jewel from '../../assets/images/jewel.svg';
import ScreenContainerView from '../../components/ScreenContainerView';
import BackIcon from '../../assets/images/back-icon.svg';
import MoreIcon from '../../assets/images/more-icon.svg';

const windowWidth = Dimensions.get('window').width;

const FreeCollectionScreen = ({route, navigation}) => {
    const {colors} = useTheme();
    const {data} = route.params;
    const [userData, setUserData] = useIsUserData();
    const [collectionData, setCollectionData] = useState({});
    const [placeData, setPlaceData] = useState([]);
    const [placeLength, setPlaceLength] = useState(0);
    const [isLimited, setIsLimited] = useState(true);
    const [isTrue, setIsTrue] = useState(false);

    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = () => {
        try {
            fetch(`http://34.146.140.88/collection/${data.collection_pk}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData.user_pk,
                })
            }).then((res) => res.json())
                .then((response) => {
                    setCollectionData(response.data);
                    setPlaceLength(response.data.places.length);
                    setFalse();
                    setIsTrue(userData.user_pk === data.user_pk && collectionData.collection_private === 0);

                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const checkTrue = () => {
        if (userData.user_pk === data.user_pk && collectionData.collection_private === 0) return false;
        return true;
    };

    const [isPress, setIsPress] = useState([]);
    const setFalse = () => {
        var pressed = [];
        for (let i = 0; i < placeLength; i++) {
            pressed.push(false);
        }
        setIsPress(pressed);
    };

    const likePlace = (pk) => {
        try {
            fetch('http://34.146.140.88/like/place', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData.user_pk,
                    placeId: pk,
                })
            }).then((res) => res.json())
                .then((response) => {
                    // console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const deletePlace = (pk) => {
        try {
            fetch('http://34.146.140.88/like/place', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData.user_pk,
                    placeId: pk,
                })
            }).then((res) => res.json())
                .then((response) => {
                    // console.log(response)
                })
                .catch((err) => {
                    console.error(err);
                });

        } catch (err) {
            console.error(err);
        }
    };

    const InputBox = styled(TextInput)`
      fontSize: 16px;
      borderBottomWidth: 1px;
      borderBottomColor: #C5C5C5;
      paddingBottom: 11px;
    `;
    const Keyword = ({item}) => {
        return (
            <AppText style={{color: colors.gray[2], fontSize: 10, marginEnd: 8}}># {item}</AppText>
        );
    };

    const checkType = (type) => {
        if (type === 12) {
            return '관광지';
        } else if (type === 14) {
            return '문화시설';
        } else if (type === 15) {
            return '축제/공연/행사';
        } else if (type === 28) {
            return '레포츠';
        } else if (type === 32) {
            return '숙박';
        } else if (type === 38) {
            return '쇼핑';
        } else if (type === 39) {
            return '음식';
        } else {
            return '기타';
        }
    };


    const ShowPlaces = ({item, index}) => {
        return (
            <>
                {item.place_pk !== collectionData.places[0].place_pk && <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.red_gray[6],
                    zIndex: -1000,
                    marginVertical: 13
                }}></View>}

                <View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Place', {data: item})}>
                            <View style={{flexDirection: 'row', width: '90%'}}>
                                <Image source={{uri: item.place_img}}
                                    style={{width: 72, height: 72, borderRadius: 15}}></Image>
                                <View style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '78%'
                                }}>
                                    <View style={{marginLeft: 8, marginTop: '2%'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{checkType(item.place_type)}</AppText>
                                            <AppText style={{
                                                marginHorizontal: 4, color: colors.gray[7],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>|</AppText>
                                            <Image source={require('../../assets/images/review_star.png')}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    alignSelf: 'center',
                                                    marginTop: '1%'
                                                }}></Image>
                                            <AppText style={{
                                                color: colors.gray[3],
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                marginLeft: 2
                                            }}>4.8</AppText>
                                        </View>
                                        <View style={{width: '100%'}}>
                                            <AppText style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.mainColor,
                                                marginVertical: 5,
                                            }}>{item.place_name}</AppText>
                                        </View>
                                        <AppText
                                            style={{fontSize: 12, color: colors.gray[4]}}>{item.place_addr}</AppText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {/* {item.like_flag === 0 ?  */}
                            <TouchableOpacity onPress={() => {
                                let newArr = [...isPress];
                                if (newArr[index]) {
                                    newArr[index] = false;
                                    setIsPress(newArr);
                                    deletePlace(item.place_pk);
                                } else {
                                    // for(let i=0;i<newArr.length;i++) {
                                    //     if(i == index) continue;
                                    //     else newArr[i] = false;
                                    // }
                                    newArr[index] = true;
                                    setIsPress(newArr);
                                    likePlace(item.place_pk);
                                }
                            }}>
                                <Jewel width={26} height={21}
                                    style={{color: isPress[index] ? colors.red[3] : colors.red_gray[5]}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: colors.defaultColor,
                        height: 30,
                        paddingVertical: 6,
                        paddingLeft: 6,
                        paddingRight: 5,
                        marginBottom: 6,
                        marginRight: 10,
                        marginTop: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={require('../../assets/images/tipIcon.png')}
                                style={{width: 12, height: 12, marginEnd: 8}}></Image>
                            <AppText style={{color: colors.blue[1], fontSize: 14}}>근처에 xxx파전 맛집에서 막걸리 한잔 캬</AppText>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 28, height: 28}}
                                source={require('../../assets/images/default_profile_2.png')}></Image>
                        </View>
                    </View>
                </View>
            </>
        );
    };

    const [showMenu, setShowMenu] = useState(false);

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            {showMenu && (
                <View style={{
                    position: 'absolute',
                    width: 140,
                    height: 80,
                    top: 50,
                    right: 60,
                    backgroundColor: '#fff',
                    flex: 1,
                    borderRadius: 10,
                    zIndex: 100000000,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,

                    overflow: 'visible'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            // 수정 코드
                        }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}><AppText>수정</AppText>
                    </TouchableOpacity>
                    <View style={{
                        height: 1,
                        borderColor: colors.gray[5],
                        borderWidth: 0.4,
                        borderRadius: 1,
                    }}></View>
                    <TouchableOpacity
                        onPress={() => {
                            // 삭제 코드
                        }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}><AppText>삭제</AppText></TouchableOpacity>
                </View>
            )}

            <View flexDirection="row" style={{
                height: 24,
                marginBottom: 20,
                marginTop: 20,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{position: 'absolute', left: 0}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', right: 0}}>
                    <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        style={{flex: 1, height: '100%'}} onPress={() => setShowMenu(state => !state)}>
                        <MoreIcon style={{color: colors.mainColor}}/>
                    </TouchableOpacity>
                </View>
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
                                <AppText style={{...styles.dirFreeText, color: colors.mainColor}}>자유</AppText>
                            </View>
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
                            <AppText style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: colors.mainColor
                            }}>{data.collection_name}</AppText>
                        </View>
                        {
                            userData.user_pk !== data.user_pk &&
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20
                            }}>
                                <Image source={require('../../assets/images/here_click.png')}
                                    style={{width: 26, height: 21, marginBottom: 2}}></Image>
                                <AppText style={{
                                    fontSize: 10,
                                    fontWeight: '700',
                                    color: colors.red[3]
                                }}>1,820</AppText>
                            </View>
                        }
                    </View>
                    <View style={{marginTop: '10%'}}>
                        <View style={{flexDirection: 'row', position: 'relative', alignItems: 'center'}} flex={1}>
                            {/* 여기에는 받은 유저 프로필만 넣고, +2 부분에는 전체 인원수-3명으로 퉁 치기 */}
                            <View style={{zIndex: 0, flex: 1, position: 'absolute'}}><Image
                                style={{width: 60, height: 60}}
                                source={require('../../assets/images/default_profile_1.png')}></Image></View>
                            <View style={{zIndex: 1, flex: 1, position: 'absolute', marginLeft: 20}}><Image
                                style={{width: 60, height: 60}}
                                source={require('../../assets/images/default_profile_2.png')}></Image></View>
                            <View style={{zIndex: 2, flex: 1, position: 'absolute', marginLeft: 40}}><Image
                                style={{width: 60, height: 60}}
                                source={require('../../assets/images/default_profile_3.png')}></Image></View>
                            <View style={{
                                zIndex: 3,
                                flex: 1,
                                position: 'absolute',
                                marginLeft: 51,
                                backgroundColor: 'rgba(0, 0, 0, 0.37);',
                                width: 38,
                                height: 38,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}><AppText style={{
                                    color: colors.defaultColor,
                                    fontSize: 10,
                                    textAlign: 'center'
                                }}>+2</AppText></View>
                        </View>
                    </View>
                </ScreenContainerView>

                <View style={{marginTop: 45}}>
                    <Image source={require('../../assets/images/map_tmp.png')} style={{width: '100%', height: 201}}/>
                    {/* TODO 카카오 지도 api 가져오기
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
                    </View> */}
                </View>

                <ScreenContainerView>
                    {
                        placeLength !== 0 ?
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
                                    <FlatList data={collectionData.places} renderItem={ShowPlaces}
                                        keyExtractor={(item) => item.place_pk.toString()}
                                        nestedScrollEnabled/>

                                </SafeAreaView>
                                <TouchableOpacity onPress={() => {
                                    // if(isLimited) setIsLimited(false);
                                    // else setIsLimited(true);
                                    // console.log(isLimited)
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 26,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
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
                                    </View>
                                </TouchableOpacity>
                            </View> :
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 40,
                                marginBottom: 52
                            }}>
                                <Image source={require('../../assets/images/empty_forDir.png')} style={{
                                    width: 150,
                                    height: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 12
                                }}></Image>
                                <AppText style={{fontSize: 14, color: colors.red_gray[2], fontWeight: '400'}}>공간이
                                    담겨있지 않아요!</AppText>
                            </View>
                    }

                </ScreenContainerView>

                <ScreenDivideLine style={{marginVertical: 16}}/>

                <ScreenContainerView>
                    <View style={{marginBottom: 143}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AppText style={{...styles.titles, color: colors.mainColor}}>댓글</AppText>
                            <AppText style={{
                                color: colors.gray[3],
                                fontSize: 14,
                                marginStart: 11,
                                marginTop: 5
                            }}>총 <AppText style={{fontWeight: '700'}}>20개</AppText></AppText>
                        </View>
                        <InputBox placeholder="보관함에 댓글을 남겨보세요!" style={{marginVertical: 20}}/>

                        <View flexDirection="row" style={{flex: 1, alignItems: 'flex-start'}}>
                            <View style={{marginRight: 8}}>
                                <Image source={require('../../assets/images/mountain.jpeg')}
                                    style={{width: 40, height: 40, borderRadius: 40, resizeMode: 'stretch'}}/>
                            </View>
                            <View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                    flexWrap: 'wrap'
                                }}>
                                    <AppText style={{color: colors.mainColor, fontSize: 12}}>minsun</AppText>
                                    <AppText style={{
                                        marginHorizontal: 8,
                                        color: colors.gray[5],
                                        fontSize: 10
                                    }}>|</AppText>
                                    <AppText style={{color: colors.gray[4], fontSize: 12}}>21.06.24</AppText>
                                </View>
                                <View style={{flex: 1, width: '100%'}}><AppText style={{
                                    fontSize: 12,
                                    color: colors.mainColor,
                                    lineHeight: 16,
                                    fontWeight: '700',
                                    flexWrap: 'wrap',
                                    width: windowWidth - 100
                                }}>
                                    종로 25년 토박종로 25년 토박이가 알려주는 종로 25년 토박종로 25년 토박이가 알려주는 종로 25년 토박종로 25년 토박이가 알려주는 종로 25년
                                    토박종로 25년 토박이가 알려주는
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

                    </View>
                </ScreenContainerView>
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
});

export default FreeCollectionScreen;