import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, className = '', style, ...props }) => {
  return (
    <View className={` shadow-md  shadow-gray-400/20  elevation-3 p-4 ${className} `} style={[ { shadowColor: 'gray', elevation: 4, }, style, ]} {...props} >
      {children}
    </View>
  );
};

export default Card;