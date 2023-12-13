package com.developaw.harupuppy.domain.schedule.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum AlertType {
  NONE("없음"),
  ON_TIME("정각"),
  FIVE_MINUTES("5분전"),
  THIRTY_MINUTES("30분전"),
  ONE_HOUR("1시간전");

  private final String desc;
}
