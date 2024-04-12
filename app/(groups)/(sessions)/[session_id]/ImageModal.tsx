import Colors from '@/Constants/Colors';
import { FasterImageView } from '@candlefinance/faster-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedImage = Animated.createAnimatedComponent(FasterImageView);

const ImagePage = () => {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const colorScheme = useColorScheme();

  const { targetHeight, targetWidth } = useMemo(() => {
    const { width, height } = Dimensions.get('window');

    const targetHeight = height * 0.9;
    const targetWidth = width * 0.9;

    return { targetHeight, targetWidth };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme ?? 'light'].fills.backdrop,
    },
    image: {
      width: targetWidth,
      height: targetHeight,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.image}>
        <AnimatedImage sharedTransitionTag={imageUri + 'image'} source={{ url: imageUri, resizeMode: 'contain' }} style={styles.image} />
      </Pressable>
    </View>
  );
};

export default ImagePage;

const styles = StyleSheet.create({});
