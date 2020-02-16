import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList , TouchableOpacity} from 'react-native'
import { Button, Avatar, Rating } from 'react-native-elements'

import { firebaseApp } from '../../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export default function ListReviews(props) {
    const { navigation, idRestaurant, setRating } = props
    const [reviews, setReviews] = useState([])
    const [reviewReload, setReviewReload] = useState(false)
    const [userLogged , setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useEffect(() => {

        (async () => {
            const resultReviews = []
            const arrayRating = []

            db.collection('reviews').where('idRestaurant', '==', idRestaurant)
                .get()
                .then(response => {
                    response.forEach(doc => {
                        resultReviews.push(doc.data())
                        arrayRating.push(doc.data().rating)
                    });
                    let numSum = 0;
                    arrayRating.map(value => {
                        numSum = numSum + value
                    })
                    const countRating = arrayRating.length
                    const resultRating = numSum / countRating
                    const resultRaringFinish = resultRating ? resultRating : 0
                    setReviews(resultReviews)
                    setRating(resultRaringFinish)
                })
            setReviewReload(false)
        })()

    }, [reviewReload])

    return (
        <View>
            {
                userLogged ? (
                    <Button
                    title='Escribir una opinión'
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    icon={{
                        type: 'material-community',
                        name: 'square-edit-outline',
                        color: '#00a680'
                    }}
                    onPress={() => navigation.navigate('AddReviewRestaurant', { idRestaurant: idRestaurant, setReviewReload: setReviewReload })}
                />

                ) :(
                        <TouchableOpacity  onPress={()=> navigation.navigate('Login')}>
                        <Text style = {{textAlign:'center', color:'#00a680' , padding:20}}
                               
                        > 
                            Para escribir un comentario es necsario estar logeado {' '}
                            <Text style={{fontWeight:'bold'}}>
                                pulsa AQUÍ para iniciar sesión
                            </Text>
                        </Text>
                        </TouchableOpacity>
                )
            }
           
            <FlatList
                data={reviews}
                renderItem={review => <Review review={review} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}


function Review(props) {
    const { title, review, rating, createAt, avatarUser } = props.review.item
    const createReview = new Date(createAt.seconds * 1000)
    console.log(avatarUser)
    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size='large'
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={{ uri: avatarUser ? avatarUser : 'https://api.adorable.io/avatars/116/abott@adorable.png' }}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating readonly imageSize={15} startingValue={rating}/>
    <Text style={styles.reviewDate}>
       {createReview.getDate()}/{createReview.getMonth()+1}/{createReview.getFullYear()} - {createReview.getHours()}:{createReview.getMinutes() < 10 ? '0' : ''} 
       {createReview.getMinutes()}
    </Text>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: 'transparent'
    },
    btnTitleAddReview: {
        color: '#00a680'
    },
    viewReview: {
        flexDirection: 'row',
        margin: 10,
        paddingBottom: 20,
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: 'flex-start'
    },
    reviewTitle: {
        fontWeight: 'bold'
    },
    reviewText: {
        paddingTop: 2,
        color: 'grey',
        marginBottom: 0
    },
    reviewDate:{
        marginTop:5,
        color:'grey',
        fontSize:12,
        position:'absolute',
        right:0,
        bottom:0

    }

})