import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  TouchableOpacity,
  PanResponder,
  ViewBase,
  View,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 250px;
  height: 250px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  elevation: 50;
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
    // input이 범위 바깥으로 나갔을 때 어떻게 처리할 지 명시해줄 수 있다.
    extrapolate: "clamp",
    /**
     * extend: 끝이 한계치를 넘어서 계속 진행
     * identity : 는 끝으로 가면 이상하게 동작함
     * clamp : 시작과 끝 점이 하나씩 있어서 다다르면 더 이상 진행되지 않음 (회전을 멈춘다.)
     */
  });
  // position.addListener(() => console.log(position, rotation));
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });

  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const goLeft = Animated.spring(position, {
    tension: 5,
    toValue: -500,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const goRight = Animated.spring(position, {
    tension: 5,
    toValue: 500,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // 화면 터치 시작 직후
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      // 손가락을 화면에서 땔 때
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -220) {
          goLeft.start(onDismiss);
        } else if (dx > 220) {
          goRight.start(onDismiss);
        } else {
          console.log("복귀");
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;

  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        <Card
          {...panResponder.panHandlers}
          style={{ transform: [{ scale: secondScale }] }}
        >
          <Ionicons name={icons[index + 1]} color="#192a56" size={94} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale: scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={94} />
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" color="white" size={58} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
