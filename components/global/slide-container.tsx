import React from "react";
import { SlideContainerClientScript } from "./slide-container-client-script";

interface Props {
  sections: Array<() => React.JSX.Element | Promise<React.JSX.Element>>;
}

export const SlideContainer: React.FC<Props> = ({ sections }) => {
  return (
    <>
      <div className="h-full invisible scroll-container-parent">
        <div
          className="scroll-container"
          style={{ transition: "transform 0.4s" }}
        >
          {sections.map((sectionContent, i) => (
            <section key={i} className="section h-full">
              {sectionContent()}
            </section>
          ))}
        </div>
      </div>

      <SlideContainerClientScript />
    </>
  );
};
