import React, {useLayoutEffect, useRef, useState} from 'react';
import merge from 'lodash.merge';
import {StyleSheet, Text, View} from 'react-native';
import performance, {PerformanceMeasure} from 'react-native-performance';
import {SchemaProcessor} from '@eva-design/processor';
import {mapping, light} from '@eva-design/eva';

const schemaProcessor = new SchemaProcessor();

const convertMsToSeconds = (milliseconds: number): string => {
  return (milliseconds / 1000).toFixed(2);
};

export default function App() {
  const [entries, setEntries] = useState<PerformanceMeasure[]>([]);
  const hasMeasuredCreateStyles = useRef(false);

  useLayoutEffect(() => {
    if (!hasMeasuredCreateStyles.current) {
      hasMeasuredCreateStyles.current = true;
      performance.mark('App.useLayoutEffect');
      const finalMapping = merge({}, mapping, light);
      performance.mark('mapping merged');
      const styles: any[] = [];
      for (let i = 0; i < 5; i++) {
        styles.push(schemaProcessor.process(finalMapping));
      }
      performance.mark('mapping processed');
      const newEntries = [
        performance.measure(
          'merging & processing mapping',
          'App.useLayoutEffect',
          'mapping processed',
        ),
        performance.measure(
          'processing mapping',
          'mapping merged',
          'mapping processed',
        ),
        performance.measure(
          'merging mapping',
          'App.useLayoutEffect',
          'mapping merged',
        ),
      ];
      setEntries(e => [...e, ...newEntries]);
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text>Perf metrics:</Text>
        {entries.map(entry => (
          <Text key={entry.name}>
            {entry.name} took {convertMsToSeconds(entry.duration)}s
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 300,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',
    opacity: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
