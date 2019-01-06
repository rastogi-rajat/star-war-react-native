import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity, 
    AsyncStorage, 
    TextInput, 
    ScrollView, 
    ActivityIndicator, 
    FlatList} from 'react-native';

export default class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            planets: [""],
            apiError: false,
            loading: true,
            next:''
        }
        this.apiCount = 0;;
        this.searchTimeOut= null;
        this.apiCallReset = [];
    }

    componentDidMount() {
        this.props.navigation.setParams({ logoutFun: this.logout });
        this.homeScreenData();
    }
    homeScreenData = () =>{
        fetch(`https://swapi.co/api/planets/`)
        .then((res) => {
            return res.json();
        })
        .then((res)=>{
            this.setState({
                next: res.next,
                planets: res.results,
                loading: false
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
            headerTitle: <Text key={"logo"} style={{color: '#ffe91a',  fontSize:30}}>Star Wars</Text>,
            headerRight: (
              <TouchableOpacity
                onPress={navigation.getParam('logoutFun')}
              >
                <Text key={'logout'} style={{color: '#ffe91a', padding:10, fontSize:20}}>Logout</Text>
              </TouchableOpacity>
            ),
        };
    };
    
    search = async (value) => {
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
                fetch(value?`https://swapi.co/api/planets/?search=${value.trim()}&format=json`:`https://swapi.co/api/planets/`)
                .then((res)=>{
                    return res.json();
                })
                .then((res)=>{
                    this.setState({
                        next: res.next,
                        planets: res.results
                    });
                    this.apiCallReset.push(setTimeout(()=>{
                        this.apiCallReset.shift();
                        this.apiCount--;
                        if(this.apiCount< 5 ){
                            this.setState({
                                apiError: false
                            })
                        }
                    },60000))
                });
            }, 500)
        }
    }

    getFontSize(population) {
        let size = 20;
        if(parseInt(population, 10) >= 2000000000){
            size = 37;
        } else if(parseInt(population, 10) > 10000000){
            size = 34;
        } else if(parseInt(population, 10) > 1000000){
            size = 31;
        } else if(parseInt(population, 10) > 500000){
            size = 29;
        } else if(parseInt(population, 10) > 50000){
            size = 26;
        } else if(parseInt(population, 10) > 10000){
            size = 23;
        }
        return size;
    }
    
    loadMore = () => {
        if(this.state.next){
            this.setState({
                loading: true
            })
            fetch(this.state.next)
            .then((res) => {
                return res.json();
            })
            .then((res)=>{
                this.setState({
                    next: res.next,
                    planets: [...this.state.planets,...res.results,],
                    loading: false
                })
            })
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
            {this.state.apiError && <Text style={styles.errorMsg}>More then 5 search in a minute not allowed</Text>}
            {
                this.state.planets.length > 0 ? <FlatList 
                    data={this.state.planets}
                    keyExtractor={(planet, index)=>(`${planet.name}-${planet.diameter}`)}
                    renderItem ={({item})=>{
                        let fontSize = this.getFontSize(item.population);
                        return <Text 
                                style={{...styles.planetName,fontSize}}
                                onPress={()=>{this.props.navigation.navigate('Details', {
                                    detailURL: item.url,
                                })}}
                        >{item.name}</Text>
                    }}
                    onEndReached={() =>{
                        this.loadMore()
                    }}
                    onEndReachedThreshold={1}
                />:<Text key={"no_result"} style={styles.noPlanetMsg}>No Planet Found For Your Search!!!</Text>
            }
            {this.state.loading && <View style={styles.loaderContainer}>
                    <ActivityIndicator color='#ffe91a' size={70} />
            </View>}
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
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });
  