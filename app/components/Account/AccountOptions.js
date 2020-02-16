import React, {useState} from 'react'

import {StyleSheet , View, Text} from 'react-native'
import {ListItem} from 'react-native-elements'
import Modal from '../../components/Modal'

import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'

export default function AccountOptions (props) {

    const {userInfo , setReloadData , toastRef} = props
    console.log(userInfo)

    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    // const []
    const menuOpcions = [
        {
            title: "Cambiar Nombre y Apellido",
            iconType:"material-community",
            iconNameLeft:'account-circle',
            iconColorLeft:'#ccc',
            iconNameRight:'chevron-right',
            iconColorRight:'#ccc',
            onPress: () =>selectedComponent("displayname")
        },
        {
            title: "Cambiar Email",
            iconType:"material-community",
            iconNameLeft:'at',
            iconColorLeft:'#ccc',
            iconNameRight:'chevron-right',
            iconColorRight:'#ccc',
            onPress: () =>  selectedComponent("email")
        },
        {
            title: "Cambiar Contraseña",
            iconType:"material-community",
            iconNameLeft:'lock-reset',
            iconColorLeft:'#ccc',
            iconNameRight:'chevron-right',
            iconColorRight:'#ccc',
            onPress: () => selectedComponent("password")
        }
    ]

    const selectedComponent = (key) =>{
        setIsVisibleModal(true)
        switch(key){
            case 'displayname':
                setRenderComponent( <ChangeDisplayNameForm displayName={userInfo.displayName} 
                    setIsVisibleModal={setIsVisibleModal} 
                    setReloadData={setReloadData}
                    toastRef={toastRef}
                    />)
                setIsVisibleModal(true)
                break;
            case'email':
                setRenderComponent(<ChangeEmailForm
                    email={userInfo.email}
                    setIsVisibleModal={setIsVisibleModal}
                    setReloadData={setReloadData}
                    toastRef={toastRef}
                />)
                setIsVisibleModal(true)
                break;
            case 'password':
                setRenderComponent(<ChangePasswordForm
                    setIsVisibleModal={setIsVisibleModal}
                    toastRef={toastRef}
                    
                />)
                setIsVisibleModal(true)
                break;
            default:
                break;
        }
    }
    return (
        <View>
            {menuOpcions.map((menu, index)=>(
                <ListItem 
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name:menu.iconNameLeft,
                        color:menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name:menu.iconNameRight,
                        color:menu.iconColorRight
                        
                    }}
                    onPress={menu.onPress}
                    containerStyle={StyleSheet.menuItem}

                />
        ))}
        {
            renderComponent &&
            <Modal  isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
                    {renderComponent}
            </Modal> 
        }
       
        </View>

    )
}

const styles = StyleSheet.create({
    menuItem:{
        borderBottomWidth:1,
        borderBottomColor:'#e3e3e3'
    }
})