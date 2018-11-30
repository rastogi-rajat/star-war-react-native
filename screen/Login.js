import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            passwordError: false,
            usernameError: false,
            detailsIncorrect: false
        }
    }
    static navigationOptions = {
        header: null
    }
    componentWillMount(){
        console.log('componentWillMount');
        AsyncStorage.getItem('userData', (err, result)=>{
            if(result){
                console.log('found it')
                this.props.navigation.navigate('Home');
            }
        });
    }
    componentDidMount(){
        console.log('componentDidMount')
    }
    componentWillUpdate(){
        console.log('componentWILLUPDATE')
    }
    componentWillReceiveProps(){
        console.log('componentWILLRe')
    }
    login = () => {
        this.setState({
            detailsIncorrect: false,
            passwordError: false,
            usernameError: false
        });
        if (this.state.username.length <= 0) {
            this.setState({error:'Enter Username', usernameError:true});
        } else if (this.state.password.length <=0) {
            this.setState({error:'Enter password', passwordError:true});
        } else {
            let url = `https://swapi.co/api/people/?search=${this.state.username}`;
            fetch(url)
            .then((res) => {
                return res.json();
            })
            .then( (res) => {
                const user = res.results[0];
                if(user){
                    if (user.name === this.state.username && user.birth_year === this.state.password) {
                        // store user and navigate
                        AsyncStorage.setItem("userData",this.state.username);
                        this.props.navigation.navigate('Home');
                    } else {
                        this.setState({error:'Incorrect password or username', detailsIncorrect:true});
                    }
                } else {
                    this.setState({
                        error:'Either username or password incorrect',
                        detailsIncorrect:true
                    });
                }
            })
            .catch((error) =>{
                console.error(error);
            });
        }
    }
    render() {
        return <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/logo.png')} />
            </View>
            <View style={styles.formContainer}>
                {this.state.detailsIncorrect && <Text style={styles.errorMsg}>{this.state.error}</Text>}
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Username"
                    placeholderTextColor='yellow'
                    disableFullscreenUI={true}
                    onChangeText={(value) => {this.setState({username: value})}}
                    value={this.state.username}
                />
                {this.state.usernameError && <Text style={styles.errorMsg}>{this.state.error}</Text>}
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Password"
                    placeholderTextColor='yellow'
                    disableFullscreenUI={true}
                    secureTextEntry={true}
                    onChangeText={(value) => {this.setState({password: value})}}
                    value={this.state.password}
                />
                {this.state.passwordError && <Text style={styles.errorMsg}>{this.state.error}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.login}
                >
                    <Text> Start War </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    logoContainer: {
        flex : 1,
        alignItems: 'center'
    },
    formContainer: {
        flex: 2,
        justifyContent: 'center',
        padding: 20
    },
    formInput: {
        borderBottomColor: '#ffe91a',
        borderBottomWidth: 2,
        color: '#ffe91a',
        fontSize: 18,
        marginBottom: 20
    },
    button: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#ffe91a'
    },
    errorMsg: {
        color: 'red',
        fontSize: 14
    }
  });
  