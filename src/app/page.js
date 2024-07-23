import Image from "next/image";
import styles from "./page.module.css";
import Calculator from "./Calculate/page";
// import Header from "./Components/Header";
import LoginForm from "./Components/LoginForm";
import Welcome from "./Components/welcome";
import WelcomeSection from "./Components/WelcomeSection";
import { useDetailContext } from "./Steps/DetailContext";



export default function Home() {
  // const data = useDetailContext();

  // console.log('data',data)
  return (
    <>
      {/* <Welcome/> */}
<WelcomeSection/>
      {/* <LoginForm/>
     <Calculator/>  */}
   

    </>
  );
}
