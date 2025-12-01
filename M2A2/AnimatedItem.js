import React from "react";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";

export default function AnimatedItem({ children, delay = 0, duration = 300, style }) {
  const entering = SlideInLeft.duration(duration).delay(delay);

  return (
    <Animated.View entering={entering} exiting={SlideOutRight} style={style}>
      {children}
    </Animated.View>
  );
}