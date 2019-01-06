import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native';

export default class Details extends Component {
    constructor(props){
        super(props);
        this.state={
           details: null
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: 'black'
            },
            headerTintColor: '#ffe91a',
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

    componentWillMount(){
        this.props.navigation.setParams({ logoutFun: this.logout });
        fetch(this.props.navigation.getParam('detailURL'))
        .then((res)=> res.json())
        .then((details) => {
            this.setState({details})
        })
    }

    logout = async () => {
        await AsyncStorage.removeItem('userData');
        this.props.navigation.navigate('Login');
    }

    render() {
        return <View style={styles.container}>
            {
                this.state.details ? <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Name</Text>
                        <Text style={styles.textStyle}>{this.state.details.name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Climate</Text>
                        <Text style={styles.textStyle}>{this.state.details.climate}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Population</Text>
                        <Text style={styles.textStyle}>{this.state.details.population}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Diameter</Text>
                        <Text style={styles.textStyle}>{this.state.details.diameter}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Gravity</Text>
                        <Text style={styles.textStyle}>{this.state.details.gravity}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Orbital Period</Text>
                        <Text style={styles.textStyle}>{this.state.details.orbital_period}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Rotation Period</Text>
                        <Text style={styles.textStyle}>{this.state.details.rotation_period}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Surface Water</Text>
                        <Text style={styles.textStyle}>{this.state.details.surface_water} %</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.textStyle}>Terrain</Text>
                        <Text style={styles.textStyle}>{this.state.details.terrain}</Text>
                    </View>
                </ScrollView>:<View style={styles.loaderContainer}>
                    <ActivityIndicator color='#ffe91a' size={70} />
                </View>
            }
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    item: {
        flex: 1,
        flexDirection: 'row'
        
    },
    textStyle: {
        flex:1,
        fontSize: 24,
        color: '#ffe91a'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        marginLeft: 5,
        marginRight: 5
    }
  });
  