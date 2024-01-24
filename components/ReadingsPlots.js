import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

import { SERVER_PATH } from '../config';
import { COLORS, globalStyles } from '../utils';

export function ReadingsPlots({ sensorID, mode }) {
    const [_sensorID, setSensorID] = useState(''); 
    const [temperatureReadings, setTemperatureReadings] = useState([]);
    const [humidityReadings, setHumilidityReadings] = useState([]);

    useEffect(() => {
        if (sensorID){
            setSensorID(sensorID);
            handleGetReadings(sensorID);
        }
    }, [sensorID]);

    const handleGetReadings = async (id) => {
        try{
            const t = await axios
            .get(`${SERVER_PATH}/readings/temperature/${id}/${mode}`)
            .then(res => res.data, err => console.log(err));

            if (t){
                setTemperatureReadings(t);
            }
        } catch (err) {
            console.log(err);
        }

        try{
            const h = await axios
            .get(`${SERVER_PATH}/readings/humidity/${id}/${mode}`)
            .then(res => res.data, err => console.log(err));

            if (h){
                setHumilidityReadings(h);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={[globalStyles.h2, styles.dark]}>Temperature ℃</Text>
            { !!temperatureReadings.length != 0 && 
                <LineChart 
                    data={{
                        labels: temperatureReadings.map(reading => reading.time),
                        datasets: [{
                            data: temperatureReadings.map(reading => reading.reading),
                        }]
                    }}
                    width={Dimensions.get('window').width - 60} // from react-native
                    height={220}
                    yAxisLabel={''}
                    xAxisLabel=''
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16
                        },
                        propsForDots: {
                          r: "6",
                          strokeWidth: "2",
                          stroke: "#ffa726"
                        }
                      }}
                      bezier
                      style={{
                        borderRadius: 16,
                        marginBottom: 20,
                      }}
                />
            }
            <Text style={[globalStyles.h2, styles.dark]}>Humidity %</Text>
            { !!humidityReadings.length != 0 && 
                <LineChart 
                    data={{
                        labels: humidityReadings.map(reading => reading.timestamp.slice(11, 16)),
                        datasets: [{
                            data: humidityReadings.map(reading => reading.reading),
                        }]
                    }}
                    width={Dimensions.get('window').width - 60} // from react-native
                    height={220}
                    yAxisLabel={''}
                    xAxisLabel=''
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16
                        },
                        propsForDots: {
                          r: "6",
                          strokeWidth: "2",
                          stroke: "#ffa726"
                        }
                      }}
                      bezier
                      style={{
                        borderRadius: 16
                      }}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        marginBottom: 20,
        paddingBottom: 40,
        paddingTop: 20,
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
      },
    header: {
        width: '100%',
        marginBottom: 20,
    },
    dark: {
        color: COLORS.white,
    },
});