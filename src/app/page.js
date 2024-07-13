import Image from "next/image";
import styles from "./page.module.css";
import Calculator from "./Components/Calculator";
import Header from "./Components/Header";
import LoginForm from "./Components/LoginForm";



export default function Home() {

  return (
    <main className={styles.main}>
      {/* <Header/> */}

     {/* <p>this is fine</p> */}
     <LoginForm/>
     <Calculator/>

    </main>
  );
}
