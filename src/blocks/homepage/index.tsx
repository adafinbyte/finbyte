import { FC } from "react";
import Hero from "./hero";
import About from "./about";
import HomepageGetStarted from "./get-started";

const Homepage: FC = () => (
  <div className="lg:p-12 p-4">
    <Hero/>

    <About/>

    <HomepageGetStarted/>
    <div className="lg:pb-12"/>
  </div>
)

export default Homepage;