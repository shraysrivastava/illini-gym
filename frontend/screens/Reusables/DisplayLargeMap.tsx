import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import fetchImageFromFirebase from "../../firebase/images";
import ImageViewer from 'react-native-image-zoom-viewer';

const DisplayLargeMap = () => {
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const url = await fetchImageFromFirebase('test-images/arc-baseimage-1.png');
                setImageURL(url);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        loadImage();
    }, []);

    if (!imageURL) {
        return null;
    }

    const images = [{ url: imageURL }];

    return (
        <View style={styles.container}>
            <ImageViewer
                imageUrls={images}
                backgroundColor="transparent"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.midnightBlue,
    },
});

export default memo(DisplayLargeMap);
