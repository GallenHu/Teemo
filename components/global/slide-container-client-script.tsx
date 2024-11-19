"use client";

import FullpageVerticalSlider from "fullpage-vertical-slider";
import React, { useEffect, useState } from "react";

export class SlideContainerClientScript extends React.Component {
  constructor(parameters: any) {
    super(parameters);
  }

  componentDidMount() {
    const fvs = new FullpageVerticalSlider({
      slidesContainerSelector: ".scroll-container",
      slideSectionSelector: ".section",
      responsiveMediaQuery: "(max-height: 100px)",
    });

    const $scrollContainerParent = document.querySelector(
      ".scroll-container-parent"
    );
    if ($scrollContainerParent) {
      $scrollContainerParent.classList.remove("invisible");
    }
  }

  render(): React.ReactNode {
    return null;
  }
}
