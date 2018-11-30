import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput} from 'react-native';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planets: [""],
            apiError: false
        }
        this.apiCount = 0;;
        this.searchTimeOut= null;
        this.apiCallReset = [];
    }
    componentDidMount() {
        this.props.navigation.setParams({ logoutFun: this.logout });
        fetch(`https://swapi.co/api/planets/`)
        .then((res) => {
            return res.json();
        })
        .then((res)=>{
            this.setState({
                planets: res.results,
                firstList: res.results
            })
        })
    }
    logout = async () => {
        await AsyncStorage.removeItem('userData');
        this.props.navigation.navigate('Login');
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTitle: <Text style={{color: '#ffe91a',  fontSize:30}}>Star Wars</Text>,
            headerRight: (
              <TouchableOpacity
                onPress={navigation.getParam('logoutFun')}
              >
                <Text style={{color: '#ffe91a', padding:10, fontSize:20}}>Logout</Text>
              </TouchableOpacity>
            ),
        };
    };
    search = async (value) => {
        if(value && value.length > 0) {
            let user = await AsyncStorage.getItem('userData');
            if (this.apiCount >= 5 && user !== "Luke Skywalker") {
                if(!this.state.apiError) {
                    this.setState({
                        apiError: true
                    })
                }
            } else {
                clearTimeout(this.searchTimeOut);
                this.searchTimeOut = setTimeout(()=>{
                    this.apiCount++;
                    fetch(`https://swapi.co/api/planets/?search=${value.trim()}&format=json`)
                    .then((res)=>{
                        return res.json();
                    })
                    .then((res)=>{
                        this.setState({
                            planets: res.results
                        });
                        this.apiCallReset.push(setTimeout(()=>{
                            this.apiCallReset.shift();
                            this.apiCount--;
                        },60000))
                    });
                    
                }, 1000)
            }
        }
    }
    render() {
        return <View style={styles.container}>
            <TextInput 
                    style={styles.formInput} 
                    placeholder="Search"
                    placeholderTextColor='#ffe91a'
                    disableFullscreenUI={true}
                    onChangeText={this.search}
            />
            {this.state.apiError && <Text style={styles.errorMsg}>More then 5 search not allowed</Text>}
            {
                this.state.planets.length > 0 ? this.state.planets.map((planet)=>{
                    return <Text key={planet.name} style={{...styles.planetName}}>{planet.name}</Text>
                }):<Text key="no_result" style={styles.noPlanetMsg}>No Planet Found For Your Search!!!</Text>
            }
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'black',
    },
    noPlanetMsg: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'red'
    },
    planetName: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      color: '#ffe91a'
    },
    logoutBtn: {
        backgroundColor: 'white',
        color: 'black'
    },
    formInput: {
        borderBottomColor: '#ffe91a',
        borderBottomWidth: 2,
        color: '#ffe91a',
        fontSize: 18,
        margin: 15,  
        marginBottom: 20,
    },
    errorMsg: {
        color: 'red',
        fontSize: 14
    }
  });
  