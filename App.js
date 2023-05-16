import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;
const AnimationBox = Animated.createAnimatedComponent(Box);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
export default function App() {
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  const borderRadius = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });

  const bgColor = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 166, 255)"],
  });

  position.addListener((prev) => {});

  const panResponder = useRef(
    PanResponder.create({
      // view에서 touch를 감지할 지 결정할 수 있도록 해줌
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          // 터치가 인식되고 움직이기 바로전 까지
          // 터치하기 전 위치를 x, y에 입력해주는 것
          x: position.x._value,
          y: position.y._value,
        });
        console.log(position.x, position.y);
      },

      // 손가락이 움직이는 것을 알려줌
      onPanResponderMove: (evt, { dx, dy }) => {
        // 인자로 evt(이벤트), gestureState 를 받음
        // console.log(`\ndx => ${dx}\ndy=>${dy}`);
        position.setValue({
          x: dx,
          y: dy,
        });
      },
      onPanResponderRelease: () => {
        position.flattenOffset();
      },
    })
  ).current;

  return (
    <Container>
      <AnimationBox
        {...panResponder.panHandlers}
        style={{
          transform: position.getTranslateTransform(),
          backgroundColor: bgColor,
          borderRadius: borderRadius,
        }}
      />
    </Container>
  );
}
